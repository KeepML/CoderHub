const connection = require('../app/database');

class CommentService {
    async create(momentId,content,userId) {
        const statement = `insert into comment (moment_id,content,user_id) values(?,?,?);`;
        const [result] = await connection.execute(statement,[momentId,content,userId]);
        return result;
    }

    async reply(momentId,content,commentId,userId){
        const statement = `insert into comment (moment_id,content,comment_id,user_id) values(?,?,?,?);`;
        const [result] = await connection.execute(statement,[momentId,content,commentId,userId]);
        return result;
    }

    async update(commentId,content) {
        const statement = `update comment set content = ? where id = ?;`;
        const [result] = await connection.execute(statement,[content,commentId]);
        return result;
    }

    async remove(commentId){
        const statement = `delete from comment where id = ?;`;
        const [result] = await connection.execute(statement,[commentId]);
        return result;
    }

    async getCommentsByMomentId(momentId) {
        const statement = `
        select 
            c.id,c.content,c.comment_id,c.createAt,
            JSON_OBJECT("id",u.id,"name",u.name) as user
        from comment as c 
        left join users as u on u.id = c.user_id
        where moment_id = ?;
        `;
        const [result] = await connection.execute(statement,[momentId]);
        return result;
    }

}

module.exports = new CommentService();