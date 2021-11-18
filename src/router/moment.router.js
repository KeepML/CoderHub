const Router = require('koa-router');

const momentRouter = new Router({prefix: '/moment'});
const {
    create,
    detail,
    list,
    update,
    remove,
    addLabels,
    fileInfo
} = require('../controller/moment.controller.js');

const {
    verifyAuth,
    verifyPermission
} = require('../middleware/auth.middleware');

const {
    verifyLabelExists
} = require('../middleware/label.middleware');

momentRouter.post('/',verifyAuth,create);
momentRouter.get('/',list);
momentRouter.get('/:momentId',detail);
momentRouter.patch('/:momentId',verifyAuth,verifyPermission,update);
momentRouter.delete('/:momentId',verifyAuth,verifyPermission,remove);

//给动态添加标签
    verifyLabelExists
    momentRouter.post('/:momentId/labels',verifyAuth,verifyPermission,verifyLabelExists,addLabels);


//获取动态配图
momentRouter.get('/images/:filename',fileInfo);


module.exports = momentRouter;