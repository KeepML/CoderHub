const labelService = require('../service/label.service');

const verifyLabelExists = async(ctx,next) => {
    console.log("验证标签是否存在~");
    //取出要添加的的所有标签
    const { labels } = ctx.request.body;

    //判断每个标签在标签列表中是否已经存在
    const newLabels = [];
    for(let name of labels){
        const labelResult = await labelService.getLabelByName(name);
        const label = { name }

        if(!labelResult){
            //创建标签数据
            const result = await labelService.create(name);
            label.id = result.insertId;
        }else {
            label.id = labelResult.id;
        }

        newLabels.push(label);
    }
    //console.log(newLabels);
    ctx.labels = newLabels;
    await next();
}

module.exports = {
    verifyLabelExists
}