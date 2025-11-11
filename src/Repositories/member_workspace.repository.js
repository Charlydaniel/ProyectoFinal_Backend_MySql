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

const USER_TABLE = {
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
    static async getWorkspacesByMemberId(member_id){

        try{
                const query=`
                    SELECT * FROM ${WORKSPACE_TABLE.NAME}
                    LEFT JOIN ${MEMBERS_TABLE.NAME}  
                    ON ${MEMBERS_TABLE.COLUMNS.FK_WORKSPACE}=
                        ${WORKSPACE_TABLE.NAME}.${WORKSPACE_TABLE.COLUMNS.ID}
                                WHERE ${MEMBERS_TABLE.COLUMNS.FK_USER}=?
                                 AND ${WORKSPACE_TABLE.COLUMNS.ACTIVE}=1 `
                                
                const [result]  = await pool.execute(query,[member_id])

                console.log(query)
                return result
        }
        catch(err){
            console.log(err)
        }


    }
    static async getMembersByWorkspaceId(workspace_id){

        try{

                const query=`SELECT * FROM ${WORKSPACE_TABLE.NAME} 
                    INNER JOIN  ${MEMBERS_TABLE .NAME}  
                        ON ${MEMBERS_TABLE.COLUMNS.FK_WORKSPACE}=${WORKSPACE_TABLE.NAME}.${WORKSPACE_TABLE.COLUMNS.ID}
                    INNER JOIN ${USER_TABLE.NAME}
                        ON ${MEMBERS_TABLE.COLUMNS.FK_USER}=${USER_TABLE.NAME}.${USER_TABLE.COLUMNS.ID}
                        WHERE ${MEMBERS_TABLE.COLUMNS.FK_WORKSPACE}=?`

                const [result] =await pool.execute(query,[workspace_id])

        
        return result
        }
        catch(error){
            console.log(error)
        }



    }
    static async getMembersOfMiWorkspaces(user_id){
        
        const query = `SELECT 
                    w.id  AS workspace_id,
                    w.nombre  AS workspace_nombre,
                    u.id  AS usuario_id,
                    u.username AS usuario_nombre,
                    u.email AS usuario_mail,
                    u.ultima_sesion AS usuario_ult_sesion,
                    u.imagen_avatar AS imagen
                    FROM miembros_workspace mw
                    JOIN usuarios u 
                    ON u.id = mw.fk_id_usuario
                    JOIN workspaces w 
                    ON w.id = mw.fk_id_workspace
                    WHERE mw.fk_id_workspace IN (
                    SELECT fk_id_workspace
                    FROM miembros_workspace
                    WHERE fk_id_usuario = ?
                    )
                    ORDER BY w.id, u.id        
                    `
            const [result] = await pool.execute(query,[user_id])
            console.log(result)
        return result
    }
}
export default MemberWokspaceRepository