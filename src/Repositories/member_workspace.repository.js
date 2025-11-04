import workspace_member from "../models/workspace_members.model.js"
import serverError from "../utils/customError.utils.js"
import pool from "../config/MySql.config.js"

const MEMBERS_TABLE={
        NAME:'miembros_workspace',
        COLUMNS:{
            ID:'id',
            FK_WORKSPACE:'fk_id_workspace',
            FK_USER:'fk_id_usuario',
            ROLE:'rol',
            CREATION_DATE:'fecha_creacion'
        }
}

class MemberWokspaceRepository {

    static async getAllWorkspacesByUserId(user_id) {

        const query=`select workspaces.* from workspaces 
                     join miembros_workspace  
                        on miembros_workspace.fk_id_workspace=workspaces.id
                        where miembros_workspace.fk_id_usuario=?`
        const [result] =await  pool.execute(query,[user_id])
        return result
                
    }
    static async deleteMember(user_id, workspace_id) {
            
        const query=`DELETE FROM ${MEMBERS_TABLE.NAME}
                    WHERE ${MEMBERS_TABLE.COLUMNS.FK_USER} = ?
                    AND ${MEMBERS_TABLE.COLUMNS.FK_WORKSPACE} = ?`

        const [result] =await  pool.execute(query,[user_id,workspace_id])
        return result
    }
    static async getMemberWorkspaceByUserIdAndWorkspaceId(user_id, workspace_id) {
            
      
        const query=`SELECT * FROM workspaces 
                     INNER JOIN  ${MEMBERS_TABLE.NAME}  
                        ON ${MEMBERS_TABLE.COLUMNS.FK_WORKSPACE}=workspaces.id
                     INNER JOIN usuarios
                        ON ${MEMBERS_TABLE.COLUMNS.FK_USER}=usuarios.id
                        WHERE ${MEMBERS_TABLE.COLUMNS.FK_USER}=?
                        and ${MEMBERS_TABLE.COLUMNS.FK_WORKSPACE}=?`

        const [result] =await  pool.execute(query,[user_id,workspace_id])
        return result[0]
    }
    static async create(user_id, workspace_id, role = 'user') {

            const query=`INSERT INTO ${MEMBERS_TABLE.NAME}
                (
                    ${MEMBERS_TABLE.COLUMNS.FK_USER},
                    ${MEMBERS_TABLE.COLUMNS.FK_WORKSPACE},
                    ${MEMBERS_TABLE.COLUMNS.ROLE}
                )
                VALUES (?,?,?)`

                
                const [result]=await pool.execute(query,[user_id,workspace_id,role])
                
                return result.insertId
                
    }
    static async getMembersByWorkspaceId(workspace_id){

        const query=`SELECT * FROM workspaces 
                    INNER JOIN  ${MEMBERS_TABLE.NAME}  
                        ON ${MEMBERS_TABLE.COLUMNS.FK_WORKSPACE}=workspaces.id
                    INNER JOIN usuarios
                        ON ${MEMBERS_TABLE.COLUMNS.FK_USER}=usuarios.id
                        WHERE ${MEMBERS_TABLE.COLUMNS.FK_WORKSPACE}=?`

        const [result] =await  pool.execute(query,[workspace_id])
        return result

    }
}
export default MemberWokspaceRepository