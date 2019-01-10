const path = require('path');


module.exports = {
    entry: path.resolve(__dirname, 'src/js', 'root.js'),
    externs:{

    },
    module:{
        rules:[
            {
                test:/\.css$/,
                use:[
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test:/\.js?$/,
                exclude: /node_modules/,
                include: path.resolve(__dirname,'./src/js'),
                use:{
                    loader:'babel-loader'
                    //options: require('./babel.config')
                }
            },
            {
                test: /\.(png|jpg|gif)$/,
                include:path.resolve(__dirname,'./src/img'),
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name:'[path][name].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    output: {
        path: path.resolve(__dirname,'dist'),
        filename: 'bundle.js',
        publicPath: '',
    },
    plugins: [
        
    ]
};