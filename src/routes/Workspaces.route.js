import express from 'express'
import workspaceController from '../controllers/workspace.controller.js'
import { authMidleware } from '../midleware/auth.midleware.js'


//Aca estamos creando un enrutador desde express:

const workspace_router = express.Router()

workspace_router.get('/',authMidleware,workspaceController.getAll)
workspace_router.post('/new_workspace',authMidleware,workspaceController.post)
workspace_router.get('/:workspace_id',workspaceController.getById)
workspace_router.post('/update/:workspace_id',workspaceController.updateBiId)
workspace_router.get('/workspace/:workspace_name',workspaceController.getByName)

export default workspace_router


