import pool from "../config/MySql.config.js";

const CHANEL_TABLE={
    NAME:'canales_workspace',
    COLUMNS:{
        ID:'id',
        FK_WORKSPACE:'fk_id_workspace',
        NAME:'nombre',
        CREATED_AT:'fecha_creacion',
        ACTIVE:'activo',
        PRIVATE:'privado'

    }
}
const MEMBER_CHANNEL_TABLE={
    NAME:'miembros_canal',
    COLUMNS:{
        MEMBER_CHANNEL_ID:'id_canal_miembro',
        CHANNEL_ID:'id_canal',
        MEMBER_ID:'id_miembro',
        CREATED_AT:'fecha_alta',
        ACTIVE:'activo'
    }
}


class ChannelRepository {

    static async create(name, isPrivate, workspace_id) {
        const query = `
                    INSERT INTO ${CHANEL_TABLE.NAME}(
                    ${CHANEL_TABLE.COLUMNS.NAME},
                    ${CHANEL_TABLE.COLUMNS.PRIVATE},
                    ${CHANEL_TABLE.COLUMNS.FK_WORKSPACE}) 
                    VALUES(?, ?, ?)
    `;
        const [result] = await pool.execute(query, [name, isPrivate, workspace_id]);

        const channel_created = await ChannelRepository.getById(result.insertId);
        return channel_created;
    }

    static async creatMemberChannel(id_canal, id_miembro) {

        const query = `INSERT INTO ${MEMBER_CHANNEL_TABLE.NAME} 
                    (
                    ${MEMBER_CHANNEL_TABLE.COLUMNS.ACTIVE},
                     ${MEMBER_CHANNEL_TABLE.COLUMNS.CHANNEL_ID},
                    ${MEMBER_CHANNEL_TABLE.COLUMNS.MEMBER_ID}
                    ) 
                    VALUES(1, ?, ?)
    `
        const [result] = await pool.execute(query, [id_canal, id_miembro]);

        return result.insertId;
    }

    static async getAllByWorkspace(workspace_id) {

    const query = `
      SELECT * FROM ${CHANEL_TABLE.NAME} 
            WHERE ${CHANEL_TABLE.COLUMNS.FK_WORKSPACE} = ? `

    const [result] = await pool.execute(query, [workspace_id])
    return result
    }

    static async getAllByWorkspaceAndName(workspace_id, name) {
        const query = `
      SELECT * FROM ${CHANEL_TABLE.NAME} 
        WHERE ${CHANEL_TABLE.COLUMNS.FK_WORKSPACE} = ? 
        AND ${CHANEL_TABLE.COLUMNS.NAME} = ?
    `;
        const [result] = await pool.execute(query, [workspace_id, name]);
        return result;
    }

    static async getById(channel_id) {
        const query = `
                    SELECT * FROM ${CHANEL_TABLE.NAME} 
                    WHERE ${CHANEL_TABLE.COLUMNS.ID} = ? `
        
        const [result] = await pool.execute(query, [channel_id]);

        const channel_found = result[0];
        if (!channel_found) {
            return null;
        }
        return channel_found;
    }

    static async getByIdAndWorkspaceId(channel_id, workspace_id) {

    const query = `
      SELECT * FROM ${CHANEL_TABLE.NAME} WHERE
                    ${CHANEL_TABLE.COLUMNS.ID} = ?
                    AND ${CHANEL_TABLE.COLUMNS.FK_WORKSPACE} = ?
    `;
        const [result] = await pool.execute(query, [channel_id, workspace_id]);
        const channel_found = result[0];

        if (!channel_found) {
            return null;
        }
        return channel_found;
    }
    
    static async getByWorkspaceIdAndUserid(user_id, workspace_id) {

    const query = `
      SELECT * FROM ${CHANEL_TABLE.NAME} WHERE
                    ${CHANEL_TABLE.COLUMNS.FK_WORKSPACE} = ?
                    AND ${CHANEL_TABLE.COLUMNS.ID} IN 
        (SELECT ${MEMBER_CHANNEL_TABLE.COLUMNS.CHANNEL_ID} 
                FROM ${MEMBER_CHANNEL_TABLE.NAME}
                WHERE ${MEMBER_CHANNEL_TABLE.COLUMNS.MEMBER_ID}=?)
    `
        const [result] = await pool.execute(query, [workspace_id, user_id]);
        const channel_found = result;

        if (!channel_found) {
            return null;
        }
    
        return channel_found;
    }
    
    
}
export default ChannelRepository