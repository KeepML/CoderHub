const fs = require('fs');


const userRoute = function(){
    //读取路由文件
    fs.readdirSync(__dirname).forEach(file => {
        if(file === 'index.js') return;
        const router = require(`./${file}`);
        this.use(router.routes());
        this.use(router.allowedMethods());
    })
}

module.exports = userRoute;