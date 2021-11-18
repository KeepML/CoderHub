const dotenv = require('dotenv');
const fs = require('fs');
const { Module } = require('module');
const path = require('path');



//把env文件导入到process.env环境变量中
dotenv.config();

const PRIVATE_KEY = fs.readFileSync('src/app/keys/private.key');//相对路径
const PUBLIC_KEY = fs.readFileSync(path.resolve(__dirname,'./keys/public.key'));//绝对路径

//从process.env中取出APP_PORT并导出
module.exports = {
    APP_HOST,
    APP_PORT,
    MYSQL_HOST,
    MYSQL_PORT,
    MYSQL_DATABASE,
    MYSQL_USER,
    MYSQL_PASSWORD
} = process.env;

module.exports.PRIVATE_KEY = PRIVATE_KEY;
module.exports.PUBLIC_KEY = PUBLIC_KEY;