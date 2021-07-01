# webpack 学习
生产常用配置配置，及优化
```js
    // common.js
const {resolve} = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const WorkboxWebpackPlugin = require('workbox-webpack-plugin')
const webpack = require("webpack")
const AddAssetHtmlWebpackPlugin =  require('add-asset-html-webpack-plugin')
process.env.NODE_ENV = "production"

module.exports = {
    entry:'./index.js', //入口文件
    output:{
        filename:'js/[name].[contenthash:10].js', //输出文件名
        path:resolve(__dirname,'build') //输出文件路径
    },
    module:{
        rules:[
            {
                test:/\.css$/,
                use:[
                    // 创建style标签中使用，一般用于开发中
                    // 'style-loader',
                    {
                        loader:MiniCssExtractPlugin.loader,//提取css 成单独文件
                        options:{
                            // 这里可以指定一个 publicPath
                            // 默认使用 webpackOptions.output中的publicPath
                            publicPath: '../'
                        }
                    },
                    
                    // 将css 文件变成common.js，内容是字符串
                    'css-loader',
                    {
                        loader:'postcss-loader',
                        options:{
                            // postcss browserslist 配置css 兼容性
                            ident:'postcss',
                            plugins:()=>[
                                require('postcss-preset-env')()
                            ]
                        }
                    }
                ]
            },
            {
                test:/\.less$/,
                use:[
                    // 'style-loader',
                    {
                        loader:MiniCssExtractPlugin.loader,//提取css 成单独文件
                        options:{
                            // 这里可以指定一个 publicPath
                            // 默认使用 webpackOptions.output中的publicPath
                            publicPath: '../'
                        }
                    },
                    'css-loader',
                    {
                        loader:'postcss-loader',
                        options:{
                            // postcss browserslist 配置css 兼容性
                            ident:'postcss',
                            plugins:()=>[
                                require('postcss-preset-env')()
                            ]
                        }
                    },
                    'less-loader',
                   
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
                use:[
                    {
                        loader:'thread-loader', //开启多进行打包
                        options:{
                            workers:4, //8核 一般填cpu核数
                        }
                    },
                    {
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
                                ]
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
                minify:{
                    // 移除空格
                    collapseWhitespace: true,
                    // 移除注释
                    removeComments: true,
                }
            }
        ),
        new MiniCssExtractPlugin({
            filename:'style/main.[contenthash:10].css',
            
        }),
        //压缩css
        new OptimizeCssAssetsWebpackPlugin(),
        // 生成配serviceWorker置文件
        new WorkboxWebpackPlugin.GenerateSW({
            clientsClaim:true, //删除旧的serviceWorker
            skipWaiting:true, //快速启动 跳过等待
        }),
        // 告诉webpack 那些库不参与打包，同时使用时名称也得改
        new webpack.DllReferencePlugin({
            manifest:resolve(__dirname,'dll/manifest.json')
        }),
        //在html制动引入不打包的文件
        new AddAssetHtmlWebpackPlugin({
            filepath:resolve(__dirname,'dll/jquery.js'),
            // 文件输出目录
            outputPath: 'vendor',
            // 脚本或链接标记的公共路径
            publicPath: 'vendor'
        }),
    ],
    // 拆包将node_module 中的代码单独打包一个chunk
    optimization:{
        splitChunks:{
            chunks:'all'
        }
    },
    devServer:{
        contentBase:resolve(__dirname,'build'),
        compress:true, //启动gzip压缩
        port:3000,
        open:true,
    },
    devtool:'source-map',
    // externals:{
    //     jquery:'jQuery' //不将jquery 打包到chunk中
    // }
    // mode:'development' //开发模式
}
```