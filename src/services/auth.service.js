import transporter from "../config/mailer.config.js"
import userRepository from "../Repositories/user.repository.js"
import serverError from "../utils/customError.utils.js"
import jwt from 'jsonwebtoken'

//Libreria para encriptacion.
import bcrypt, { compare } from 'bcrypt'
import ENVIRONMENT from "../config/environment.config.js"


class AuthService {

    static async register(username, password, email) {
    
        //2-Encriptar la contraseña
        //Hashear la contraseña
        //Parametros: Contraseña y cantidad de rondas, mientras mas rondas mas tardara en procesarse
        const hash_pass = await bcrypt.hash(password, 12)

        //Guardarlo en la base de datos.
        const user_created = await userRepository.createUser(username, email, hash_pass)

        const verification_token = jwt.sign(
            {
                email: email,
                user_id: user_created.id
            },
            ENVIRONMENT.JWT_SECRET_KEY
        )

        //const email=created_user.email
        const to_email=email
        const from_email='utntestmaildev@gmail.com'
        //Enviar un mail de verificación
        await transporter.sendMail(
            {
                from: to_email ,
                to: to_email,
                subject: 'Correo de verificacion UTN validacion de usuario',
                html: `<h1>Bienvenido a Slack <h1/>
                <p>Este es un mail de verificacion<p/>
                <a href='${ENVIRONMENT.URL_API_BACKEND}/api/auth/verify-email/${verification_token}'>Click para verificar<a/>`

            }

        )
        
            return user_created

    }
    static async verifyEmail(verification_token) {
        try {
            const payload = jwt.verify(verification_token, ENVIRONMENT.JWT_SECRET_KEY)
           
           const usr_updated= await userRepository.updateById(payload.user_id,{verificado: true})
           return usr_updated
        }
        catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                throw new serverError(400, 'Token inválido')
            }
            throw error
        }
    }
    static async login(user_found) {

        const user_id=user_found.id
        
        const authorization_token = jwt.sign({
            id: user_id,
            name: user_found.username,
            email: user_found.email,
            created_at: user_found.fecha_creacion
        },
            ENVIRONMENT.JWT_SECRET_KEY,
            {
                expiresIn: '7d'
            })

        const now = new Date();
        const fechaMySQL = now.toISOString().slice(0, 19).replace('T', ' ')

        userRepository.updateById(user_found.id,{ ultima_sesion: fechaMySQL })
            
            return authorization_token
    }
}

export default AuthService