
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

### 3. webpack 性能调优
    网络层面的性能优化主要是从 HTTP 连接开始，HTTP 连接这一层的优化才是网络优化的核心。
    HTTP 优化有两个方向:
        - 减少请求次数
        - 减少单次请求所花费的时间

    这两点优化直接指向了日常开发中非常常见的操作: 资源的压缩和合并。
    webpack 的优化瓶颈主要是两方面:
        - webpack 的构建过程太花时间
        - webpack 打包的结果体积太大

    构建过程提速策略:
        1. 最常见的优化方案是使用 include 或 exclude 来帮我们避免不必要的转译，以 babel-loader 为例:
            exclude: /(node_modules|brower_components)/,
        通过 exclude 规避了对庞大的 node_modules 文件夹或 bower_components 文件夹的处理。但通过限定文件的范围带来的性能提升是有限的。除此之外，还可以开启缓存将转译结果缓存至文件系统，可以将 babel-loader 的工作效率提升两倍。
            例如: loader: 'babel-loader?cacheDirectory=true'
        2. 不放过第三方库: 第三方库以 node_modules 为主，它庞大得可怕，处理第三方库的方法有很多:
            - Externals 不够聪明，一些情况下会引发重复打包的问题
            - CommonsChunkPlugin 每次构建时都会重新构建一次 vendor
            - DllPlugin 会把第三方库单独打包到一个文件中，这个文件就是一个单纯的依赖库。这个依赖库不会跟着你的业务代码一起被重新打包，只有当依赖自身发生版本变化时才会重新打包。
        出于效率的考虑，推荐使用 DllPlugin。
        3. 用 DllPlugin 处理文件，分为两步:
            - 基于 dll 专属的配置文件，打包 dll 库
            - 基于 webpack.config.js 文件，打包业务代码

        运行 Dll 专属的配置文件，会在 dist 文件夹里出现两个文件:
            - vendor-manifest.json 用来描述每个第三方库对应的具体路径
            - vendor.js 是第三方打包结果
        4. Happypack 将 loader 由单进程转换为多进程:
            webpack 是单进程的，就算此刻存在多个任务，也只能排队一个接一个地等待处理，这是 webpack 的缺点。好在 CPU 是多核的，Happypack 会充分释放 CPU 在多核方面的优势，把任务分解给多个子进程去并发执行，大大提升打包效率。
        5. 构建结果体积压缩:
            通过包组成可视化工具: webpack-bundle-analyzer，文件结构可视化，找出导致体积过大的原因，它会以矩形树图的形式将包含各个模块的大小和依赖关系呈现出来。
        6. 拆分资源，仍然围绕 DllPlugin 展开
            - 删除冗余的代码: Tree-Shaking，意思是基于 import/export 语法，Tree-Shaking 可以在编译的过程中获悉哪些模块并没有真正的被使用，这些没用的代码，在最后打包的时候会被去除。Tree-Shaking 的针对性很强，适合用来处理模块级别的冗余代码。至于粒度更细的冗余代码的去除，往往会被整合进 JS 或 CSS 的压缩或分离过程中。
        7. 按需加载
            - 一次不加载完所有的内容，只加载此刻需要用到的部分(提前做拆分)
            - 当需要更多内容的时候，再对用到的内容进行即时的加载
            开启按需加载的核心方法: require.ensure(dependencies, callback, chunkName)
            在 React-Router4 中确实是用的 Code-spliting，但是在 React-Router4 实现过路由级别的按需加载中用到了 Bundle-loader。在它的源码中仍然是用 require.ensure 来实现的。
            所谓的按需加载，根本上就是在正确的时机去触发相应的回调。
        8. Gzip 压缩
            开启 Gzip 压缩，只需要在 request headers 中加上一句:
                accept-encoding: gzip
            HTTP 压缩: HTTP 压缩就是以缩小体积为目的的，对 HTTP 内容进行重新编码的过程。
            Gzip 的内核就是 Deflate，目前我们压缩文件用得最多的就是 Gzip。可以说，Gzip 就是 HTTP 压缩的经典例题。

            Gzip 压缩背后的原理: 是在一个文本文件中找出一些重复出现的字符串，临时替换它们，从而使得整个文件变小。根据这个原理，文件中代码的重复率越高，那么压缩的效率也就越高，使用 Gzip 的收益也就越大，反之亦然。
            一般来说，Gzip 压缩是服务器的活儿: 服务器了解到我们这边有一个 Gzip 压缩的需求，它会启动自己的 CPU 去为我们完成这个任务。而压缩文件这个过程本身是需要耗费时间的，可以理解为我们以服务器压缩的时间开销和 CPU 开销(以及浏览器解析压缩文件的开销)为代价，省下来一些传输过程中的时间开销。