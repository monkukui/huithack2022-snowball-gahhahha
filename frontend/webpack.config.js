const path = require("path")

module.exports = {
  entry: {
    main: "./src/index.js",
  },
  output: {
    path: `${__dirname}/public`,
    filename: "[name].js",
  },
  devServer: {
    open: true,
    static: {
      // watchContentBase: true,
      directory: path.join(__dirname, "public"),
    },
  },
  target: "web",
};