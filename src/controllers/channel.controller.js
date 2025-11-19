import ChannelRepository from "../Repositories/channel.repository.js";
import userRepository from "../Repositories/user.repository.js";
import serverError from "../utils/customError.utils.js";


class ChannelController {

    static async create(request, response) {

        try {

            const { workspace_id } = request.params

            const { name } = request.body

            if (!name || !workspace_id) {

                return response.status(400).json({
                    ok: false,
                    status: 400,
                    message: "Nombre del canal y workspace_id son requeridos",
                });
            }
            const workspaceChannels = await ChannelRepository.getAllByWorkspaceAndName(
                workspace_id, name
            );

            if (workspaceChannels.length > 0) {
                return response.status(409).json({
                    ok: false,
                    status: 409,
                    message: "Ya existe un canal con este nombre en el workspace",
                });
            }

            const isPrivate = false;
            await ChannelRepository.create(
                name,
                isPrivate,
                workspace_id
            )

            const updatedChannels =
                await ChannelRepository.getAllByWorkspace(
                    workspace_id
                )

            return response.status(201).json({
                ok: true,
                status: 201,
                message: "Canal creado con éxito",
                data: {
                    channels: updatedChannels,
                },
            });
        } catch (error) {
            return response.status(500).json({
                ok: false,
                status: 500,
                message: "Error interno del servidor al crear el canal",
            });
        }
    }
    static async getAllByWorkspaceAndEmail(request, response) {

        try {
            const { workspace_id } = request.params

            const user_id = request.user.id


            const channels = await ChannelRepository.getByWorkspaceIdAndUserid(
                user_id, workspace_id
            );


            return response.json({
                ok: true,
                status: 200,
                message: "Lista de canales obtenida",
                data: channels

            })


        }
        catch (error) {
            return response.status(500).json({
                ok: false,
                status: 500,
                message: "Error interno del servidor al listar los canales: " + error,
            });
        }
    }
    static async updateById(request, response) {

        try {
    
            const  channel_id  = request.body.channel_id
            const data_update = request.body.update_data


            if(isNaN(channel_id)){
                throw new serverError(415,'Tipo de datos incorrecto')
            }

            const updated_channel = ChannelRepository.updateById(channel_id,data_update)
            
            if(!data_update){
                throw new serverError(422,'No se pudo actualizar el canal')
            }

            return response.status(201).json(
                {
                    ok:true,
                    message:'Canal actualizado',
                    status:201,
                    data:data_update
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
            else {
                return response.status(500).json(
                    {
                        ok: false,
                        message: 'Error interno del servidor' + error
                    }
                )
            }
        }
    }
}

export default ChannelController