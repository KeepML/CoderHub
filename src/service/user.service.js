const connection = require('../app/database');

class UserService {

    async create(user) {
        const { name, password } = user;
        const statement = `insert into users(name,password) values(?,?)`;
        const result = await connection.execute(statement,[name,password]);
        return result;
    }

    async getUserByName(name){
        const statement = 'select *from users where name = ?;';
        const result = await connection.execute(statement,[name]);
        return result[0];
    }

    async updateAvatarURLById(avatarUrl,userId) {
        const statement = `update users set avatar_url = ? where id = ?;`;
        const [result] = await connection.execute(statement,[avatarUrl,userId]);
        return result;
    }
}

module.exports = new UserService();