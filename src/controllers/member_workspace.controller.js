import ENVIRONMENT from "../config/environment.config.js"
import transporter from "../config/mailer.config.js"
import MemberWokspaceRepository from "../Repositories/member_workspace.repository.js"
import userRepository from "../Repositories/user.repository.js"
import workspacesRepository from "../Repositories/workspaces.repository.js"
import serverError from "../utils/customError.utils.js"
import jwt from 'jsonwebtoken'

const USER_PROFILE={
    admin:'admin',
    common_user:'user'
}

class memberWorkspaceController {

    static async confirmInvitation(request, response) {

        try {
            const token = request.params.verification_token

            const {
                    id_invited,
                    email_invited,
                    id_workspace,
                    id_inviter
                    } = jwt.verify(token, ENVIRONMENT.JWT_SECRET_KEY)

         
            const member_created =await MemberWokspaceRepository.create(id_invited, id_workspace, 'user')
                
            if(!member_created){
                throw new serverError(404,'Error al crear miembro en el workspace')
            }
            response.redirect(`${ENVIRONMENT.URL_FRONTEND}/login`)
        }
        catch (error) {
            console.log(error)
            if(error instanceof jwt.JsonWebTokenError) {
                response.status(400).json({ ok: false, status: 400, message: 'Token invalido' })
            }
            else if( error instanceof jwt.TokenExpiredError) {
                response.status(400).json({ ok: false, status: 400, message: 'Token expirado' })
            }
            else if( error.status ){
                response.status(error.status).json({ ok: false, status: error.status, message: error.message })
            }
            else {
                response.status(500).json({ ok: false, status: 500, message: 'Error interno del servidor' })
            }
        }
    }
    static async create(request,response) {

        try {

            const user_id=request.body.user_id
            const {workspace_id} = request.params

            //En caso de crearse dede el agregado de miembros será user.
            //En caso de estar creandose un nuevo Workspace el usuario de la sesión será admin
            const user_rol = (rol)=>{
                if(user_id===request.user.id){
                    return USER_PROFILE.admin
                }
                else{
                    return USER_PROFILE.common_user 
                }
            }

            let msg = 'Error:'
            let status = 201
            let ok=true

            const workspace_existe = await workspacesRepository.getById(workspace_id)

            if (!workspace_existe) {
                msg = msg + "Workspace inexistente",
                status = 400
                ok=false
                throw new serverError(status, msg,ok)
            }
            
            const user_validated= await userRepository.getById(user_id)

            if(!user_validated){
                throw new serverError(404,'Usuario inexistente')
            }

            const member_now= await MemberWokspaceRepository.
                                getMemberWorkspaceByUserIdAndWorkspaceId(user_id, workspace_id)


            if(member_now){
                throw new serverError(409,`El usuario ${member_now.username} ya es miembro del workspace`)
            }
            const member_id = await MemberWokspaceRepository.create(user_id, workspace_id,user_rol())

            return response.json(
                {
                    ok: true,
                    message: 'Miembro creado para el workspace',
                    status: status,
                }

            )
        }
        catch (error) {

            if (error.status) {

                return response.status(error.status).json(
                    {
                        ok: false,
                        status: error.status,
                        message: error.message
                    }
                )
            }
            return response.status(500).json(
                {
                    ok: false,
                    status: 500,
                    message: 'Error interno del servidor: ' + error
                }
            )
        }

    }
    static async getMemberWorkspaceByUserIdAndWorkspaceId(request, response){

      try{
            const member_id = request.body.user_id
            const {workspace_id}= request.params

            if(isNaN(member_id) && isNaN(workspace_id)){
                throw new serverError(400, 'Tipos de datos incorrectos')
            }
            else{
                const member_workspace= await MemberWokspaceRepository.
                getMemberWorkspaceByUserIdAndWorkspaceId(member_id,workspace_id)

                return response.status(201).json(
                    {
                        ok:true,
                        message:'Relacion encontrada',
                        data:{member_workspace}
                    }
                )
            }
      }
      catch (error) {

            if (error.status) {

                return response.status(error.status).json(
                    {
                        ok: false,
                        status: error.status,
                        message: error.message
                    }
                )
            }
            return response.status(500).json(
                {
                    ok: false,
                    status: 500,
                    message: 'Error interno del servidor: ' + error
                }
            )
        }

    }
    static async deleteMember(request,response){

        try{

            const user_id= request.body.user_id
            const {workspace_id}= request.params

            const member= await MemberWokspaceRepository.
                getMemberWorkspaceByUserIdAndWorkspaceId(user_id,workspace_id)
                                                                                                                    
            if(!member){
                throw new serverError(404,'Miembro no existente')
            }
            else{
                await MemberWokspaceRepository.deleteMember(user_id,workspace_id)

                return response.status(201).json(
                    {
                        ok:true,
                        status:404,
                        message:`Miembro ${member.username} eliminado correctamente del workspace ${member.nombre}`
                    }
                )
            }
        }
        catch (error) {

            if (error.status) {

                return response.status(error.status).json(
                    {
                        ok: ok,
                        status: error.status,
                        message: error.message
                    }
                )
            }
            return response.status(500).json(
                {
                    ok: false,
                    status: 500,
                    message: 'Error interno del servidor: ' + error
                }
            )
        }

    }
    static async inviteMember(request,response){

        try {
            //Datos del middleware:
            const { member, workspace, user } = request
            const  invited_email = request.body.email
            
            //Buscar al usuario y validar que exista y este activo
            const user_invited = await userRepository.getByEmail(invited_email)

            if (!user_invited) {
                throw new serverError(404, 'Usuario no encontrado')
            }
            //Verificar que NO es miembro actual de ese workspace 
            const member_data = await MemberWokspaceRepository.getMemberWorkspaceByUserIdAndWorkspaceId(
                user_invited.id, workspace.id
            )
            if (member_data) {
                throw new serverError(409, `Usuario con email ${invited_email} ya es miembro del workspace`)
            }

            const id_inviter = member.id
   
            const invite_token = jwt.sign(
                {
                    id_invited: user_invited.id,
                    email_invited: invited_email,
                    id_workspace: workspace.id,
                    id_inviter: id_inviter
                },
                ENVIRONMENT.JWT_SECRET_KEY,
                {
                    expiresIn: '7d'
                }
            )

            //Enviar mail de invitacion al usuario invitado
            await transporter.sendMail(
                {
                    from: ENVIRONMENT.GMAIL_USERNAME,
                    to: invited_email,
                    subject: 'Invitacion al workspace',
                    html: `<h1>El usuario: ${user.email} te ha enviado una invitación
                            al workspace ${workspace.nombre}<h1/>
                            <a href='${ENVIRONMENT.URL_API_BACKEND}/api/workspace_member/confirm-invitation/${invite_token}'>
                                Click para aceptar
                            <a/>
                            `
                }
            )

            response.status(200).json({
                ok: true,
                status: 200,
                message:'Usuario invitado con exito',
                data: null
            })

        }
        catch (error) {
            //Evaluamos si es un error que nosotros definimos
            if (error.status) {
                return response.status(error.status).json(
                    {
                        ok: false,
                        status: error.status,
                        message: error.message
                    }
                )
            }
            else {
                return response.status(500).json(
                    {
                        ok: false,
                        status: 500,
                        message: 'Error interno del servidor: '+error
                    }
                )
            }
        }
    }
    static async getMembersByWorkspaceId(request,response){

    try{
    
        const {workspace_id}=request.body
        
        if(workspace_id){
             const members=await MemberWokspaceRepository.getMembersByWorkspaceId(workspace_id)
        
             return response.status(201).json(

                {
                    ok:true,
                    status:201,
                    message:"Miembros encontrados",
                    members:members.length,
                    data:members
                }
             )
        }
        else{
            throw new serverError(400,'Workspace enviado vacío')
        }
    }
       catch(error){
        return response.status(400).json
        (
            {
                ok:false,
                message:"Error interno del servidor: " + error,
                status:400    
             }
        )
       } 


    }
    }

export default memberWorkspaceController