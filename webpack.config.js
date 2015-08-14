module.exports = {
    context: __dirname + "/src",
    entry: "./lib/shopify/index",
    output: {
        path: __dirname + "/dist",
        filename: "bundle.js",
        libraryTarget: 'commonjs'
    },
    externals: [
      { 
        inflection: true,
        superagent: true,
        crypto: true,
        url: true
      }
    ],
    node: {
      process: false,
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel',
          query: {
            // optional: ['runtime'],
            stage: 0
          }
        }
      ]
    }
}