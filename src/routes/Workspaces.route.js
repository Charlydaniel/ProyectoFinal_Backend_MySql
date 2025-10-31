import express from 'express'
import workspaceController from '../controllers/workspace.controller.js'
import { authMidleware } from '../midleware/auth.midleware.js'


//Aca estamos creando un enrutador desde express:

const workspace_router = express.Router()

//Cuando me consulten a esta direccion respondere con la lista de espacios de trabajo guardada en mi DB
workspace_router.get('/',authMidleware,workspaceController.getAll)
//Endpoint para crear workspaces:
workspace_router.post('/new_workspace',authMidleware,workspaceController.post)

//Route param o URL param
//Usamos esta vez request, la propiedad params es donde estan los valores de parametros de busqueda
//EJEMPLO: Si la ruta es /workspaces/:workspace_id, entonces request.params será un objeto
// que va a tener la propiedad workspace_id:valor_workspace_id, siempre será un string

workspace_router.get('/:workspace_id',workspaceController.getById)
workspace_router.post('/update/:workspace_id',workspaceController.updateBiId)
workspace_router.get('/workspace/:workspace_name',workspaceController.getByName)

export default workspace_router


