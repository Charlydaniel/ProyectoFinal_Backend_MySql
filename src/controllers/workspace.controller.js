// La capa de control se va a encargar de manejar la consulta y la respuesta

import serverError from "../utils/customError.utils.js"
import workspacesRepository from "../Repositories/workspaces.repository.js"
import MemberWokspaceRepository from "../Repositories/member_workspace.repository.js"
import memberWorkspaceController from "./member_workspace.controller.js"
import inviteService from "../services/Invite.service.js"
import ChannelRepository from "../Repositories/channel.repository.js"



class workspaceController {

    static async post(request,response) {

        const name = request.body.name
        const url_image = request.body.image

        let msg = 'Nombre de Workspace invalido: '
        let ok = false
        let status = 201
        const ok_message = 'Workspace creado'


        try {
            if (typeof (name) !== 'string' || typeof (url_image) !== 'string') {
                msg = msg + 'Tipo de dato incorrecto para el workspace'
                status = 400
                throw new serverError(status, msg)
            }
            else if (!name || !url_image) {
                msg = msg + 'Debe completar toda la informacion para poder crear un workspace'
                status = 400
                throw new serverError(status, msg)
            }
            else if (name.length > 30 || name.length < 5) {
                msg = msg + 'Nombre debe tener entre 5 y 30 caracteres'
                status = 400
                throw new serverError(status, msg)
            }
            /*   
                //En este caso se permite creacion 
                //de Workspaces repetidos ya que Salck lo permite tambien        
            else if (await workspacesRepository.getByName(name)) {
                msg = msg + 'El workspace ya existe: No se puede crear un workspace repetido'
                status = 400
                throw new serverError(status, msg)
            } */
            else {
                msg = ok_message
                const workspace_id_created=await workspacesRepository.createWorkspace(name,url_image)
                
                consolelo.ChannelRepository('WP CREADO: ', workspace_id_created)

                if(!workspace_id_created){
                    throw new serverError( 500, 'Eror en la creación del workspace'
                    )
                }
                const member_workspace_id=await MemberWokspaceRepository.create(request.user.id,workspace_id_created,'admin')
                
                consolelo.ChannelRepository('MIEMBRO WP CREADO: ', member_workspace_id)

                if(!member_workspace_id){
                    throw new serverError(404,'Error al crear miembro')
                }

                const channe_id_created = await ChannelRepository.create('general-'+name,false,workspace_id_created)

                consolelo.ChannelRepository('CANAL CREADO: ', member_workspace_id)

                if(!member_workspace_id){
                    throw new serverError(404,'Error al crear canal general para el workspace ')
                }

                const member_channel_created= await ChannelRepository.creatMemberChannel(channe_id_created.id,request.use.id)

                consolelo.ChannelRepository('MIEMBRO CANAL CREADO: ', member_workspace_id)

                if(!member_channel_created){
                    throw new serverError(404,'Error al crear miembro del canal general  ')
                }

                status = 201
                ok = true

                return response.status(status).json(
                    {
                        ok: ok,
                        status: status,
                        message: msg,
                        workspace_id:workspace_id_created
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
            else {

            }
            return response.status(500).json(
                {
                    ok: false,
                    status: 500,
                    message: 'Error interno del servidor: ' +error
                }
            )
        }

    }
    static async getAll(request, response) {
        
        try{
            
            const workspaces = await workspacesRepository.getAll()

            if(!workspaces){
                throw new serverError(404,'No se encontraron workspaces')
            }

           return response.status(201).json(
                {
                    status:201,
                    message:`Workspaces encontrados del usuario: ${request.user.email}`,
                    ok:true,
                    data: workspaces
                }
            )
        }
        catch (error) {
                if (error.status) {
                    return response.status(error.status).json(
                        {
                            ok: false,
                            message: error.message
                        }
                    )
                }
                else{
                    return response.status(500).json(
                        {
                            ok:false,
                            message: 'Error interno del servidor ' + error
                        }
                    )
                }
        
        }
    }
    static async getById(request, response) {

        const workspace_id = request.params.workspace_id
        
        try {
            if (!isNaN(workspace_id)) {

                const workspace = await workspacesRepository.getById(workspace_id)

                if (!workspace) {
                    throw new serverError(400, `Workspace_id: ${workspace_id} no encontrado`)
                }
                else {
                    return response.json(
                        {
                            ok: true,
                            message: `Workspace: ${workspace_id} encontrado`,
                            data: {
                                workspace: workspace
                            }
                        }
                    )
                }
            }
            else {

                return response.json(
                    {
                        ok: false,
                        message: `Workspace_id: ${workspace_id} no es correcto`
                    }
                )

            }
        }
        catch (error) {
                if (error.status) {
                    return response.status(error.status).json(
                        {
                            ok: false,
                            message: error.message
                        }
                    )
                }
                else{
                    return response.status(500).json(
                        {
                            ok:false,
                            message: 'Error interno del servidor ' + error
                        }
                    )
                }
        
        }

    }
    static async getByName(request, response) {

        const workspace_name = request.params.workspace_name

        try {
            if (isNaN(workspace_name)) {

                const workspace = await workspacesRepository.getByName(workspace_name)
            
                if (workspace.length === 0) {
                    throw new serverError(400, `Workspace: ${workspace_name} no encontrado`)
                }
                else {
                    return response.json(
                        {
                            ok: true,
                            message: `Workspace: ${workspace_name} encontrado`,
                            data: {
                                workspace: workspace
                            }
                        }
                    )
                }
            }
            else {

                return response.json(
                    {
                        ok: false,
                        message: `Workspace: ${workspace_id} no es correcto`
                    }
                )

            }
        }
       catch (error) {
                if (error.status) {
                    return response.status(error.status).json(
                        {
                            ok: false,
                            message: error.message
                        }
                    )
                }
                else{
                    return response.status(500).json(
                        {
                            ok:false,
                            message: 'Error interno del servidor ' + error
                        }
                    )
                }
        
        }

    }
    static async updateBiId(request,response){

     try{
        const {workspace_id}=request.params
        const new_values=request.body

         if (!isNaN(workspace_id)) {
            const workspace_exist= workspacesRepository.getById(workspace_id)

            if(!workspace_exist){
                throw new serverError(404,'Usuario no encontrado')
            }
            const workspace_updated=await workspacesRepository.updateById(workspace_id,new_values)

            return response.status(201).json(
                {
                    ok:true,
                    message:'Workspce modificado correctamente'
                }
            )
        }
        else
        {
            return response.status(400).json(
                {
                    ok:false,
                    message:'ID recibido es incorrecto'
                }
            )
        }
        
     }
     catch (error) {
                if (error.status) {
                    return response.status(error.status).json(
                        {
                            ok: false,
                            message: error.message
                        }
                    )
                }
                else{
                    return response.status(500).json(
                        {
                            ok:false,
                            message:'Error interno del servidor: ' + error,
                        }
                    )
                }
        
        }
    }
}
export default workspaceController