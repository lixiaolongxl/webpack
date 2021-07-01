// common.js
const {resolve} = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    entry:['./index.js','./public/index.html'], //入口文件
    output:{
        filename:'js/main.[hash:10].js', //输出文件名
        path:resolve(__dirname,'build') //输出文件路径
    },
    module:{
        rules:[
           {
               oneOf:[ //提高构建速度 同一类型的loader 不能出现两次
                    {
                        test:/\.css$/,
                        use:[
                            // 创建style标签中使用，一般用于开发中
                            'style-loader',
                            // 将css 文件变成common.js，内容是字符串
                            'css-loader'
                        ]
                    },
                    {
                        test:/\.less$/,
                        use:[
                            'style-loader',
                            'css-loader',
                            'less-loader'
                        ]
                    },
                    { //处理图片
                        test:/\.(jpg|png|gif)$/,
                        loader:'url-loader', //依赖file-loader
                        options:{
                            limit:1 * 1024, //小于这么大的打包成base64的字符串
                            // url-loader模式使用es6模块化解析，html-loader映入图片是common.js
                            // 关闭url-loaderes6模块化解析 使用common.js解析
                            esModule:false,
                            // 区hash的前10位 ext 原来的扩展名
                            name:'[hash:10].[ext]',
                            outputPath:'imgs'
                        }
                    },
                    {
                        test:/\.html$/,
                        //处理html的image文件 负责引入img 从而倍url-loader 处理
                        loader:'html-loader'
                    },
                    { //其他资源打包
                        // test:/\.pdf$/,
                        exclude:/\.(css|html|js|less|png|jpg|gif)/,
                        loader:'file-loader',
                        options:{
                            name:'[hash:10].[ext]',
                            outputPath:'media'
                        }
                    },
                    { //sj 基本兼容处理
                        test:/\.js$/,
                        exclude:/node_modules/,
                        // enforce:'pre', 强制先解析当遇到有这中条件是可以加上
                        loader:'babel-loader',
                        options:{
                            // 预设：指示bable做怎阳的兼容处理
                            presets:[
                                ["@babel/preset-env",
                                {
                                    // 按需加载
                                    useBuiltIns: "entry",
                                    // 指定corejs版本
                                    corejs:{
                                        version:3,
                                    },
                                    // // 指定兼容的具体版本
                                    targets:{
                                        chrome:'60',
                                        firefox:'60',
                                        ie:'9',
                                        safari:'10',
                                        edge:'17'
                                    }
                                }]
                            ],
                            cacheDirectory:true, //开启babel 缓存
                        }
                    }
               ]
           }
        ]
    },
    plugins:[
        // html-webpack-pligin 默认会创建html文件并引入打包输出的所有资源
        new HtmlWebpackPlugin(
            {
                template:'./public/index.html',
                // title:'app',
                // filename:'lxl.html',
            }
        )
    ],
    devServer:{
        contentBase:resolve(__dirname,'build'),
        compress:true, //启动gzip压缩
        port:3000,
        open:true,
        hot:true
    },
    devtool:'eval-source-map',
    mode:'development',  //生产模式
    // mode:'production' //开发模式
}