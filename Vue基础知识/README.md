
### 1. 谈谈你对Vue的理解吧？
    Vue 是一套用于构建用户界面的渐进式框架，Vue.js 的核心库只关注视图层。使用MVVM模式，代码体积小，运行效率高。Vue.js包含声明式
    渲染，组件化系统，客户端路由，大规模状态管理，构建工具，数据持久化，跨平台支持等。
    组件机制：
        就是对一个功能和样式进行独立的封装，让HTML得到扩展，从而使代码得到复用，使得开发更灵活，更加高效；
        组件是可复制的 Vue 实例，它们与 new Vue 接收相同的选项，例如 data, computed, watch, methods 以及生命周期钩子等；
        每用一次组件，就会有一个它的新实例被创建；
        可以通过 prop 向子组件传递数据，prop 是你可以在组件上注册的一些自定义 attribute，当一个值传递给一个 prop attribute
        的时候，它就变成了那个组件实例的一个 property。
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
        - 当 Model 频繁发生变化，需要主动更新到 View；当用户的操作发生变化的时候，同样需要将变化的数据同步到 Model 中，这样工
        作不仅繁琐，而且很难维护复杂多变的数据状态。
    
    由于 MVC 模式存在缺陷，于是衍生出了 MVVM 模式；
    MVVM 模式：
    M: Model(数据模型)
    V: View(视图)
    VM: ViewModel 是一个同步 View 和 Model 的对象，View 和 Model 之间没有直接的联系，而是通过 ViewModel 进行交互。
    ViewModel 通过双向数据绑定把 View 层和 Model 层连接了起来，而 View 和 Model 之间的同步工作完全是自动的。因此开发者只需要
    关注业务逻辑，不需要手动操作DOM，不需要关注数据状态的同步问题，复杂的数据状态维护完全由 MVVM 来统一管理。
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
        1. 实现一个监听器 Observer: 对数据对象进行遍历，包括子属性对象的属性，利用 Object,defineProperty() 对属性都加上 setter 和 getter。这样的话，给这个对象的某个值赋值，就会触发 setter，那么就能监听到数据的变化了。
        2. 实现一个解析器 Compile: 解析 Vue 模版指令，将模版中的变量都替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有了变化，收到通知，调用更新函数进行数据的更新。
        3. 实现一个订阅者 Watcher: Watcher 订阅者是 Observer 和 Compile 之间通信的桥梁，主要的任务是订阅 Observer 中的属性值变化的消息，当收到属性值变化的消息时，触发解析器 Compile 中对应的更新函数。
        4. 实现一个订阅器 Dep: 订阅器采用 发布-订阅 设计模式，用来收集订阅者 Watcher，对监听器 Observer 和 订阅者 Watcher 进行统一管理。

### 6. Proxy 与 Object.defineProperty 优劣对比
    Proxy 的优势如下:
        - Proxy 可以直接监听对象而非属性
        - Proxy 可以直接监听数组的变化
        - Proxy 有多达 13 种拦截方法,不限于 apply、ownKeys、deleteProperty、has 等等是 Object.defineProperty 不具备的；
        - Proxy 返回的是一个新对象,我们可以只操作新的对象达到目的,而 Object.defineProperty 只能遍历对象属性直接修改
        - Proxy 作为新标准将受到浏览器厂商重点持续的性能优化，也就是传说中的新标准的性能红利
    
    Object.defineProperty 的优势如下:
        - 兼容性好，支持 IE9，而 Proxy 的存在浏览器兼容性问题,而且无法用 polyfill 磨平，因此 Vue 的作者才声明需要等到下个大版本( 3.0 )才能用 Proxy 重写。

### 7. Vue 中的 key 有什么作用？
    - key 的作用主要是 为了实现高效的更新虚拟 DOM，提高性能。其原理是vue在patch的过程中通过key可以精准的判断两个节点是否是同一个，从而避免频繁的更新元素，使得整个patch过程更加高效，减少DOM操作量，提高性能。
    - 如果不设置 key，还有可能会触发一些隐蔽的 bug。
    - vue在使用相同的标签名元素的过渡切换时，也会使用到key属性，其目的也是为了让vue可以区分它们，否则vue只会替换其内部属性而不会触发过渡效果。
    - key属性被用在组件上时，当key改变时会引起新组件的创建和原有组件的删除，此时组件的生命周期钩子就会被触发。

### 8. computed 和 watch 的对比
    computed 是计算属性，类似于过滤器，对绑定到视图的数据进行处理，并监听变化进而执行对应的方法。计算属性是基于它们的依赖进行缓存的，只在相关依赖发生改变的时候才会重新求值。
    watch 是一个侦听的动作，用来观察和响应 Vue 实例上的数据变动。使用 watch 选项允许我们执行异步操作，限制我们执行该操作的频率，并在我们得到最终结果前，设置中间状态。这些都是计算属性无法做到的。

    相同点: computed和watch都起到监听/依赖一个数据，并进行处理的作用
    不同点: 它们其实都是vue对监听器的实现，只不过computed主要用于对同步数据的处理，watch则主要用于观测某个值的变化去完成一段开销较大的复杂业务逻辑

    能用 computed 的时候优先用 computed，避免了多个数据影响其中某个数据时多次调用 watch 的尴尬情况。

### 9. Vue 中路由的三种传参方式
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

### 10. watch 中 immediate，handler 和 deep 这三个属性的详解
    immediate 和 handler: 在使用 watch 的时候有一个特点，就是当值第一次绑定的时候，不会执行监听函数，只有值在发生改变的时候，才会执行。如果需要在最初始绑定值的时候也执行函数，则需要 immediate 属性。
    deep: 当需要监听一个对象的改变的时候，普通的 watch 方法无法监听到对象内部属性的改变，此时就需要 deep 属性对对象进行深度监听。

### 11. computed 和 watch 在源码中是如何实现的

### 12. Vue 中哪些地方用到了闭包
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

