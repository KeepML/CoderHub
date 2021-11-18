const fs = require('fs');

const userService = require('../service/user.service');
const fileService = require('../service/file.service');
const { AVATAR_PATH } = require('../constants/file-path');

class UserController {

    //用户注册
    async create(ctx,next) {
        //获取用户请求传递参数
        const user = await ctx.request.body;
        //查询数据
        const result = await userService.create(user);

        //返回数据
        ctx.body = result;
    }

    async avatarInfo(ctx,next) {
        //获取用户数据
        const { userId } = ctx.params;
        const avatarInfo = await fileService.getAvatarInfoByUserId(userId);
       // console.log(avatarInfo);
        //提供图像信息
        ctx.response.set('content-type',avatarInfo.mimetype);
        //console.log(`${AVATAR_PATH}/${avatarInfo.filename}`);
        ctx.body = fs.createReadStream(`${AVATAR_PATH}/${avatarInfo.filename}`);
    }

}

module.exports = new UserController();