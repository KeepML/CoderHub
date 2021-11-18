const connection = require('../app/database');
const {APP_HOST,APP_PORT} = require('../app/config');

class MomentService {

    async create(userId,content){
        const statement = `insert into moment (content,user_id) values(?,?);`;
        const [result] = await connection.execute(statement,[content,userId]);
        return result;
    }

    async getMomentById(id) {
        // const statement =  `
        // SELECT 
        //     m.id as momentId,content,m.createAt,m.updateAt,
        //     JSON_OBJECT('id',u.id,'name',u.name) as user
        // FROM moment as m
        // LEFT JOIN users as u on u.id = m.user_id
        // WHERE m.id = ?;`;

        const statement = `
            SELECT 
                m.id,m.content,m.createAt,m.updateAt,
                JSON_OBJECT('id',u.id,'name',u.name,'avatar',u.avatar_url) as author,
                JSON_ARRAYAGG(JSON_OBJECT('id',c.id,'content',c.content,'commentId',c.comment_id,
                'createAt',c.createAt,'user',JSON_OBJECT('id',cu.id,'name',cu.name))) as comments ,
                (SELECT JSON_ARRAYAGG(CONCAT('${APP_HOST}:${APP_PORT}/moment/images/',file.filename))
                FROM file WHERE m.id = file.moment_id) as images
            FROM moment as m
            LEFT JOIN users as u on u.id = m.user_id
            LEFT JOIN comment as c on c.moment_id = m.id 
            LEFT JOIN users as cu on cu.id = c.user_id 
            WHERE m.id = ?;`;
        const [result] = await connection.execute(statement,[id]);
        return result[0];
    }

    async getMomentList(offset,size) {
        const statement = `
        SELECT 
            m.id as momentId,content,m.createAt,m.updateAt,
            JSON_OBJECT('id',u.id,'name',u.name,'avatar',u.avatar_url) as user ,
            (SELECT count(*) FROM comment as c WHERE c.moment_id = m.id) as commentCount,
            (SELECT JSON_ARRAYAGG(CONCAT('${APP_HOST}:${APP_PORT}/moment/images/',file.filename))
            FROM file WHERE m.id = file.moment_id) as images
        FROM moment as m
        LEFT JOIN users as u on u.id = m.user_id 
        LIMIT ?,?;
        `;

        const [result] = await connection.execute(statement,[offset,size]);
        return result;
    }

    //修改动态
    async update(content, momentId) {
        const statement = `update moment set content = ? where id = ?;`;
        const [result] = await connection.execute(statement,[content,momentId]);
        return result;
    }

    //删除动态
    async remove(momentId) {
        const statement = `delete from moment where id = ?;`;
        const [result] = await connection.execute(statement,[momentId]);
        return result;
    }

    //判断动态标签是否存在
    async hasLabel(momentId,labelId) {
        const statement = `select * from moment_label where moment_id = ? and label_id = ?`;
        const [result] = await connection.execute(statement,[momentId,labelId]);
        return result[0] ? true : false;
    }

    //给动态添加标签
    async addLabels(momentId,labelId) {
        const statement = `insert into moment_label(moment_id,label_id) values(?,?)`;
        const [result] = await connection.execute(statement,[momentId,labelId]);
        return result;
    }
}

module.exports = new MomentService();