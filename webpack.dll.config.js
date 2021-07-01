const {resolve} = require('path');
const webpack = require("webpack")
module.exports = {
    entry:{
        jquery:['jquery'], //可以很多
    },
    output:{
        filename:'[name].js',
        path:resolve(__dirname,'dll'), //输出文件路径
        // library:'[name]_[hash]',
        library:'[name]',
    },
    plugins:[
        new webpack.DllPlugin({
            // name:'[name]_[hash]',
            name:'[name]',
            path: resolve(__dirname,'dll/manifest.json')
        })
    ],
    mode:'production' //开发模式
}