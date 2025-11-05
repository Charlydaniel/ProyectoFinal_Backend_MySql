import ENVIRONMENT from "../config/environment.config.js"
import serverError from "../utils/customError.utils.js"
import jwt from 'jsonwebtoken'


export function authMidleware (request, response, next) {

    try {
   
        const authorization_header = request.headers.authorization
      
        if (!authorization_header) {
            
           throw new serverError(400, 'No hay header de autorizacion')
        }
        else
            {
                const auth_token = authorization_header.split(' ').pop()

                if (!auth_token) {
                    throw new serverError(400, 'No hay token de autorizacion')
                }
                
                const user_data= jwt.verify(auth_token,ENVIRONMENT.JWT_SECRET_KEY)
                    request.user=user_data
                    next()
            }

    }
    catch (error) {
        if(error instanceof jwt.JsonWebTokenError){
            return response.status(401).json(
                {
                    ok:false,
                    status:401,
                    message: 'Token invalido'
                }
            )
        }
          if(error instanceof jwt.TokenExpiredError){
            return response.status(401).json(
                {
                    ok:false,
                    status:401,
                    message: 'Token Token expirado'
                }
            )
        }
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
                    message: 'Error interno del servidor AUTH-MID' + error
                }
            )
        }
    }


}

