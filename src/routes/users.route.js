import express from 'express'
import User_controller from '../controllers/user.controller.js'
import { authMidleware } from '../midleware/auth.midleware.js'


const user_router = express.Router()


// ENTONCES PODEMOS USAR .JSON, ES LA FORMA MAS CORRECTA:
//Si vamos a ejecutar funciones async debemos pasar una funcion async como parametro tambien:

user_router.get('/', authMidleware,User_controller.getAll)
user_router.get('/:user_id',authMidleware, User_controller.getBiId)
user_router.put('/update/:user_id',authMidleware,User_controller.updateBiId)
user_router.get('/get_user/get',authMidleware,User_controller.getUserSession)


export default user_router

