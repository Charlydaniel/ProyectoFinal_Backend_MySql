import transporter from "../config/mailer.config.js"
import userRepository from "../Repositories/user.repository.js"
import serverError from "../utils/customError.utils.js"
import jwt from 'jsonwebtoken'

//Libreria para encriptacion.
import bcrypt, { compare } from 'bcrypt'
import ENVIRONMENT from "../config/environment.config.js"


class AuthService {

    static async register(username, password, email) {
    

        const hash_pass = await bcrypt.hash(password, 12)
        const user_created = await userRepository.createUser(username, email, hash_pass)

        const verification_token = jwt.sign(
            {
                email: email,
                user_id: user_created.id
            },
            ENVIRONMENT.JWT_SECRET_KEY
        )


        const to_email=email
        const from_email=ENVIRONMENT.GMAIL_USERNAME

        await transporter.sendMail({
        from: from_email,
        to: to_email,
        subject: 'Correo de verificación UTN validación de usuario',
        html: `
            <html>
            <head>
                <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 20px;
                }
                .container {
                    background: #ffffff;
                    border-radius: 10px;
                    padding: 30px;
                    max-width: 500px;
                    margin: 0 auto;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    text-align: center;
                }
                .logo {
                    width: 80px;
                    height: auto;
                    margin-bottom: 20px;
                }
                h1 {
                    color: #2b6cb0;
                    margin-bottom: 10px;
                }
                p {
                    color: #333;
                    font-size: 16px;
                }
                a {
                    display: inline-block;
                    background-color: #2b6cb0;
                    color: #fff !important;
                    padding: 10px 20px;
                    border-radius: 5px;
                    text-decoration: none;
                    margin-top: 20px;
                }
                a:hover {
                    background-color: #1a4d8f;
                }
                </style>
            </head>
            <body>
                <div class="container">
                <img 
                    src="https://a.slack-edge.com/bv1-13/slack_logo-ebd02d1.svg" 
                    alt="Slack Logo" 
                    class="logo"
                />
                <h1>Bienvenido a Slack</h1>
                <p>Este es un mail de verificación</p>
                <a href='${ENVIRONMENT.URL_FRONTEND}/api/auth/verify-email/${verification_token}'>
                    Click aquí para verificar tu cuenta
                </a>
                </div>
            </body>
            </html>
        `
        });


        
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