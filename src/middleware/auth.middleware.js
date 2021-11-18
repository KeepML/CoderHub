const jwt = require('jsonwebtoken');

const errorType = require('../constants/error-types');
const userService = require('../service/user.service');
const md5password = require('../utils/password-handle');
const { PUBLIC_KEY } = require('../app/config');
const authService = require('../service/auth.service');

const verifyLogin = async (ctx,next) => {

    //1.获取用户名和密码
    const { name, password } = ctx.request.body;

    //2.判断用户名和密码是否为空
    if(!name || !password){
        const error = new Error(errorType.NAME_OR_PASSWORD_IS_REQUIRED);
        return ctx.app.emit('error',error,ctx);
    }

    //3.判断用户名是否存在
    const result = await userService.getUserByName(name);
    //console.log(result);
    const user = result[0];
   // console.log(user);
    if(!user){ //用户不存在
        const error = new Error(errorType.USER_DOES_NOT_EXISTS);
        return ctx.app.emit('error',error,ctx);
    }

    //4.判断密码是否正确(加密比对)
    // console.log(md5password(password));
    if(md5password(password) !== user.password){
        const error = new Error(errorType.PASSWORD_IS_ERROR);
        return ctx.app.emit('error',error,ctx);
    }
    ctx.user = user; //保存用户信息
    await next();
}

//登录验证授权(验证token)
const verifyAuth = async(ctx,next) => {
    console.log("验证授权的middleware~");
    //获取token
    const authorization = ctx.headers.authorization;
    if(!authorization){
        const error = new Error(errorType.UNAUTHORIZATION);
        return ctx.app.emit('error',error,ctx);
    }
   
    const token = authorization.replace('Bearer ','');
    try {
         //验证token
        const result = jwt.verify(token,PUBLIC_KEY,{
         algorithms: ["RS256"]
        });
        ctx.user = result;
        await next();
    } catch (error) {
        const err = new Error(errorType.UNAUTHORIZATION);
        ctx.app.emit('error',err,ctx);
    }

}

//特定模块权限验证方法
// const verifyPermission = async (ctx,next) => {
//     console.log("验证权限的middleware~");

//     const { momentId } = ctx.params;
//     const { id } = ctx.user;
   
//     try {
//         const isPermission = await authService.checkMoment(momentId,id);
//         if(!isPermission){
//             const error = new Error(errorType.UNPERMISSION);
//             return ctx.app.emit("error",error,ctx);
//         }
//         await next();
//     } catch (err) {
//         const error = new Error(errorType.UNPERMISSION);
//         return ctx.app.emit("error",error,ctx);
//     }
   
// }

//通用权限验证方法1
// const verifyPermission = (tableName) => {
//     return async (ctx,next) => {
//         console.log("验证权限的middleware~");
    
//         const { momentId } = ctx.params;
//         const { id } = ctx.user;
       
//         try {
//             const isPermission = await authService.checkResource(tableName,momentId,id);
//             if(!isPermission){
//                 const error = new Error(errorType.UNPERMISSION);
//                 return ctx.app.emit("error",error,ctx);
//             }
//             await next();
//         } catch (err) {
//             const error = new Error(errorType.UNPERMISSION);
//             return ctx.app.emit("error",error,ctx);
//         }
       
//     }
// }

//通用权限验证方法2：
const verifyPermission = async (ctx,next) => {
    console.log("验证权限的middleware~");

    const [resourceKey] = Object.keys(ctx.params);
    const tableName = resourceKey.replace("Id",'');
    const resourceId = ctx.params[resourceKey];
    // const { momentId } = ctx.params;
    const { id } = ctx.user;
   
    try {
        const isPermission = await authService.checkResource(tableName,resourceId,id);
        if(!isPermission){
            const error = new Error(errorType.UNPERMISSION);
            return ctx.app.emit("error",error,ctx);
        }
        await next();
    } catch (err) {
        const error = new Error(errorType.UNPERMISSION);
        return ctx.app.emit("error",error,ctx);
    }
   
}

module.exports = {
    verifyLogin,
    verifyAuth,
    verifyPermission
}