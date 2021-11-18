const connection = require('../app/database');

class AuthService {

    //特定方法
    // async checkMoment(momentId,userId) {

    //     const statement = `select *from moment where id = ? and user_id = ?;`;
    //     const [result] = await connection.execute(statement,[momentId,userId]);
    //     return result.length === 0 ? false : true;
        
    // }

    //通用方法
    async checkResource(tableName,id,userId) {

        const statement = `select *from ${tableName} where id = ? and user_id = ?;`;
        const [result] = await connection.execute(statement,[id,userId]);
        return result.length === 0 ? false : true;
        
    }
}

module.exports = new AuthService();