import Express from 'express'
import memberWorkspaceController from '../controllers/member_workspace.controller.js'
import { authMidleware } from '../midleware/auth.midleware.js'
import workspacemidleware from '../midleware/workspaces.midlewares.js'
import member_routes from './member_workspace.route.js'

const channels_route= Express.Router()

member_routes.post('/channe/:channel_id',authMidleware,workspacemidleware(['admin']),memberWorkspaceController.create)

export default channels_route

