import Express from 'express'
import memberWorkspaceController from '../controllers/member_workspace.controller.js'
import { authMidleware } from '../midleware/auth.midleware.js'
import workspacemidleware from '../midleware/workspaces.midlewares.js'

const member_routes= Express.Router()

member_routes.post('/:workspace_id/add_member',authMidleware,workspacemidleware(['admin']),memberWorkspaceController.create)
member_routes.post('/:workspace_id/delete_member',authMidleware,workspacemidleware(['admin']),memberWorkspaceController.deleteMember)
member_routes.get('/:workspace_id/member_workspace',authMidleware,workspacemidleware([]),memberWorkspaceController.getMemberWorkspaceByUserIdAndWorkspaceId)
member_routes.post('/:workspace_id/invite',authMidleware,workspacemidleware(['admin']),memberWorkspaceController.inviteMember)
member_routes.get('/confirm-invitation/:verification_token',memberWorkspaceController.confirmInvitation)
member_routes.post('/get_by_workspaces/get_members',authMidleware,memberWorkspaceController.getMembersByWorkspaceId)

export default member_routes

