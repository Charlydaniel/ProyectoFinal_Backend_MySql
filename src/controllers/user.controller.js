import userRepository from "../Repositories/user.repository.js"
import serverError from "../utils/customError.utils.js"
import bcrypt from "bcrypt"

class User_controller {

    static async getAll(request, response) {

        try {
            const users = await userRepository.getAll()

            return response.json(
                {
                    ok: true,
                    message: 'usuarios obtenidos correctamente',
                    status: 201,
                    data:
                    {
                        users: users
                    }
                }

            )
        }
        catch (error) {
            return response.json(
                {
                    ok: false,
                    status: 500,
                    message: 'Error interno del servidor al obtener datos de usuarios' + error
                }
            )
        }

    }
    static async getBiId(request, response) {


        const user_id = request.params.user_id
     
        try {
                const user = await userRepository.getById(user_id)

                if (!user) {
                    throw new serverError(400, `user_id: ${user_id} no encontrado`)
                }
                else {
                    return response.json(
                        {
                            ok: true,
                            message: `Usuario ${user_id} encontrado`,
                            status: 201,
                            data: {
                                user: user.id,
                                user_name: user.username,
                                user_email: user.email
                            }
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
        }


    }
    static async createUser(request, response) {

        const name = request.body.username
        const email = request.body.email
        const password = request.body.password

        let msg = 'Datos de usuario invalido: '
        let ok = false
        let status = 201
        const ok_message = 'Usuario creado'

        try {

            if (!name) {
                msg = msg + " El nombre debe no puede ser vacío"
                status = 400
                throw new serverError(status, msg)
            }
            else if (name.length < 4 || name.length > 10) {
                msg = msg + " El nombre debe tener entre 4 y 10 caracteres"
                status = 400
                throw new serverError(status, msg)
            }
            else if (typeof (name) !== 'string') {
                msg = msg + " El nombre debe ser de tipo texto"
                status = 400
                throw new serverError(status, msg)
            }

            //-----------------------------
            if (status === 201) {

                if (!password) {
                    msg = msg + " La contraseña no puede ser vacia"
                    status = 400
                    throw new serverError(status, msg)
                }
                else if (password.length < 4 || password.length > 30) {
                    msg = msg + " El contraseña debe tener entre 4 y 30 caracteres"
                    status = 400
                    throw new serverError(status, msg)
                }
                else if (typeof (password) !== 'string') {
                    msg = msg + " La contraseña debe contener caracteres"
                    status = 400
                    throw new serverError(status, msg)
                }
            }



            //-------------------------
            if (status === 201) {
                if (!email) {
                    msg = msg + "Email incorrecto, debe completar email"
                    status = 400
                    throw new serverError(status, msg)
                }
                else if (typeof (email) !== 'string') {
                    msg = msg + " El email debe ser de tipo texto"
                    status = 400
                    throw new serverError(status, msg)
                }
                else if (!email.includes('@')) {
                    msg = msg + " Email incorrecto, debe contener @"
                    status = 400
                    throw new serverError(status, msg)
                }
            }

            if (status === 201) {

                await userRepository.createUser(name, email, bcrypt.hash(password,10) )
                msg = ok_message
                ok = true
                return response.status(status).json(
                    {
                        ok: ok,
                        status: status,
                        message: msg
                    }
                )

            }
        }
        catch (error) {

            if (error.status) {

                return response.status(status).json(
                    {
                        ok: ok,
                        status: error.status,
                        message: error.message
                    }
                )
            }
            return response.status(500).json(
                {
                    ok: ok,
                    status: 500,
                    message: 'Error interno del servidor'
                }
            )
        }

    }
    static async updateBiId(request,response) {

        try {
            const { user_id } = request.params
            const new_values = request.body

            const updatedUser= await userRepository.updateById(user_id,new_values)

            if(!updatedUser){
                throw new serverError(404,`Usuario ${user_id} no encontrado`)
            }
            else{
                return response.status(201).json(
                    {
                        ok:true,
                        message:'Usuario actualizado correctamente',
                        user:updatedUser
                    }
                )
            }
        }
        catch(error){
            if(error.status){
                return response.status(error.status).json(
                    {
                        ok:false,
                        message:error.message
                    }
                )
            }
            else{
                return response.status(500).json(
                    {
                        ok:false,
                        message:'Error interno del servidor' +error
                    }
                )
            }
        }
    }

}
export default User_controller