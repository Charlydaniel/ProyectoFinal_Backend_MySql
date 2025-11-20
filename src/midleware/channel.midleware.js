
import ChannelRepository from "../Repositories/channel.repository.js"
import MemberWokspaceRepository from "../Repositories/member_workspace.repository.js"
import workspacesRepository from "../Repositories/workspaces.repository.js"
import serverError from "../utils/customError.utils.js"


export default async function channelMidleware(request,response,next){
    

        try{

           
            const channel_id = request.body.channel_id
            const workspace_id = request.params.workspace_id

            const channel_found = await ChannelRepository.getById(channel_id)
            
            if(!channel_found){
                throw new serverError(404,'Canal no encontrado')
            }
            const user=  request.user
            const member_user_data = await ChannelRepository.getByWorkspaceIdAndUserid(user.id,workspace_id)
            
            if(!member_user_data){
                throw new serverError(403,'Usuario sin autorización')
            }
            next()
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
            else {
            }
            return response.status(500).json(
                {
                    ok: false,
                    status: 500,
                    message: 'Error interno del servidor CH-MIDD : ' + error 
                }
            )
    }
}  
