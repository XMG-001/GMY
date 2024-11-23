import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
//引入gzip压缩
import viteCompression from "vite-plugin-compression";
//压缩图片
import viteImagemin from "vite-plugin-imagemin";
import Components from "unplugin-vue-components/vite";
// ui库解析器，也可以自定义，需要安装相关UI库，unplugin-vue-components/resolvers
// 提供了以下集中解析器，使用的时候，需要安装对应的UI库，这里以element为示例
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { visualizer } from "rollup-plugin-visualizer";
import requireTransform from 'vite-plugin-require-transform';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    // alias: {
    //   "@": path.resolve(__dirname, "src"),
    // },
    alias: {
      '@': '/src'
    }
  },
  // 配置代理
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://172.27.170.6:8080', // 更新为正确的目标地址和端口
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, ''),
  //     },
  //   },
  // },
  //配置打包公共根路径
  base: "/", //修改为'./' => '/'
  plugins: [
    vue(),
    // 插件可以使用 requireTransform 插件，将require的文件进行转换
    // requireTransform({
    //   fileRegex: /.js$|.vue$/
    // }),
    //gzip压缩
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: "gzip",
      ext: ".gz",
    }),
    //图片压缩
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false,
      },
      optipng: {
        optimizationLevel: 7,
      },
      mozjpeg: {
        quality: 20,
      },
      pngquant: {
        quality: [0.8, 0.9],
        speed: 4,
      },
      svgo: {
        plugins: [
          {
            name: "removeViewBox",
          },
          {
            name: "removeEmptyAttrs",
            active: false,
          },
        ],
      },
    }),
    Components({
      dirs: ["src/components"], // 目标文件夹
      extensions: ["vue", "jsx"], // 文件类型
      dts: "src/components.d.ts", // 输出文件，里面都是一些import的组件键值对
      // ui库解析器，也可以自定义，需要安装相关UI库
      resolvers: [ElementPlusResolver()],
    }),
    //打包完可视化
    visualizer({
      open: true, // 注意这里要设置为true，否则无效，如果存在本地服务端口，将在打包后自动展示
      gzipSize: true,
      file: "stats.html", //分析图生成的文件名
      brotliSize: true,
    }),
  ],
  //生产环境配置
  build: {
    //移除console.log
    minify: "terser", // 默认为esbuild,需要安装terser -D
    terserOptions: {
      compress: {
        drop_console: true, // 生产环境移除console
        drop_debugger: true, // 生产环境移除debugger
      },
    },
  },
});
