## 以下是本人学习CodeWhy老师时所作的笔记，本项目只完成了部分功能，但很好体现出了封装思想

### 1.webpack加载babel

1. 安装babel转换器相关的包：**npm i babel-loader @babel/core @babel/runtime -D**

2. 安装babel语法插件相关的包：**npm i @babel/preset-env @babel/plugin-transform-runtime @babel/plugin-proposal-class-properties –D**

3. 在项目根目录创建babel.config.js

   ```js
   module.exports = {
       presets: [ '@babel/preset-env' ],
       plugins: [ '@babel/plugin-transform-runtime', '@babel/plugin-proposal-class-properties’ ]
   }
   ```

4. 在webpack.config.js的module->rules数组中添加规则

   ```js
   // exclude 为排除项，表示 babel-loader 不需要处理 node_modules 中的 js 文件
   { test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ }
   ```

### 2.webpack打包图片

```shell
npm install --save-dev url-loader
npm install -D file-loader
```

在进行webpack打包图片文件时，若图片大小小于options的limit，则默认将图片转换成base64字符串，加载在内存中，此时只需要url-loader，若加载文件大于limit则需要file-loader

```js
{
        test: /\.(png|jpg|gif|jpeg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              // 当加载的图片, 小于limit时, 会将图片编译成base64字符串形式.
              // 当加载的图片, 大于limit时, 需要使用file-loader模块进行加载.
              limit: 13000,
              name: 'img/[name].[hash:8].[ext]',
              publicPath: 'dist/'//注意index.html文件并未在dist目录下
            },
          }
        ]
      }
```

### 3.脚手架演变过程

1. webpack加载vue，**npm i vue -S**(vue默认使用runtime-only版本，无法编译，runtime-compiler可以编译)，需要在webpack中配置如下

   ```js
    resolve: {//与module同级
       alias: {
         'vue$': 'vue/dist/vue.esm.js'
       }
     }
   ```

2. 创建组件app.js

   ```js
   export default {
     template:  `
     <div>
       <h2>{{message}}</h2>
       <button @click="btnClick">按钮</button>
       <h2>{{name}}</h2>
     </div>
     `,
     data() {
       return {
         message: 'Hello Webpack',
         name: 'coderwhy'
       }
     },
     methods: {
       btnClick() {
   
       }
     }
   }
   ```

3. 在入口文件main.js中引用组件

   ```js
   import Vue from 'vue'
   import App from './vue/app'
   const app = new Vue({
       el: '#app',
       template: '<App/>',
       components: {
           App
       } 
   })
   ```

4. 使用vue单文件组件代替app.js

   - 运行 **npm i vue-loader vue-template-compiler -D** 命令

   - 在webpack.config.js中配置文件，添加vue-loader相关配置项，注意vue-loader需要相应插件支持

     ```js
     const VueLoaderPlugin = require('vue-loader/lib/plugin')
     module.exports = {
     	module: {
     		rules: [
     			// ... 其它规则
     			{ test: /\.vue$/, loader: 'vue-loader' }
     			]
     		},
     	plugins: [
     			// ... 其它插件
     			new VueLoaderPlugin() // 请确保引入这个插件！
     		] 
     }
     ```

     ```vue
     <template>
       <div>
         <h2 class="title">{{message}}</h2>
         <button @click="btnClick">按钮</button>
         <h2>{{name}}</h2>
         <Cpn/>
       </div>
     </template>
     
     <script>
       import Cpn from './Cpn'
     
       export default {
         name: "App",
         components: {
           Cpn
         },
         data() {
           return {
             message: 'Hello Webpack',
             name: 'coderwhy'
           }
         },
         methods: {
           btnClick() {
     
           }
         }
       }
     </script>
     
     <style scoped>
       .title {
         color: green;
       }
     </style>
     
     ```

### 4.配置 html-webpack-plugin 生成预览页面（即在打包文件夹中生成index.html）

1. npm install html-webpack-plugin –D

2. 在webpack.config.js中添加配置

   ```js
   // 导入生成预览页面的插件，得到一个构造函数
   const HtmlWebpackPlugin = require('html-webpack-plugin')
   const htmlPlugin = new HtmlWebpackPlugin({ // 创建插件的实例对象
   	template: './src/index.html', // 指定要用到的模板文件
   	filename: 'index.html' // 指定生成的文件的名称，该文件存在于内存中，在目录中不显示
   })
   module.exports = {
   	plugins: [ htmlPlugin ] // plugins 数组是 webpack 打包期间会用到的一些插件列表
   }
   
   ```

   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
     <meta charset="UTF-8">
     <title>Title</title>
   </head>
   <body>
     <div id="app">
     </div>
   </body>
   </html>
   
   ```

### 5.配置webpack的自动打包

1. npm install webpack-dev-server –D

2. package.json -> scripts

   ```js
   "scripts": {
   	"dev": "webpack-dev-server" // script 节点下的脚本，可以通过 npm run 执行
   }
   
   ```

   - webpack-dev-server 会启动一个实时打包的 http 服务器
   - webpack-dev-server 打包生成的输出文件，默认放到了项目根目录中，而且是虚拟的、看不见的

### 6.runtime-only与runtime-compiler的区别

![render过程](C:/Users/abcd/Desktop/notes/img/compile.png)

- runtime-only：render -> vdom -> UI

  ```js
  import Vue from 'vue'
  import App from './App'
  
  Vue.config.productionTip = false
  new Vue({
    el: '#app',
    render: function (createElement) {
      // 1.普通用法: createElement('标签', {标签的属性}, [''])
      // return createElement('h2',
      //   {class: 'box'},
      //   ['Hello World', createElement('button', ['按钮'])])
  
      // 2.传入组件对象:
      return createElement(App)
    }
  })
  
  ```

- runtime-compiler：template -> ast -> render -> vdom -> UI

  ```js
  new Vue({
      el:'#app',
      template:'<App/>'
      components:{App}
  })
  
  ```

### 7.前后端分离（解耦）

1. 后端路由阶段

   当浏览器通过url访问服务器时，服务器通过url请求后台将相应的数据，包括html，js，数据库数据等在服务端通过jsp技术放回给浏览器，即所有的操作均在服务端中执行，此时的后端程序员需要处理的业务十分繁琐，该阶段也称后端渲染阶段

2. 前后端分离阶段

   当ajax的出现，后端不需要将所有的数据返回给前端，此时后端只负责数据，不负责任何阶段的内容，此时浏览器中显示的大部分内容都是由前端的js代码执行后向后端发送ajax请求获取数据，从而渲染页面，此时也称前端渲染阶段，该阶段html css js一般放置在静态资源服务器。此时的url不在是直接向服务端请求，而是向静态资源服务器请求资源，然后让浏览器执行js代码向后台获取数据

3. SPA页面

   在前后端分离的基础上在加上路由形成了spa页面，当url请求发送到静态资源服务器时会将页面的所有静态资源返回，后期的url请求不在向静态资源服务器发送，而是通过路由的方式切换到相应的页面，也就是组件。前端路由的出现，使得前端也能向后端一样实现工程化，有对应的controller等。如果说组件化实现复用性，模块化实现多人协同开发的划分，那么前端工程化则使组件化，模块化有机结合，更好的管理

### 8. Vue响应式原理

1. app.message修改数据时，Vue内部是如何监听message数据的改变

   Object.defineProperty ->监听对象属性的改变

   ```js
       const obj = {
         message: "哈哈",
         name: "why"
       }
       //观察者，源码里每一个data属性都对应一个发布者
       Object.keys(obj).forEach(key => {
         let value = obj[key]
         Object.defineProperty(obj, key, {
           set(newValue) {
             console.log("改变值被监听");
             //根据html解析能够清楚的知道谁用到了该属性
             //当有数据发生改变时通过Dep.notify()方法通知页面刷新
             value = newValue;
           },
           get() {
             return value;
           }
         })
       })
   
   ```

2. 当数据发生改变，Vue是如何知道要通知哪些人的，界面发生刷新

   通过发布者订阅者模式

   ```js
       //发布订阅者模式
       //发布者
       class Dep {
         constructor() {
           this.subs = []
         }
         addSub(watcher){
           this.subs.push(watcher)
         }
         notify(){
           this.subs.forEach(item=>{
             item.update()
           })
         }
       }
       //订阅者
       class Watcher{
         constructor(name){
           this.name = name;
         }
         update(){
           console.log(this.name + "发生update")
         }
       }
       const dep = new Dep();
       const w1 = new Watcher('张三');
       dep.addSub(w1)
       const w2 = new Watcher('张三');
       dep.addSub(w2)
       const w3 = new Watcher('张三');
       dep.addSub(w3)
   
       dep.notify()
   
   ```

   ![响应式原理](C:/Users/abcd/Desktop/notes/img/%E5%93%8D%E5%BA%94%E5%BC%8F%E5%8E%9F%E7%90%86.jpg)

