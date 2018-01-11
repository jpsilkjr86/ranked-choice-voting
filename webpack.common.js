const path = require('path');
// webpack configuration for all environments (starting point)
module.exports = {
  // entry point for react app
  entry: {
    app: "./app/app.js"
  },
  // output of compiled js (bundle.js)
  output: {
    path: path.join(__dirname, '/public'),
    publicPath: '/',
    filename: "bundle.js"
  },
  // allows for multiple extensions in imports
  resolve: {
    extensions: ['.js', '.jsx']
  },
  // transformations
  module: {
    loaders: [
      // for .js / .jsx
      {
        // limited to .js or .jsx extensions
        test: /\.jsx?$/,
        // only look inside app folder
        include: /app/,
        // redundant step; excludes any node_modules files
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          // transformations
          presets: ["react", "env"],
          plugins: [
            // allows for {...rest} in destructuring props, etc
            require('babel-plugin-transform-object-rest-spread'),
            // allows for property initializers in class definitions
            require('babel-plugin-transform-class-properties')
          ]
        }
      },
      // for .css to enable css-modules (locally scoped css!)
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          }, 
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[path][name]__[local]--[hash:base64:5]'
            }
          }
        ]
      },
      // for image-type assets
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      }
    ]
  }
};