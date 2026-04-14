module.exports = {
    mode: "development",
    entry: {
      "prac4-1": "./src/prac4-1.js",
      "prac4-2": "./src/prac4-2.js",
      "prac4-3": "./src/prac4-3.js",
      "prac4-4": "./src/prac4-4.js"
    },
    output: {
        filename: '[name].js'
    },
    devServer: {
        static: {
            directory: __dirname
        },
        devMiddleware: {
            writeToDisk: true
        }
    },
    performance: {
        hints: false,
        maxAssetSize: 1000000,
        maxEntrypointSize: 1000000
    },
    module: {
    rules: [
      {
        test: /\.m?js$/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false
        }
      }
    ]
  }
};
