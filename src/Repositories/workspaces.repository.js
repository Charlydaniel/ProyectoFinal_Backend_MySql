import Workspaces from "../models/workspaces.model.js"
import serverError from "../utils/customError.utils.js"
import pool from "../config/MySql.config.js";
import MemberWokspaceRepository from "./member_workspace.repository.js";

const WORKSPACE_TABLE={
        NAME:'workspaces',
        COLUMNS:
        {
                ID:'id',
                NAME:'nombre',
                DESCRIPTION:'descripcion',
                IMG:'img_workspace',
                CREATED_DATE:'fecha_creacion',
                UPDATED_DATE:'fecha_modificacion',
                ACTIVE:'activo'
        }
}

class workspacesRepository {


        static async getAll() {
                
        const query=`SELECT * FROM ${WORKSPACE_TABLE.NAME}`
        const [result] =await pool.execute(query)
  
        return result
                
        }
        static async getById(workspace_id) {

        const query=`SELECT * FROM ${WORKSPACE_TABLE.NAME} 
                        WHERE ${WORKSPACE_TABLE.COLUMNS.ID} = ?
                        AND ACTIVO=1`

        const [result] =await  pool.execute(query,[workspace_id])
        const workspace_found=result[0]

        return workspace_found


        }
        static async getByName(name) {
        
        const query= `SELECT * FROM ${WORKSPACE_TABLE.NAME} 
                        WHERE ${WORKSPACE_TABLE.COLUMNS.NAME} = ?
                        AND ${WORKSPACE_TABLE.COLUMNS.ACTIVE}=1`

        const [result] =await  pool.execute(query,[name])
        const workspace_found=result[0]

        if (!workspace_found){
                return null
        }
        else{
                return workspace_found
        }
        }
        static async createWorkspace(name, url_image,descripcion) {

                const query=`INSERT INTO ${WORKSPACE_TABLE.NAME}(
                                        ${WORKSPACE_TABLE.COLUMNS.NAME},
                                        ${WORKSPACE_TABLE.COLUMNS.IMG},
                                        ${WORKSPACE_TABLE.COLUMNS.DESCRIPTION}
                                        ) 
                                VALUES (?,?,?)`
                
                const [result]=await pool.execute(query,[name,url_image,descripcion])

                return result.insertId
    
        }
        static async updateBiId(workspace_id, new_values){

        const columns=Object.keys(new_values) 
        const setClause= columns.map(col => `${col}=?`).join(', ')
        const values=[... Object.values(new_values),workspace_id]
        const query= `UPDATE ${WORKSPACE_TABLE.NAME}
                        SET ${setClause}
                        where ID= ?`
        const [update_data,field_pack]= await pool.execute(query,values)

        return update_data.affectedRows
        }

}

export default workspacesRepository