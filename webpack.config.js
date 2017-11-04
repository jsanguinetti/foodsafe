const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');


const fs  = require('fs');
const solc = require('solc');
const input = {
  'FoodSafe.sol': fs.readFileSync('contracts/FoodSafe.sol', 'utf8')
};
const compiledContract = solc.compile({sources: input}, 1);
const abi = compiledContract.contracts['FoodSafe.sol:FoodSafe'].interface;
const foodSafeCode = '0x'+compiledContract.contracts['FoodSafe.sol:FoodSafe'].bytecode;



module.exports = {
  entry: './app/javascripts/app.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.js'
  },
  plugins: [
    // Copy our app's index.html to the build folder.
    new CopyWebpackPlugin([
      { from: './app/index.html', to: "index.html" }
    ]),
    new webpack.DefinePlugin({
      'process.env': {
        'FOODSAFE_CODE': foodSafeCode,
        'FOODSAFE_ABI': JSON.stringify(abi)
      }
    })
  ],
  module: {
    rules: [
      {
       test: /\.css$/,
       use: [ 'style-loader', 'css-loader' ]
      }
    ],
    loaders: [
      { test: /\.json$/, use: 'json-loader' },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          plugins: ['transform-runtime']
        }
      }
    ]
  }
}
