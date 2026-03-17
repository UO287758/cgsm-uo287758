module.exports = {
    mode: "development",
    entry: {
      "prac2-1": "./src/prac2-1.js",
      "prac2-2": "./src/prac2-2.js",
      "prac2-3": "./src/prac2-3.js"
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
