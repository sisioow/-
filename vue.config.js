const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
//   devServer: {
//     proxy: {
//       '/course': {
//         target: 'http://10.60.66.99:8080',
//         changeOrigin: true,
//         pathRewrite: {
//           '^/course': ''
//         }
//       }
//     }
// }
devServer: {
  proxy: {
    '/api': {
      target: 'http://10.33.55.58:8080',
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    }
  }
}
})


