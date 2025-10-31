//Que obtenga el workspace del request solo si es miembro
//Que obtenga datos de membresia del usuario solicitante
// Validacion por role

import MemberWokspaceRepository from "../Repositories/member_workspace.repository.js"
import workspacesRepository from "../Repositories/workspaces.repository.js"
import serverError from "../utils/customError.utils.js"


function  workspaceMidleware(valid_member_roles=[]){



    return async function(request,response,next) {
    
        try{

            const {workspace_id} = request.params
    
            //Chequear que el el workspace exista
            const workspace_found = await workspacesRepository.getById(workspace_id)

            if(!workspace_found){
                throw new serverError(404,'Workspace no encontrado')
            }
            //Chequear que el usuario sea MIEMBRO del workspace
            const user=  request.user
            const member_user_data = await MemberWokspaceRepository.
            getMemberWorkspaceByUserIdAndWorkspaceId(user.id,workspace_id)
    
            if(!member_user_data){
                throw new serverError(403,'Usuario sin autorización')
            }
             //Checkear que cuente con el rol necesario
            if (
                valid_member_roles.length > 0 
                &&
                !valid_member_roles.includes(member_user_data.rol)
            ) {
                throw new serverError(403, "No tenés permisos suficientes")
            }
            request.workspace = workspace_found
            request.member = member_user_data;
            next()
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

            }
            return response.status(500).json(
                {
                    ok: false,
                    status: 500,
                    message: 'Error interno del servidor WP-MIDD : ' + error 
                }
            )
    }
        }  
}
export default workspaceMidleware
//workspaceMidleware(['admin']) 
//funcion que recibe request repsponse y next 
// //Estara configurada para esos roles en particular