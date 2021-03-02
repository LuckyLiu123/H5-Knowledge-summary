## 1. Redux 的思想
    - 流程：
        1. 用户通过 View 发出 Action;
            store.dispatch(action)
        2. 然后 store 自动调用 Reducer，并传入两个参数：当前 state 和收到的 Action，Reducer 会返回新的 state；
            let nextState = xxxReducer(previousState, action)
        3. state 一旦发生变化，Store 就会调用监听函数；
            store.subscribe(listener)
        4. listener 可以通过 store.getState() 得到当前状态，然后触发重新渲染 View；
            getState() 函数在两个地方用到: 一是 dispatch 拿到 Action 后 store 需要用它来获取 state 里面的数据，并把数据传递给 reducer，这个过程是自动执行的；二是在利用 subscribe 监听 state 发生变化后调用它来获取新的 state 数据。

    - Action 是 Store 数据的唯一来源，一般通过 store.dispatch() 将 Action 传到 Store。Store 可以通过 createStore() 方法创建，主要作用就是将 Action 和 Reducer 联系起来并改变 state。
    - Redux 是单向数据流，它的三大原则：单一数据源；state 是只读的；使用纯函数来进行修改；
    - Redux 执行异步操作使用中间件，Redux 提供了 applyMiddleware 方法来应用中间件，常用的中间件如：redux-thunk，redux-promise 和 redux-saga.

## 2. Mobx 的思想
    - 任何源自应用状态的东西都应该自动地获取，意思是状态只要一变，其他用到状态的地方都会跟着自动变。
    - Redux 的思想主要是函数式编程(FP)的思想，而 Mobx 更接近于面向对象编程，它通过 @observable 装饰器把 state 包装成可观察对象，只要 state 一发生变化，所有用到它的地方都跟着发生变化。

## 3. Redux 和 Mobx 的对比
    - Redux 数据流流动很自然，可以充分利用时间回溯的特征，增强业务的可预测性；Mobx 没有那么自然的数据流动，没有时间回溯功能。但是 View 更新很精确，粒度控制很细。
    - Redux 通过引入中间件来处理副作用；Mobx 没有中间件，副作用的处理比较自由。
    - Redux 的样板代码更多，需要做一大堆准备工作；而 Mobx 没有啥多余的代码，直接硬来。

    Redux 和 Mobx 没有孰优孰劣，Redux 比 Mobx 有更多的样板代码，是因为有特定的设计约束。如果项目较小的话，使用 Mobx 更灵活，但是大型项目，如果像 Mobx 这样没有约束，会造成代码很难维护，所以各有利弊。建议小项目使用 Mobx，大项目使用 Redux 更合适。









