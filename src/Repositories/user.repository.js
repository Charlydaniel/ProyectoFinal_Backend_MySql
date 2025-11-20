import Users from "../models/user.model.js";
import pool from "../config/MySql.config.js";
import { Query } from "mongoose";

const USSER_TABLE = {
    NAME: 'usuarios',
    COLUMNS: {
        ID: 'id',
        USER_NAME: 'username',
        IMAGE: 'imagen_avatar',
        CREATION_DATE: 'fecha_creacion',
        UPDATE_DATE: 'fecha_modificacion',
        EMAIL: 'email',
        PASSWORD: 'password',
        ACTIVE: 'activo',
        VERIFIED:'verificado'
    }

}

class userRepository {


    static async createUser(name, email, password) {


        const query = `INSERT INTO  ${USSER_TABLE.NAME}(
                                    ${USSER_TABLE.COLUMNS.USER_NAME},
                                    ${USSER_TABLE.COLUMNS.EMAIL},
                                    ${USSER_TABLE.COLUMNS.PASSWORD},
                                    ${USSER_TABLE.COLUMNS.ACTIVE}
                                    ) VALUES (?,?,?,1)`   
            
            const connection = await pool.getConnection();
                try {
                    const [insert_data,fieldPacket]= await pool.query(query, [name, email, password])
                    const search_id=insert_data.insertId
                    const user_created=await userRepository.getById(search_id)
                    return user_created
                } finally {
                connection.release();
                }                              
        


    }
    static async getAll() {


        const query=`SELECT * FROM ${USSER_TABLE.NAME}`
        const [result,fieldPacket]=await pool.query(query)
        const user_found=result

        if(!user_found){
            return null
        }
        else{
            return user_found
        }
    }
    static async deleteBiId(user_id) {
        await Users.findByIdAndDelete(user_id)
        return true
    }
    static async getById(user_id) {
        
        const query=`SELECT * FROM ${USSER_TABLE.NAME} WHERE ${USSER_TABLE.COLUMNS.ID} = ?`
        const [result,fieldPacket]=await pool.query(query,[user_id])
        const user_found=result[0]
        

        if(!user_found){
            return null
        }
        else{
            return user_found
        }

    }
    static async updateById(user_id, new_values) {

        const columns=Object.keys(new_values)
        const SetClause= columns.map(col=>`${col}=?`).join(', ')
        const query=`UPDATE ${USSER_TABLE.NAME} SET ${SetClause}
                        WHERE ID=?`
        const values= [... Object.values(new_values),user_id]
        const [update_data,field_pack] =await pool.query(query,values)

    if (update_data.affectedRows === 0) return null

        const [rows] = await pool.query(`SELECT * FROM ${USSER_TABLE.NAME} WHERE ID=?`, [user_id]);
        
        return rows[0];
        
    }
    static async getByEmail(email) {
    
        const query = `SELECT * FROM ${USSER_TABLE.NAME} 
                            WHERE ${USSER_TABLE.COLUMNS.EMAIL}=?
                            AND ${USSER_TABLE.COLUMNS.ACTIVE}=1`
        
    const connection = await pool.getConnection();
        
        try {
                const [result] = await pool.query(query, [email])
                return result[0]
        } finally {
        connection.release();
        }       

    }


}

export default userRepository
