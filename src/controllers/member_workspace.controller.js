import ENVIRONMENT from "../config/environment.config.js"
import transporter from "../config/mailer.config.js"
import MemberWokspaceRepository from "../Repositories/member_workspace.repository.js"
import userRepository from "../Repositories/user.repository.js"
import workspacesRepository from "../Repositories/workspaces.repository.js"
import inviteService from "../services/Invite.service.js"
import serverError from "../utils/customError.utils.js"
import jwt from 'jsonwebtoken'
import workspaceController from "./workspace.controller.js"

const USER_PROFILE = {
    admin: 'admin',
    common_user: 'user'
}

class memberWorkspaceController {

    static async confirmInvitation(request, response) {

        try {
            const token = request.params.verification_token

            const {
                id_invited,
                email_invited,
                id_workspace,
                id_inviter
            } = jwt.verify(token, ENVIRONMENT.JWT_SECRET_KEY)


            const member_created = await MemberWokspaceRepository.create(id_invited, id_workspace, 'user')

            if (!member_created) {
                throw new serverError(404, 'Error al crear miembro en el workspace')
            }
            response.redirect(`${ENVIRONMENT.URL_FRONTEND}/login`)
        }
        catch (error) {

            if (error instanceof jwt.JsonWebTokenError) {
                response.status(400).json({ ok: false, status: 400, message: 'Token invalido' })
            }
            else if (error instanceof jwt.TokenExpiredError) {
                response.status(400).json({ ok: false, status: 400, message: 'Token expirado' })
            }
            else if (error.status) {
                response.status(error.status).json({ ok: false, status: error.status, message: error.message })
            }
            else {
                response.status(500).json({ ok: false, status: 500, message: 'Error interno del servidor' })
            }
        }
    }
    static async create(request, response) {

        try {

            const user_id = request.body.user_id
            const { workspace_id } = request.params

            const user_rol = (rol) => {
                if (user_id === request.user.id) {
                    return USER_PROFILE.admin
                }
                else {
                    return USER_PROFILE.common_user
                }
            }

            let msg = 'Error:'
            let status = 201
            let ok = true

            const workspace_existe = await workspacesRepository.getById(workspace_id)

            if (!workspace_existe) {
                msg = msg + "Workspace inexistente",
                    status = 400
                ok = false
                throw new serverError(status, msg, ok)
            }

            const user_validated = await userRepository.getById(user_id)

            if (!user_validated) {
                throw new serverError(404, 'Usuario inexistente')
            }

            const member_now = await MemberWokspaceRepository.
                getMemberWorkspaceByUserIdAndWorkspaceId(user_id, workspace_id)


            if (member_now) {
                throw new serverError(409, `El usuario ${member_now.username} ya es miembro del workspace`)
            }
            const member_id = await MemberWokspaceRepository.create(user_id, workspace_id, user_rol())

            return response.json(
                {
                    ok: true,
                    message: 'Miembro creado para el workspace',
                    status: status,
                }

            )
        }
        catch (error) {

            if (error.status) {

                return response.status(error.status).json(
                    {
                        ok: false,
                        status: error.status,
                        message: error.message
                    }
                )
            }
            return response.status(500).json(
                {
                    ok: false,
                    status: 500,
                    message: 'Error interno del servidor: ' + error
                }
            )
        }

    }
    static async getMemberWorkspaceByUserIdAndWorkspaceId(request, response) {

        try {
            const member_id = request.body.user_id
            const { workspace_id } = request.params

            if (isNaN(member_id) && isNaN(workspace_id)) {
                throw new serverError(400, 'Tipos de datos incorrectos')
            }
            else {
                const member_workspace = await MemberWokspaceRepository.
                    getMemberWorkspaceByUserIdAndWorkspaceId(member_id, workspace_id)

                return response.status(201).json(
                    {
                        ok: true,
                        message: 'Relacion encontrada',
                        data: { member_workspace }
                    }
                )
            }
        }
        catch (error) {

            if (error.status) {

                return response.status(error.status).json(
                    {
                        ok: false,
                        status: error.status,
                        message: error.message
                    }
                )
            }
            return response.status(500).json(
                {
                    ok: false,
                    status: 500,
                    message: 'Error interno del servidor: ' + error
                }
            )
        }

    }
    static async deleteMember(request, response) {

        try {

            const user_id = request.body.user_id
            const { workspace_id } = request.params

            const member = await MemberWokspaceRepository.
                getMemberWorkspaceByUserIdAndWorkspaceId(user_id, workspace_id)

            if (!member) {
                throw new serverError(404, 'Miembro no existente')
            }
            else {
                await MemberWokspaceRepository.deleteMember(user_id, workspace_id)

                return response.status(201).json(
                    {
                        ok: true,
                        status: 404,
                        message: `Miembro ${member.username} eliminado correctamente del workspace ${member.nombre}`
                    }
                )
            }
        }
        catch (error) {

            if (error.status) {

                return response.status(error.status).json(
                    {
                        ok: ok,
                        status: error.status,
                        message: error.message
                    }
                )
            }
            return response.status(500).json(
                {
                    ok: false,
                    status: 500,
                    message: 'Error interno del servidor: ' + error
                }
            )
        }

    }
    static async inviteMember(request, response) {


        try {
            const { members, workspace_id } = request.body
            const user = request.user
            for (const member of members) {

                const user_invited = await userRepository.getByEmail(member)


                if (!user_invited) {

                    await transporter.sendMail(
                        {
                            from: ENVIRONMENT.GMAIL_USERNAME,
                            to: member,
                            subject: `Invitacion Slack`,
                            html:

                            `
                            <html>
                                <head>
                                    <meta charset="UTF-8" />
                                    <title>Invitación a Slack</title>
                                    <style>
                                    /* Estilos seguros para clientes de correo */
                                    body {
                                        font-family: Arial, sans-serif;
                                        background-color: #f7f9fc;
                                        margin: 0;
                                        padding: 0;
                                    }

                                    .wrapper {
                                        width: 100%;
                                        background-color: #f7f9fc;
                                        padding: 40px 0;
                                    }

                                    .container {
                                        background-color: #ffffff;
                                        border-radius: 12px;
                                        max-width: 520px;
                                        margin: 0 auto;
                                        padding: 40px 30px;
                                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                                        text-align: center;
                                    }

                                    .logo {
                                        width: 100px;
                                        margin-bottom: 25px;
                                    }

                                    h1 {
                                        color: #2b6cb0;
                                        font-size: 22px;
                                        margin-bottom: 12px;
                                    }

                                    p {
                                        color: #444;
                                        font-size: 15px;
                                        line-height: 1.6;
                                        margin: 0 auto 20px;
                                        max-width: 400px;
                                    }

                                    .button {
                                        display: inline-block;
                                        background-color: #2b6cb0;
                                        color: #ffffff !important;
                                        text-decoration: none;
                                        padding: 12px 24px;
                                        border-radius: 6px;
                                        font-weight: bold;
                                        transition: background-color 0.3s ease;
                                    }

                                    .button:hover {
                                        background-color: #1a4d8f;
                                    }

                                    .footer {
                                        margin-top: 30px;
                                        font-size: 13px;
                                        color: #777;
                                    }
                                    </style>
                                </head>
                                <body>
                                    <div class="wrapper">
                                    <div class="container">
                                        <img
                                        src="https://a.slack-edge.com/bv1-13/slack_logo-ebd02d1.svg"
                                        alt="Slack Logo"
                                        class="logo"
                                        />
                                        <h1>¡Bienvenido a Slack!</h1>
                                        <p>
                                        El usuario <strong>${user.email}</strong> te ha invitado a formar parte del
                                        espacio de trabajo en Slack.
                                        </p>

                                        <a
                                        href="${ENVIRONMENT.URL_API_BACKEND}/register"
                                        class="button"
                                        target="_blank"
                                        >
                                        Unirme ahora
                                        </a>

                                        <div class="footer">
                                        Si no esperabas este correo, podés ignorarlo con seguridad.
                                        </div>
                                    </div>
                                    </div>
                                </body>
                                </html>

                            `
                        }
                    )
                }
                else {

                    const member_data = await 
                    MemberWokspaceRepository.getMemberWorkspaceByUserIdAndWorkspaceId(
                    user_invited.id, workspace_id
                    )

                    const workspace_data = workspacesRepository.getById(workspace_id)


                    if(!workspace_data){
                        throw new serverError(400,`Workspace no encontrado, no se puede enviar la invitación ${workspace_id}`)
                    }

                    if (!member_data) {

                    const invite_token = jwt.sign(
                        {
                            id_invited: user_invited.id,
                            email_invited: user_invited.email,
                            id_workspace:workspace_id,
                            id_inviter: user.id
                        },
                        ENVIRONMENT.JWT_SECRET_KEY,
                        {
                            expiresIn: '7d'
                        }
                    )

                    await transporter.sendMail(
                        {
                            from: ENVIRONMENT.GMAIL_USERNAME,
                            to: user_invited.email,
                            subject: `Invitacion al workspace ${workspace_data.nombre}`,
                            html:

                            `
                            <html>
                                <head>
                                    <meta charset="UTF-8" />
                                    <title>Invitación al Workspace</title>
                                    <style>
                                    body {
                                        font-family: Arial, sans-serif;
                                        background-color: #f7f9fc;
                                        margin: 0;
                                        padding: 0;
                                    }

                                    .wrapper {
                                        width: 100%;
                                        background-color: #f7f9fc;
                                        padding: 40px 0;
                                    }

                                    .container {
                                        background-color: #ffffff;
                                        border-radius: 12px;
                                        max-width: 520px;
                                        margin: 0 auto;
                                        padding: 40px 30px;
                                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                                        text-align: center;
                                    }

                                    .logo {
                                        width: 100px;
                                        margin-bottom: 25px;
                                    }

                                    h1 {
                                        color: #2b6cb0;
                                        font-size: 22px;
                                        margin-bottom: 12px;
                                    }

                                    p {
                                        color: #444;
                                        font-size: 15px;
                                        line-height: 1.6;
                                        margin: 0 auto 20px;
                                        max-width: 400px;
                                    }

                                    .highlight {
                                        color: #2b6cb0;
                                        font-weight: bold;
                                    }

                                    .button {
                                        display: inline-block;
                                        background-color: #2b6cb0;
                                        color: #ffffff !important;
                                        text-decoration: none;
                                        padding: 12px 24px;
                                        border-radius: 6px;
                                        font-weight: bold;
                                        transition: background-color 0.3s ease;
                                    }

                                    .button:hover {
                                        background-color: #1a4d8f;
                                    }

                                    .footer {
                                        margin-top: 30px;
                                        font-size: 13px;
                                        color: #777;
                                    }
                                    </style>
                                </head>
                                <body>
                                    <div class="wrapper">
                                    <div class="container">
                                        <img
                                        src="https://a.slack-edge.com/bv1-13/slack_logo-ebd02d1.svg"
                                        alt="Slack Logo"
                                        class="logo"
                                        />
                                        <h1>Invitación al Workspace</h1>

                                        <p>
                                        El usuario <span class="highlight">${user.email}</span> te ha enviado una
                                        invitación para unirte al espacio de trabajo
                                        <strong>${workspace_data.nombre}</strong>.
                                        </p>

                                        <a
                                        href="${ENVIRONMENT.URL_API_BACKEND}/api/workspace_member/confirm-invitation/${invite_token}"
                                        class="button"
                                        target="_blank"
                                        >
                                        Aceptar invitación
                                        </a>

                                        <div class="footer">
                                        Si no esperabas esta invitación, podés ignorar este mensaje.
                                        </div>
                                    </div>
                                    </div>
                                </body>
                                </html>

                            `
                        }
                    )
                }
                }

            }


            response.status(200).json({
                ok: true,
                status: 200,
                message: 'Usuario invitado con exito',
                data: null
            })

        }
        catch (error) {

            if (error.status) {
                return response.status(error.status).json(
                    {
                        ok: false,
                        status: error.status,
                        message: error.message
                    }
                )
            }
            else {
                return response.status(500).json(
                    {
                        ok: false,
                        status: 500,
                        message: 'Error interno del servidor: ' + error
                    }
                )
            }
        }
    }
    static async getMembersByWorkspaceId(request, response) {

        try {

            const { workspace_id } = request.body

            if (workspace_id) {

                const members = await MemberWokspaceRepository.getMembersByWorkspaceId(workspace_id)

                return response.status(201).json(

                    {
                        ok: true,
                        status: 201,
                        message: "Miembros encontrados",
                        members: members.length,
                        data: members
                    }
                )
            }
            else {
                throw new serverError(400, 'Workspace enviado vacío')
            }
        }
        catch (error) {
            return response.status(400).json
                (
                    {
                        ok: false,
                        message: "Error interno del servidor: " + error,
                        status: 400
                    }
                )
        }


    }
    static async getWorkspacesByMemberId(request, response) {

        try {

            const member_id = request.user.id


            if (member_id) {

                const workspaces = await MemberWokspaceRepository.getWorkspacesByMemberId(member_id)


                if (workspaces && !isNaN(workspaces)) {

                    return response.status(201).json(
                        {
                            ok: true,
                            status: 201,
                            message: "Workspaces encontrados",
                            workspaces: workspaces.length,
                            data: workspaces
                        }
                    )
                }
                return response.status(201).json(
                    {
                        ok: true,
                        status: 201,
                        message: "Usuario sin Workspaces",
                        workspaces: workspaces.length,
                        data: workspaces
                    }
                )
            }
            else {
                throw new serverError(400, `Se esperaba recibir un miembro: Miembro nulo`)
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
                        message: 'Error interno del servidor al obtener el workspace para el miembro' + error
                    }
                )
            }
        }
    }
}

export default memberWorkspaceController