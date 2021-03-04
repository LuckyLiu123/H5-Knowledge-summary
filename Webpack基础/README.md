
### 1. Webpack 的构建流程
    Webpack 是一个 JS 代码打包器，图片，CSS，Less，TS等其他文件需要 Webpack 配合 loader 或者 plugin 功能来实现。
    Webpack 的构建过程:
        1. 根据配置，识别入口文件；
        2. 逐层识别模块依赖(包括Common.js, AMD 或 ES6 的 import等，都会被识别和分析)；
        3. Webpack 的主要工作内容就是分析代码，转换代码，编译代码，最后输出代码；
        4. 输出最后打包后的代码；

    Webpack 的构建原理:
        1. 初始化参数: 解析 Webpack 配置参数，合并 Shell 传入和 webpack.config.js 文件配置的参数，形成最后的配置的结果。
        2. 开始编译: 上一步得到的参数初始化 compiler 对象，注册所有配置的插件，插件监听 Webpack 构建生命周期的事件节点，作出相应的反应，执行对象的 run 方法开始执行编译。
        3. 确定入口: 从配置文件 webpack.config.js 中指定的 entry 入口，开始解析文件构建 AST 语法树，找出依赖，递归下去。
        4. 编译模块: 递归中根据 文件的类型 和 loader 配置，调用所有配置的 loader 对文件进行转换，再找出该模块依赖的模块，再递归本步骤，直到所有入口依赖的文件都经过来本步骤的处理。
        5. 完成模块编译并输出: 递归完成，得到每个文件的结果，包含每个模块以及它们之间的依赖关系，根据 entry 配置生成代码块 chunk。
        6. 输出完成: 输出所有的 chunk 到文件系统。

    在构建生命周期中有一系列插件在合适的时机做合适的事情，比如 UglifyPlugin 会在 loader 转换递归完对结果使用 UglifyJs 压缩覆盖之前的结果。

    Webpack 的工作流程:
        1. 参数解析;
        2. 找到入口文件;
        3. 调用 Loader 编译文件;
        4. 遍历 AST, 收集依赖;
        5. 生成 Chunk;
        6. 输出文件;

    真正起到编译作用的便是 loader
    loader 的作用很简单，就是处理任意类型的文件，并且将它们转换成一个让 webpack 可以处理的有效模块。
    loader 在 webpack.config.js 文件的 module.rules 里面配置。
    每一条 rule 会包含两个属性: test 和 use, 比如: { test: /\.js$/, use: 'babel-loader' } 意思是: 当 webpack 遇到扩展名为 js 的文件时，先用 babel-loader 处理一下，然后再打包它。
    当 use 是通过数组形式声明 Loader 时，Loader 的执行顺序是从右向左，从下到上，比如：
        postcss-loader -> css-loader -> style-loader

### 2. HMR 热更新的原理
    当你对代码进行修改并保存之后，webpack 将对代码重新打包，并将新的模块发送到浏览器端，浏览器通过新的模块替换老的模块，这样在不刷新浏览器的前提下就能够对应用进行更新。
    原理:
        1. 启动 webpack, 生成 compiler 实例。compiler 上有很多方法，比如可以启动 webpack 所有编译工作，以及监听本地文件的变化。
        2. 使用 express 框架启动本地 server，让浏览器可以请求本地的静态资源。
        3. 本地 server 启动之后，再去启动 websocket 服务。通过 websocket 服务，可以建立本地服务和浏览器的双向通信。这样就可以实现当本地文件发生改变，立马告知浏览器可以热更新代码了。

    每次修改代码，就会触发编译，说明还需要监听本地代码的变化，主要是通过 setupDevMiddleware 方法实现的。这个方法主要执行了 webpack-dev-middleware 库。
    webpack-dev-middleware 和 webpack-dev-server 的区别:
        - webpack-dev-server 只负责启动服务和前置的准备工作;
        - webpack-dev-middleware 负责所有文件相关的操作，主要是本地文件的编译和输出以及监听;