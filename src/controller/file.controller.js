const fileService = require('../service/file.service');
const userService = require('../service/user.service');
const {APP_HOST,APP_PORT} = require('../app/config');

class FileController {
    //保存用户头像数据
    async saveAvatarInfo (ctx,next) {
        //获取数据
        const { filename,mimetype,size } = ctx.req.file;
        const { id } = ctx.user;
        //将头像信息数据保存到数据库中
        const result = await fileService.createAvatar(filename,mimetype,size,id);

        //将图片地址保存的user表中
        const avatarURL = `${APP_HOST}:${APP_PORT}/users/${id}/avatar`;

        await userService.updateAvatarURLById(avatarURL,id);

        ctx.body = "上传头像成功~";
    }

    //保存动态配图数据
    async savePictureInfo(ctx,next) {
        //获取图像信息
        const files = ctx.req.files;
        const { id } = ctx.user;
        const { momentId } = ctx.query;

        //将所有文件信息保存到数据库中
        for(let file of files){
            const { filename,mimetype,size } = file;
            await fileService.createFile(filename,mimetype,size,id,momentId);
        }

        ctx.body = "动态配图上传成功~";

    }
}

module.exports = new FileController();