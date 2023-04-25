const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin(
            {
                template: './src/index.html',
            }
        ),
        new CopyPlugin(
            {
                patterns: [
                    {
                        from: path.resolve(__dirname, 'src/assets'),
                        to: path.resolve(__dirname, 'dist/assets')
                    },
                    // {
                    //     from: path.resolve(__dirname, 'src/fonts'),
                    //     to: path.resolve(__dirname, 'dist/fonts')
                    // }
                ]
            })
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        open: true,
    },
    mode: 'production',

}
