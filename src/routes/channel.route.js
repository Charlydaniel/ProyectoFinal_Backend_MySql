import Express from 'express'
import { authMidleware } from '../midleware/auth.midleware.js'
import workspaceMidleware from '../midleware/workspaces.midlewares.js'
import ChannelController from '../controllers/channel.controller.js'
import channelMidleware from '../midleware/channel.midleware.js'


const channels_route= Express.Router()

channels_route.post('/create/:workspace_id',authMidleware,workspaceMidleware(['admin']),ChannelController.create)
channels_route.post('/get_channel_by_workspace/:workspace_id',authMidleware,workspaceMidleware(['admin','user']),ChannelController.getAllByWorkspaceAndEmail)
channels_route.post('/upd_channel/:workspace_id',authMidleware,workspaceMidleware(['admin','user']),channelMidleware,ChannelController.updateById)

export default channels_route

