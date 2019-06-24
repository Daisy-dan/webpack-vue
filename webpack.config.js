var path = require('path')
const webpack = require('webpack')
// webpack4.0 npm install --save-dev extract-text-webpack-plugin@next 单独打包静态文件
const ExtractPlugin = require('extract-text-webpack-plugin')

const VueLoaderPlugin = require('vue-loader/lib/plugin')
const isDev = process.env.NODE_ENV === 'development'

const HTMLPlugin = require('html-webpack-plugin')

const config = {
    mode: 'production',
    target: 'web',
   
    output: {
        filename: 'bundle.[hash:8].js',
        path: path.join(__dirname,'dist')
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader:'vue-loader'
            },
            {
                test: /\.jsx$/,
                loader:'babel-loader'
            },
            {
                test: /\.(gif|jpg|jpeg|png|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1024,
                            name: '[name].[ext]'
                        }
                    }

                ]
            }
        ],
        
    },
    performance: {
        hints:false           
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: isDev ? '"development"' : '"production"'
            }
        }),
        new VueLoaderPlugin(),
        new HTMLPlugin()
    ],
    

}

if(isDev){
    config.entry = path.join(__dirname,'src/index.js'),
    //页面调试，es6编译过的代码调试
    config.devtool = '#cheap-module-eval-source-map'
    config.devServer = {
        port: 8000,
        host: '0.0.0.0',
        overlay: {
            errors: true
            
        },
        hot: true   //改组件代码，值渲染当前组件，数据存在

    }
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin
    )
    config.module.rules.push(
        {
            test: /\.css$/,
            use: ['style-loader','css-loader']
        },
    )
}else{
    config.entry = {
        app: path.join(__dirname,'src/index.js'),
        vendor : ['vue']
    }
    config.output.filename = '[name].[chunkhash:8].js' //hash优化
    config.module.rules.push(
        {
            test: /\.css$/,
            use: ExtractPlugin.extract({
                fallback: 'style-loader',
                use: [
                    'css-loader'
                ]
            })
        },
    )
    config.plugins.push(
        new ExtractPlugin('styles.[chunkhash:8].css'),
        //4.0 webpack.optimize.CommonsChunkPlugin 移除，改为webpack.optimize.SplitChunksPlugin
        new webpack.optimize.SplitChunksPlugin({
            name: 'vendor'
        }),
        new webpack.optimize.SplitChunksPlugin({
            name: 'runtime'
        })
    )
    
}
module.exports = config