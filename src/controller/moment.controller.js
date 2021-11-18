const fs = require('fs');

const fileService = require('../service/file.service');
const momentService = require('../service/moment.service');

const { PICTURE_PATH } = require('../constants/file-path');

class MomentController {
    async create(ctx,next){
        //获取数据：用户ID和动态内容
        const userId = ctx.user.id;
        const content = ctx.request.body.content;

        //插入数据到数据库
        const result = await momentService.create(userId,content);
       
        console.log(content);
        ctx.body = result;
    }

    async detail(ctx,next) {
        //获取动态ID
        const momentId = ctx.params.momentId;

        //根据动态ID查询动态详情
        const result = await momentService.getMomentById(momentId);
        ctx.body = result;
    }

    async list(ctx,next) {
        //获取数据
        const { offset, size } = ctx.query;

        //查询列表
        const result = await momentService.getMomentList(offset,size);
        ctx.body = result;
    }

    //修改动态
    async update(ctx,next) {
        //获取参数
        const { momentId } = ctx.params;
        const { content } = ctx.request.body;
        //执行修改
        const result = await momentService.update(content,momentId);
        ctx.body = result;
    }

    //删除动态
    async remove(ctx,next) {
        //获取参数
        const { momentId } = ctx.params;

        //执行删除
        const result = await momentService.remove(momentId);
        ctx.body = result;
    }

    async addLabels(ctx,next) {
        //获取标签和动态Id
        const { labels } = ctx;
        console.log(labels);
        const { momentId } = ctx.params;

        //添加所有的标签
        for(let label of labels){
            //判断标签是否已经和动态有关系
            const isExist = await momentService.hasLabel(momentId,label.id);
            if(!isExist) {
                await momentService.addLabels(momentId,label.id);
            }
        }
     
        ctx.body = "给动态添加标签成功~";

    }

    
    async fileInfo(ctx,next) {
        let { filename } = ctx.params;
        const fileInfo = await fileService.getFileByFilename(filename);

        //根据不同的类型，获取对应大小的图片
        const { type } = ctx.query;
        const types = ["large","middle","small"];
        if(types.some(item => item === type)){
            filename = filename + '-' + type;
        }

        ctx.response.set('content-type',fileInfo.mimetype);
        ctx.body = fs.createReadStream(`${PICTURE_PATH}/${filename}`);
    }
}

module.exports = new MomentController();