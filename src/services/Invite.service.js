import ENVIRONMENT from "../config/environment.config.js";
import transporter from "../config/mailer.config.js";
import jwt from 'jsonwebtoken'
import workspaceController from "../controllers/workspace.controller.js";


export default async function inviteService(user,invited_email,workspace_id_created,id_inviter) {

    console.log('EN EL SERVICE DE INVITE: invited_email:'
        ,invited_email,'workspace: ',workspace_id_created,'id_inviter:', id_inviter
    )
    
    const workspace= await workspaceController.getById(workspace_id_created)
    
    const nombre_workspace=workspace.nombre

                if(user){
                    const invite_token = jwt.sign(
                                    {
                                        id_invited:user.id,
                                        email_invited: user.email,
                                        id_workspace: workspace_id_created,
                                        id_inviter: id_inviter
                                    },
                                    ENVIRONMENT.JWT_SECRET_KEY,
                                    { expiresIn: '7d' }
                );
                }
                else{
                                const invite_token = jwt.sign(
                                    {
                                        id_invited:null,
                                        email_invited:invited_email,
                                        id_workspace: workspace_id_created,
                                        id_inviter: id_inviter
                                    },
                                    ENVIRONMENT.JWT_SECRET_KEY,
                                    { expiresIn: '7d' }
                                );
                }
                await transporter.sendMail({
                    from: ENVIRONMENT.GMAIL_USERNAME,
                    to: invited_email,
                    subject: `Invitación al workspace ${nombre_workspace}`,
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
                        <p>El usuario ${invited_email} te ha enviado una invitación al workspace <b>${workspace}</b>.</p>
                        <a href='${ENVIRONMENT.URL_API_BACKEND}/api/workspace_member/confirm-invitation/${invite_token}'>
                            Click para empezar
                        </a>
                    </div>
                </body>
                </html>
            `
                });


    }