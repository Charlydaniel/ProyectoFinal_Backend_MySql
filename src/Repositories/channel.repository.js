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
                    AND ${CHANEL_TABLE.COLUMNS.FK_WORKSPACE} = ?
    `;
        const [result] = await pool.execute(query, [channel_id, user_id]);
        const channel_found = result[0];

        if (!channel_found) {
            return null;
        }
        return channel_found;
    }
}
export default ChannelRepository