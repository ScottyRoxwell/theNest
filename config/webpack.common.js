const path = require("path");

module.exports = {
  entry: {
    main: ["@babel/polyfill","./src/index.js"],
    vendor: "./src/vendor.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: /node_modules/, 
      },
      {
        test: /\.pug$/,
         use: [
           "html-loader",
           "pug-html-loader"]
      },
      {
        test: /\.(svg|png|jpe?g|gif|bmp)$/i,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[hash].[ext]",
            outputPath: "images"
          }
        }
      },
      {
        test: /\.glb$/,
        use: 'file-loader'
      }
    ]
  }
};