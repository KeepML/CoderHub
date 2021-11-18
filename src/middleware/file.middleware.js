const path = require('path');

const Multer = require('koa-multer');
const { AVATAR_PATH ,PICTURE_PATH} = require('../constants/file-path');

const Jimp = require('jimp');

const avatarUpload = Multer({
    dest: AVATAR_PATH
})
const avatarHandler = avatarUpload.single('avatar');


const pictureUpload = Multer({
    dest: PICTURE_PATH
})
const pictureHandler = pictureUpload.array('picture',9)

const pictureResize = async (ctx,next) =>{
    try {
        //1.获取所有的图像信息
        const files = ctx.req.files;

        //2.对象图像进行处理(第三方sharp或jimp)
        for(let file of files){
            const destPath = path.join(file.destination,file.filename);
            //console.log(file);
            //console.log(file.path);
            Jimp.read(file.path).then(image => {
                image.resize(960,Jimp.AUTO).write(`${destPath}-large`);
                image.resize(320,Jimp.AUTO).write(`${destPath}-middle`);
                image.resize(160,Jimp.AUTO).write(`${destPath}-small`);
            });
        }
        await next();
    } catch (error) {
        console.log(error);
    }
}
module.exports = {
    avatarHandler,
    pictureHandler,
    pictureResize
}