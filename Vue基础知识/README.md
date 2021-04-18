
### 1. 谈谈你对Vue的理解吧？
    Vue 是一套用于构建用户界面的渐进式框架，Vue.js 的核心库只关注视图层。使用MVVM模式，代码体积小，运行效率高。Vue.js包含声明式
    渲染，组件化系统，客户端路由，大规模状态管理，构建工具，数据持久化，跨平台支持等。
    组件机制：
        就是对一个功能和样式进行独立的封装，让HTML得到扩展，从而使代码得到复用，使得开发更灵活，更加高效；
        组件是可复制的 Vue 实例，它们与 new Vue 接收相同的选项，例如 data, computed, watch, methods 以及生命周期钩子等；
        每用一次组件，就会有一个它的新实例被创建；
        可以通过 prop 向子组件传递数据，prop 是你可以在组件上注册的一些自定义 attribute，当一个值传递给一个 prop attribute 的时候，它就变成了那个组件实例的一个 property。
    事件的传递：
        Vue 内部实现了一个事件总线系统，即 EventBus。在 Vue 中可以使用 EventBus 来作为沟通桥梁的概念，每一个 Vue 的组件实例
        都继承了 EventBus，都可以接受事件 on 和发送事件 emit。
        父子组件通信时，父组件通过 prop 向子组件传递数据，子组件通过 this.$emit 向父组件传递数据；
    内容分发：
        Vue 实现了一套内容分发的 API，这套 API 的设计灵感源自 Web Components 规范草案，将 <slot> 元素作为承载分发内容的出口。
        插槽分为具名插槽和匿名插槽，默认插槽又名单个插槽或匿名插槽，没有 name 属性，有 name 属性的是具名插槽。
    还有响应式系统，虚拟DOM，diff算法等等。

### 2. MVC模式和MVVM模式？
    MVC模式：
    M: Model(数据模型) 用于存放数据
    V: View(视图) 就是用户界面
    C: Controller(控制器) 业务逻辑
    控制器负责从数据层获取数据，控制用户的输入，并向模型发送数据。
    优点：耦合性低，重用性高。
    缺点：
        - 所有的用户逻辑都在 Controller 里面操作，逻辑复杂且不利于维护。
        - 大量的 DOM 操作使页面渲染性能降低，加载速度变慢，影响用户体验。
        - 当 Model 频繁发生变化，需要主动更新到 View；当用户的操作发生变化的时候，同样需要将变化的数据同步到 Model 中，这样工作不仅繁琐，而且很难维护复杂多变的数据状态。
    
    由于 MVC 模式存在缺陷，于是衍生出了 MVVM 模式；
    MVVM 模式：
    M: Model(数据模型)
    V: View(视图)
    VM: ViewModel 是一个同步 View 和 Model 的对象，View 和 Model 之间没有直接的联系，而是通过 ViewModel 进行交互。
    ViewModel 通过双向数据绑定把 View 层和 Model 层连接了起来，而 View 和 Model 之间的同步工作完全是自动的。因此开发者只需要关注业务逻辑，不需要手动操作DOM，不需要关注数据状态的同步问题，复杂的数据状态维护完全由 MVVM 来统一管理。
    VM 双向数据绑定：在 MVVM 框架中，View 和 Model 是不可以直接通讯的，在它们之间存在着 ViewModel 这个中间充当观察者的角色。
    当用户操作 View，ViewModel 感知到变化，然后通知 Model 发生相应的改变；反之当 Model 发生改变，ViewModel 也能感知到变化，
    使 View 做出相应的更新。这个一来一回的过程就是双向数据绑定。

### 3. Vuex 的思想
    - 每一个 Vuex 里面都有一个全局的 Store，包含应用中大部分的状态 state;
    - 这个 state 是单一的，和 Redux 类似，一个应用仅会包含一个 Store 实例;
    - 单一状态树的好处是能够直接定位任一特定的状态片段，方便调试;
    - Vuex 的状态存储是响应式的，当 Vue 组件从 Store 中读取状态的时候，若 Store 中的状态发生变化，那么相应的组件也会更新;
    - 不能直接改变 Store 中的状态，改变 Store 中的状态的唯一途径就是显式的提交(commit) mutation。这样方便跟踪每一个状态的变化。
        store.commit('increment');
    - Vuex 通过 store 选项，把 state 注入到整个应用中，子组件通过 this.$store 来访问 state;
    - mutation 都是同步事务，类似于 Redux 的 Reducer;
    - Vuex 可以直接修改 state，不用每次都生成新的 state;
    - 总的来说都是让 View 通过某种方式触发 Store 的事件或方法，Store 的事件或方法对 state 进行修改或返回一个新的 state，state 改变之后，View 发生相应的改变；

    异步: Vuex 加入了 Action 来处理异步，Vuex 的想法是把同步和异步拆分开。异步操作的时候不会影响到同步操作，通过 Store.dispatch('increment') 来触发某个 Action。Action 里面不管执行多少异步操作，完成之后都通过 store.commit('increment') 来触发 mutation，一个 Action 里面可以触发多个 mutaion。
    Vuex 把同步和异步操作通过 mutaion 和 Action 来分开处理，是一种方式，但不是唯一的方式。比如可以不用 Action，而是在应用的内部调用异步请求，请求完毕之后直接 commit mutation;

### 4. Vue 和 React 的对比

### 5. Vue 如何实现双向数据绑定
    Vue 数据双向绑定主要是指: 数据变化更新视图，视图变化更新数据。
    主要通过一下四个步骤来实现数据双向绑定:
        1. 实现一个监听器 Observer: 对数据对象进行遍历，包括子属性对象的属性，利用 Object.defineProperty() 对属性都加上 setter 和 getter。这样的话，给这个对象的某个值赋值，就会触发 setter，那么就能监听到数据的变化了。
        2. 实现一个解析器 Compile: 解析 Vue 模版指令，将模版中的变量都替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有了变化，收到通知，调用更新函数进行数据的更新。
        3. 实现一个订阅者 Watcher: Watcher 订阅者是 Observer 和 Compile 之间通信的桥梁，主要的任务是订阅 Observer 中的属性值变化的消息，当收到属性值变化的消息时，触发解析器 Compile 中对应的更新函数。
        4. 实现一个订阅器 Dep: 订阅器采用 发布-订阅 设计模式，用来收集订阅者 Watcher，对监听器 Observer 和 订阅者 Watcher 进行统一管理。

### 6. 为什么要用发布订阅模式
    发布订阅模式的目的是解耦，让各个模块之间没有紧密的联系。如果页面非常简单，解耦和不解耦区别并不是非常的大。但是，当页面的结构变得非常复杂的时候，页面有很多组件构成，每个组件都需要维护一套它自己的属性和状态，每个组件都会有属于它的渲染的方法或者虚拟DOM的比较的方法，例如：脏检查机制，它都要进行判断，性能就会消耗的非常的多，所以我们的操作就需要调整。

    **目标, 如果修改了什么属性, 就尽可能只更新这些属性对应的页面 DOM**

### 7. 为什么拆解成多个watcher
    Vue 中很多的组件被划分为了很多的数据，很多的数据对应于很多的 watcher，第一次渲染的时候页面要全部加载渲染，所以会把全部的watcher 都存储到全局的 watcher 里面去。但是更新的时候可能只会更新其中的某一部分，那么当我们更新其中某一部分的时候，某一部分的 watcher 就会存储的全局的 watcher 里面去，其他的 watcher 就不会存储到全局的 watcher 里面去。当页面要更新的时候，从全局的 watcher 里面取出来的就只有那一个 watcher，那么页面中也就只有那一个对应的组件会被更新，这样就提高了页面渲染的效率。

    内存中可以有多个 watcher，但至少有一个 watcher
    页面一更新完成，全局 watcher 中的所有 watcher 就会移除

    - 读取的时候，将 watcher 存入到全局容器中，被称为**依赖搜集**；
    - 修改的时候，将全局容器中的 watcher 取出来执行，被称为**派发更新**；

### 8. Proxy 与 Object.defineProperty 优劣对比
    Proxy 的优势如下:
        - Proxy 可以直接监听对象而非属性
        - Proxy 可以直接监听数组的变化
        - Proxy 有多达 13 种拦截方法,不限于 apply、ownKeys、deleteProperty、has 等等是 Object.defineProperty 不具备的；
        - Proxy 返回的是一个新对象,我们可以只操作新的对象达到目的,而 Object.defineProperty 只能遍历对象属性直接修改
        - Proxy 作为新标准将受到浏览器厂商重点持续的性能优化，也就是传说中的新标准的性能红利
    
    Object.defineProperty 的优势如下:
        - 兼容性好，支持 IE9，而 Proxy 的存在浏览器兼容性问题,而且无法用 polyfill 磨平，因此 Vue 的作者才声明需要等到下个大版本( 3.0 )才能用 Proxy 重写。

### 9. Vue 中的 key 有什么作用？
    - key 的作用主要是 为了实现高效的更新虚拟 DOM，提高性能。其原理是vue在patch的过程中通过key可以精准的判断两个节点是否是同一个，从而避免频繁的更新元素，使得整个patch过程更加高效，减少DOM操作量，提高性能。
    - 如果不设置 key，还有可能会触发一些隐蔽的 bug。
    - vue在使用相同的标签名元素的过渡切换时，也会使用到key属性，其目的也是为了让vue可以区分它们，否则vue只会替换其内部属性而不会触发过渡效果。
    - key属性被用在组件上时，当key改变时会引起新组件的创建和原有组件的删除，此时组件的生命周期钩子就会被触发。

### 10. computed 和 watch 的对比
    computed 是计算属性，类似于过滤器，对绑定到视图的数据进行处理，并监听变化进而执行对应的方法。计算属性是基于它们的依赖进行缓存的，只在相关依赖发生改变的时候才会重新求值。
    watch 是一个侦听的动作，用来观察和响应 Vue 实例上的数据变动。使用 watch 选项允许我们执行异步操作，限制我们执行该操作的频率，并在我们得到最终结果前，设置中间状态。这些都是计算属性无法做到的。

    相同点: computed和watch都起到监听/依赖一个数据，并进行处理的作用
    不同点: 它们其实都是vue对监听器的实现，只不过computed主要用于对同步数据的处理，watch则主要用于观测某个值的变化去完成一段开销较大的复杂业务逻辑

    能用 computed 的时候优先用 computed，避免了多个数据影响其中某个数据时多次调用 watch 的尴尬情况。

### 11. Vue 中路由的三种传参方式
    第一种方式 页面刷新数据不会丢失:
        直接调用 this.$router.push 实现携带参数的跳转
        this.$router.push({
          path: `/particulars/${id}`,
        })
    需要在 Router 的 path 里面添加 /:id 来对应 $router.push 中 path 携带的参数，在子组件中可以使用 this.$route.params.id 来获取参数。

    第二种方法 页面刷新数据会丢失:
        通过路由属性中的name来确定匹配的路由，通过params来传递参数。
        this.$router.push({
          name: 'particulars',
          params: {
            id: id
          }
        })
    注意这里在 Router 中不需要使用 /:id 来传递参数，子组件使用 this.$route.params.id 来获取参数。

    第三种方法:
        使用path来匹配路由，然后通过query来传递参数，这种情况下 query 传递的参数会显示在url后面?id=？
        this.$router.push({
          path: '/particulars',
          query: {
            id: id
          }
        })
    子组件使用 this.$route.query.id 来获取参数。

### 12. watch 中 immediate，handler 和 deep 这三个属性的详解
    immediate 和 handler: 在使用 watch 的时候有一个特点，就是当值第一次绑定的时候，不会执行监听函数，只有值在发生改变的时候，才会执行。如果需要在最初始绑定值的时候也执行函数，则需要 immediate 属性。
    deep: 当需要监听一个对象的改变的时候，普通的 watch 方法无法监听到对象内部属性的改变，此时就需要 deep 属性对对象进行深度监听。

### 13. computed 和 watch 在源码中是如何实现的

### 14. Vue 中哪些地方用到了闭包
    (1) 数据响应化 Observer 中使用闭包
        很多人会疑问，value 明明是形参，为什么给他赋值就能够达到数值改变的效果呢？形参不是出了这个函数就没用了么？
	    其实，这就用到了闭包的原理，value是外层函数 defineReactive 的参数，而我们实际上使用value确是在内层的get或set方法里面
		这样就形成了一个闭包的结构了。根据闭包的特性，内层函数可以引用外层函数的变量，并且当内层保持引用关系时外层函数的这个变量
		不会被垃圾回收机制回收。那么,我们在设置值的时候，把val保存在value变量当中，然后get的时候再通过value去获取，这样，我们再访问obj.name时，无论是设置值还是获取值，实际上都是对value这个形参进行操作的。
        function defineReactive(target, key, value){
            return Object.defineProperty(target, key, {
                get(){
                    return value;
                },
                set(val){
                    value = val;
                }
            })
        }

### 15. Vue 项目中路由权限控制怎么实现
    将路由配置按用户类型分割为 用户路由 和 基本路由，不同的用户类型可能存在不同的 用户路由，具体依赖实际业务。
    - 用户路由: 当前用户所特有的路由
    - 基本路由：所有用户均可以访问的路由

    实现控制的方式分两种：
        - 通过vue-router addRoutes 方法注入路由实现控制
        - 通过vue-router beforeEach 钩子限制路由跳转

    addRoutes 方式：
        通过请求服务端获取当前用户路由配置，编码为 vue-router 所支持的基本格式（具体如何编码取决于前后端协商好的数据格式），通过调用 this.$router.addRoutes 方法将编码好的用户路由注入到现有的 vue-router 实例中去，以实现用户路由。
    
    beforeEach 方式：
        通过请求服务端获取当前用户路由配置，通过注册 router.beforeEach 钩子对路由的每次跳转进行管理，每次跳转都进行检查，如果目标路由不存再于 基本路由 和 当前用户的 用户路由 中，取消跳转，转为跳转错误页。

    两种方式的原理其实都是一样的，只不过 addRoutes 方式 通过注入路由配置告诉 vue-router ：“当前我们就只有这些路由，其它路由地址我们一概不认”，而 beforeEach 则更多的是依赖我们手动去帮 vue-router 辨别什么页面可以去，什么页面不可以去。

    addRoutes 的缺点: addRoutes 方法仅仅是帮你注入新的路由，并没有帮你剔除其它路由！
    解决办法: 通过新建一个全新的 Router，然后将新的 Router.matcher 赋给当前页面的管理 Router，以达到更新路由配置的目的。
    
    ```
    import Vue from 'vue'
    import Router from 'vue-router'
    Vue.use(Router)
    const createRouter = () => new Router({
        mode: 'history',
        routes: []
    })
    const router = createRouter()
    export function resetRouter () {
        const newRouter = createRouter()
        router.matcher = newRouter.matcher
    }
    export default router
    ```

    还可以在路由的配置文件中设置 requireAuth 属性指定哪些页面需要登陆权限，然后在 beforeEach 中通过 to.meta.requireAuth 来判断。
    router.beforeEach((to, from, next) => {
        let islogin = localStorage.getItem("islogin");
        if(to.meta.requireAuth && islogin) {
            next();
        }else{
            next("/login");
        }
    })

### 16. Vue 项目性能优化方案
    1. 代码层面的优化
        (1) v-if 和 v-show 区分使用场景

        (2) computed 和 watch  区分使用场景

        (3) v-for 遍历必须为 item 添加 key，且避免同时使用 v-if

        (4) 长列表性能优化
            Vue 会通过 Object.defineProperty 对数据进行劫持，来实现视图响应数据的变化，然而有些时候我们的组件就是纯粹的数据展示，不会有任何改变，我们就不需要 Vue 来劫持我们的数据，在大量数据展示的情况下，这能够很明显的减少组件初始化的时间。那如何禁止 Vue 劫持我们的数据呢？可以通过 Object.freeze 方法来冻结一个对象，一旦被冻结的对象就再也不能被修改了。

        (5) 事件的销毁

        (6) 图片资源懒加载

        (7) 路由懒加载

        (8) 第三方插件的按需引入
            在项目中经常会需要引入第三方插件，如果我们直接引入整个插件，会导致项目的体积太大，我们可以借助 babel-plugin-component ，然后可以只引入需要的组件，以达到减小项目体积的目的。

        (9) 优化无限列表性能

        (10) 服务端渲染 SSR or 预渲染

        (11) 页面中组件太多可以使用异步组件优化

    2. Webpack 层面的优化
        (1) Webpack 对图片进行压缩
            在 vue 项目中除了可以在 webpack.base.conf.js 中 url-loader 中设置 limit 大小来对图片处理，对小于 limit 的图片转化为 base64 格式，其余的不做操作。所以对有些较大的图片资源，在请求资源的时候，加载会很慢，我们可以用 image-webpack-loader来压缩图片。
        
        (2) 减少 ES6 转为 ES5 的冗余代码
            Babel 插件会在将 ES6 代码转换成 ES5 代码时会注入一些辅助函数，例如下面的 ES6 代码：
                class HelloWebpack extends Component{...}
            这段代码再被转换成能正常运行的 ES5 代码时需要以下两个辅助函数：
                babel-runtime/helpers/createClass  // 用于实现 class 语法
                babel-runtime/helpers/inherits  // 用于实现 extends 语法
            在默认情况下， Babel 会在每个输出文件中内嵌这些依赖的辅助函数代码，如果多个源代码文件都依赖这些辅助函数，那么这些辅助函数的代码将会出现很多次，造成代码冗余。为了不让这些辅助函数的代码重复出现，可以在依赖它们时通过 require('babel-runtime/helpers/createClass') 的方式导入，这样就能做到只让它们出现一次。babel-plugin-transform-runtime 插件就是用来实现这个作用的，将相关辅助函数进行替换成导入语句，从而减小 babel 编译出来的代码的文件大小。
        
        (3) 提取公共代码
            如果项目中没有去将每个页面的第三方库和公共模块提取出来，则项目会存在以下问题：
                - 相同的资源被重复加载，浪费用户的流量和服务器的成本。
                - 每个页面需要加载的资源太大，导致网页首屏加载缓慢，影响用户体验。
            所以我们需要将多个页面的公共代码抽离成单独的文件，来优化以上问题。Webpack 内置了专门用于提取多个Chunk 中的公共部分的插件 CommonsChunkPlugin。

        (4) 模板预编译
            当使用 DOM 内模板或 JavaScript 内的字符串模板时，模板会在运行时被编译为渲染函数。通常情况下这个过程已经足够快了，但对性能敏感的应用还是最好避免这种用法。
            预编译模板最简单的方式就是使用单文件组件——相关的构建设置会自动把预编译处理好，所以构建好的代码已经包含了编译出来的渲染函数而不是原始的模板字符串。
            如果你使用 webpack，并且喜欢分离 JavaScript 和模板文件，你可以使用 vue-template-loader，它也可以在构建过程中把模板文件转换成为 JavaScript 渲染函数。

        (5) 提取组件的 CSS
            当使用单文件组件时，组件内的 CSS 会以 style 标签的方式通过 JavaScript 动态注入。这有一些小小的运行时开销，如果你使用服务端渲染，这会导致一段 “无样式内容闪烁 (fouc) ” 。将所有组件的 CSS 提取到同一个文件可以避免这个问题，也会让 CSS 更好地进行压缩和缓存。

        (6) 优化 SourceMap
            在项目进行打包后，会将开发中的多个文件代码打包到一个文件中，并且经过压缩、去掉多余的空格、babel编译化后，最终将编译得到的代码会用于线上环境，那么这样处理后的代码和源代码会有很大的差别，当有 bug的时候，我们只能定位到压缩处理后的代码位置，无法定位到开发环境中的代码，对于开发来说不好调式定位问题，因此 sourceMap 出现了，它就是为了解决不好调式代码问题的。

        (7) 构建结果输出分析
            分析工具: webpack-bundle-analyzer

        (8) Vue 项目的编译优化

    3. 基础的 Web 技术优化
        (1) 开启 gzip 压缩

        (2) 浏览器缓存

        (3) CDN 的使用

        (4) 使用 Chrome Performance 查找性能瓶颈

### 17. vue中单页应用和多页应用的优劣
    多页应用:
        每一次页面跳转的时候，后台服务器都会给返回一个新的html文档，这种类型的网站也就是多页网站，也叫做多页应用。

        首屏时间快: 首屏时间叫做页面首个屏幕的内容展现的时间，当我们访问页面的时候，服务器返回一个html，页面就会展示出来，这个过程只经历了一个HTTP请求，所以页面展示的速度非常快。
        搜索引擎优化效果好: 搜索引擎在做网页排名的时候，要根据网页内容才能给网页权重，来进行网页的排名。搜索引擎是可以识别html内容的，而我们每个页面所有的内容都放在Html中，所以这种多页应用，seo排名效果好。
        缺点: 切换慢。因为每次跳转都需要发出一个http请求，如果网络比较慢，在页面之间来回跳转时，就会发现明显的卡顿。

    单页应用:
        第一次进入页面的时候会请求一个html文件，刷新清除一下。切换到其他组件，此时路径也相应变化，但是并没有新的html文件请求，页面内容也变化了。
        原理: JS会感知到url的变化，通过这一点，可以用js动态的将当前页面的内容清除掉，然后将下一个页面的内容挂载到当前页面上，这个时候的路由不是后端来做了，而是前端来做，判断页面到底是显示哪个组件，清除不需要的，显示需要的组件。这种过程就是单页应用，每次跳转的时候不需要再请求html文件了。

        页面切换快: 页面每次切换跳转时，并不需要做html文件的请求，这样就节约了很多http发送时延，我们在切换页面的时候速度很快。
        缺点: 首屏时间慢，SEO差。
            - 单页应用的首屏时间慢，首屏时需要请求一次html，同时还要发送一次js请求，两次请求回来了，首屏才会展示出来。相对于多页应用，首屏时间慢。
            - SEO效果差，因为搜索引擎只认识html里的内容，不认识js的内容，而单页应用的内容都是靠js渲染生成出来的，搜索引擎不识别这部分内容，也就不会给一个好的排名，会导致单页应用做出来的网页在百度和谷歌上的排名差。
        
        有这些缺点，为什么还要使用 Vue?
            Vue还提供了一些其它的技术来解决这些缺点，比如说服务器端渲染技术 (SSR)，通过这些技术可以完美解决这些缺点，解决完这些问题，实际上单页面应用对于前端来说是非常完美的页面开发解决方案。

