import auth_router from "../routes/auth.router.js";
import serverError from "../utils/customError.utils.js";
import AuthService from "../services/auth.service.js";
import userRepository from "../Repositories/user.repository.js";
//Libreria para encriptacion.
import bcrypt, { compare } from 'bcrypt'

class AuthController {

    static async register(request, response) {

        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const password_length = 8

        try {
            const {
                email,
                name,
                password
            } = request.body

            if (!name) {
                throw new serverError(400, 'Nombre de usuario incorrecto, debes completar un usuario')
            }
            else if (!email) {
                throw new serverError(400, 'Email incorrecto, debes completar un Email')
            }
            else if (!String(email).toLocaleLowerCase().match(regexEmail)) {
                throw new serverError(400, 'Formato de email incorrecto, el email ingresado no es válido')
            }
            else if (!password) {
                throw new serverError(400, 'Contraseña incorrecto, debes completar una contraseña')
            }
            else if (password.length < password_length) {
                throw new serverError(400, `Contraseña inválida: La contraseña debe tener como mínimo ${password_length} caracteres`)
            }

            const user_found = await userRepository.getByEmail(email)
       
            if (user_found) {

                if(user_found.activo === 0){
                    
                    await userRepository.updateById(user_found.id,{activo:1})
                
                    return response.status(201).json(
                            {
                                ok: true,
                                message: `Usuario rehabilitado ${email}`,
                                usuario: user_found
                            }
                        )
                }
                else {
                    throw new serverError(409, `No se puede registrar al usuario ${email}: Usuario ya registrado anteriormente`)
                }
            }

            const created_user=await AuthService.register(name, password, email)

            return response.status(201).json(
                {
                    ok: true,
                    message: `Registro exitoso para ${email}`,
                    usuario: created_user
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
                        message: 'Error interno del servidor en auth controller: ' + error
                    }
                )
            }
        }

    }

    //Como hacer establecimiento de contraseña:
    // GET /api/auth/forgot-password:user_email
    //Validar que el email pertenezca a un usuario.
    //Crear un token con el user_id
    //Enviar un mail al usuario con el link de reestablecimiento. En este link tendra el token creado.
    //http://url_frontend.com/reset-password/:reset_token
    //Del lado del frontend hay que hacer un formulario que te solicite la nueva contraseña.
    //Debe enviar la contraseña nueva como el reset token.
    //POST /api/auth/reset-password/:reset_token
    /*Por: body:{
                new password
                }
                -Validar token.
                -Encriptar nueva contraseña.
                -Actualizar la contraseña en la DB
                 */


    static async login(request, response) {
        
        try {

            const { email, password } = request.body

            const user_found = await userRepository.getByEmail(email) 
                    
            if(user_found){
                const is_same_password = await bcrypt.compare(password, user_found.password)
        
            if(user_found.verificado === 0){
                throw new serverError(401, 'Email no verificado')
            }

                if (!is_same_password) {
                    throw new serverError(401, 'Usuario o contraseña incorrecta')
                }
            }
            else{
                throw new serverError(400, 'Usuario o contraseña incorrecta')
            }
            
            /*Validar que el email y la password sean validos */
            const authorization_token  = await AuthService.login(user_found)
            
            return response.json(
                {
                    ok: true,
                    message: 'Loguin exitoso',
                    status: 200,
                    data: {
                        authorization_token: authorization_token
                    }
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
    static async verifyEmail(request, response) {
        try {
            const { verification_token } = request.params

            const usr_updated = await AuthService.verifyEmail(verification_token)

        if(usr_updated){
            
            return response.json(
                {
                    ok: true,
                    status: 200,
                    message: 'Usuario validado ok',
                    user_id:usr_updated.id
                }
            )
        }
        else{
            throw new serverError(404, 'User not found')
        }


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

export default AuthController