import express from 'express'
import AuthController from '../controllers/auth.controller.js'
import { authMidleware } from '../midleware/auth.midleware.js'

const auth_router= express.Router()

//ENDPOINTS:

auth_router.post('/register', AuthController.register)
auth_router.put('/login',AuthController.login)
auth_router.get('/verify-email/:verification_token',AuthController.verifyEmail)

export default auth_router