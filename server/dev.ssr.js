const webpack = require('webpack')
const axios = require('axios')
const MemoryFS = require('memory-fs')
const fs = require('fs')
const path = require('path')
const Router = require('koa-router')
const webpackConfig = require('@vue/cli-service/webpack.config')
const { createBundleRenderer } = require("vue-server-renderer");


const serverCompiler = webpack(webpackConfig)
const mfs = new MemoryFS()
serverCompiler.outputFileSystem = mfs 

let bundle 
serverCompiler.watch({}, (err, stats) =>{
  if (err) {
    throw err
  }
  stats = stats.toJson()
  stats.errors.forEach(error => console.error(error) )
  stats.warnings.forEach( warn => console.warn(warn) )
  const bundlePath = path.join(
    webpackConfig.output.path,    
    'vue-ssr-server-bundle.json'
  )
  bundle = JSON.parse(mfs.readFileSync(bundlePath,'utf-8'))
  console.log('new bundle generated')
})

const handleSSR = async ctx => {
  console.log('path', ctx.path)
  if (!bundle) {
    ctx.body = '稍等一会在访问'
    return 
  }
  const clientManifestResp = await axios.get('http://localhost:8080/vue-ssr-client-manifest.json')
  const clientManifest = clientManifestResp.data
  
  const renderer = createBundleRenderer(bundle, {
    runInNewContext: false,
    template: fs.readFileSync(path.resolve(__dirname, "../src/index.temp.html"), "utf-8"),
    clientManifest: clientManifest
  });
  const html = await renderToString(ctx,renderer)
  ctx.body = html;
}
function renderToString(context,renderer) {
  return new Promise((resolve, reject) => {
    renderer.renderToString(context, (err, html) => {
      err ? reject(err) : resolve(html);
    });
  });
}

const router = new Router()
router.get('*', handleSSR)

// app.use(router.routes()).use(router.allowedMethods())
// const port = process.env.PORT || 3000;
// app.listen(port,()=>{
  
//   console.log(`server started at localhost:${port}`);
// })
module.exports = router
// export default handleSSR 