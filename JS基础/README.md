### 1. 事件循环机制
    JavaScript 是一门单线程语言，为了协调事件，用户交互，脚本，UI渲染和网络处理等行为，避免进程被阻塞的问题，必须使用 事件循环(Event Loop).
    JavaScript 中的任务被分为同步任务和异步任务。同步任务就是 立即执行的任务，会在调用栈中按照顺序等待主线程依次执行。异步任务也就是异步执行的任务，异步任务会在异步任务有了结果之后，将注册的回掉函数放入任务队列中等待主线程空闲的时候(也就是调用栈被清空)，被读取到栈内等待主线程的执行。比如 ajax网络请求，setTimeout定时器函数等都属于异步任务。

    在代码执行的时候，同步和异步任务分别进入不同的执行环境，同步的进入主线程，即主执行栈，异步的进入 Event Queue。主线程内的任务执行完毕为空，会去 Event Queue 读取对应的任务，推入主线程执行。上述过程不断的重复就是事件循环(Event Loop).

    在事件循环中，每进行一次循环操作称为 tick，其关键步骤如下:
        1. 在此次 tick 中选择最先进入队列的任务(oldest task)，如果有则执行；
        2. 检查是否存在 Microtasks，如果存在则不停地执行，直至清空 Microtask Queue；
        3. 更新render;
        4. 主线程重复执行上述步骤；

    执行栈在执行完同步任务之后，查看执行栈是否为空，如果执行栈为空，就会去检查微任务(microTask)队列是否为空。如果为空的话，就执行Task(宏任务)，否则就一次性执行完所有微任务。
    每次单个宏任务执行完毕后，检查微任务(microTask)队列是否为空，如果不为空的话，会按照先入先出的规则全部执行完微任务(microTask)后，设置微任务(microTask)队列为null，然后再执行宏任务，如此循环。

    task 被分为两大类，分别是 MacroTask(宏任务)和 MicroTask(微任务)，并且每个宏任务结束之后，都要清空所有的微任务。
    宏任务主要包含: script整体代码, setTimeout, setInterval, I/O, UI交互事件, setImmediate(Node.js环境)
    微任务主要包含: Promise, MutationObserver, process.nextTick(Node.js环境)
    setTimeout/Promise 等API便是任务源，来自不同任务源的任务会进入到不同的任务队列。其中 setTimeout 和 setInterval 是同源的。

    程序先执行同步任务，再执行异步任务。同步任务分为宏任务和微任务。
    执行顺序: 执行同步任务(先执行宏任务，再执行微任务)，遍历异步队列，执行异步任务。

    注: JavaScript 是一门单线程语言，异步操作都是放在事件循环队列里面，等待主执行栈来执行的，并没有专门的异步执行线程。


### 2. 原型和原型链
    每个对象都有 __proto__ 属性，用于指向创建它的构造函数的原型对象。但只有函数对象才有 prototype 属性；
    每个函数对象都有一个 prototype 属性，这个属性指向函数的原型对象；

    function Person(){}
    Person.prototype.name = '张三';
    var person1 = new Person();
    person1.__proto__ = Person.prototype;

    在默认的情况下，所有的原型对象都会自动获取一个 constructor (构造函数)属性，这个属性(是一个指针)指向 prototype 属性所在的函数(Person);
    Person.prototype.constructor = Person;

    实例的构造函数属性(constructor)指向构造函数
    var person1 = new Person();
    person1.constructor = Person;
    person1 是构造函数 Person 的实例，它的 constructor 属性指向了 Person 构造函数。

    var A = new Person();
    Person.prototype = A;
    注：上面的两行代码只是帮助理解，并不能正常执行

    Person.prototype 也是 Person 构造函数的实例，所以 Person.prototype 也有 constructor 属性；
    结论：原型对象 (Person.prototype) 是构造函数 (Person) 的一个实例。

    所有的函数对象的 __proto__ 都指向 Function.prototype，它是一个空函数(Empty function)，甚至包括根构造器 Object 和 Function 自身。
    函数对象包括: Number, Boolean, String, Object, Date, Array, Function, RegExp, Error等，例如:
    Number.__proto__ === Function.prototype;
    Number.constructor === Function;

    还包含自定义的函数对象
    function Person(){}
    var func = function(){}
    Person.__proto__ === Function.prototype;
    func.__proto__ === Function.prototype;

    这说明来什么: 所有的构造器都来自于 Function.prototype，甚至包括根构造器 Object 和 Function 自身。所有构造器都继承了 Function.prototype 的属性和方法。如: length, call, apply, bind等。
    
    Function.prototype 是唯一一个 typeof 为 function 的 prototype。其他的构造器的 prototype 都是一个对象。
    typeof Function.prototype === 'function';
    typeof Object.prototype === 'object';
    ...

    所有的构造器(含内置和自定义)的 __proto__ 都是 Function.prototype，那 Function.prototype 的 __proto__ 是谁呢?
    Function.prototype.__proto__ === Object.prototype;
    说明所有的构造器也是一个普通的JS对象，可以给构造器添加/删除属性等。同时它也继承了 Object.prototype 上的所有方法: toString, valueOf, hasOwnproperty等。

    最后 Object.prototype 的 __proto__ 是谁呢?
    Object.prototype.__proto__ === null;
    已经到顶了

    原型链:
        function Person(){}
        var person1 = new Person();
        person1.__proto__ === Person.prototype;
        Person.prototype.__proto__ === Object.prototype;
        Object.prototype.__proto__ === null;

    原型和原型链是JS实现继承的一种模型。
    原型链的形成是靠 __proto__ 而非 prototype;
    实例和原型对象之间存在一个连接，不过要明确的一点是，这个连接存在于 实例(person1) 和 构造函数的原型对象(Person.prototype) 之间，不存在于 实例(person1) 和 构造函数(Person) 之间。

### 3. 执行上下文
    - 一个函数可以访问在它的调用上下文中定义的变量，这个就是词法作用域(Lexical scope).
    - 当执行一个函数的时候，就会创建一个执行上下文，并且压入执行上下文栈，当函数执行完毕的时候，就会将函数的执行上下文从栈中弹出。
    - 闭包: 无论何时声明新函数并将其赋值给变量，都要存储函数定义和闭包，闭包包含在函数创建时作用域中的所有变量，它类似于背包。
    - 当一个函数被创建并传递或从另一个函数返回时，它会携带一个背包，背包中是函数声明时作用域内的所有变量。
    - 闭包是指有权访问另一个函数作用域中的变量的函数
    - 当函数可以记住并访问所在的词法作用域时，就产生了闭包，即使函数是在当前词法作用域之外执行。

### 4. this
    - this 的指向，是在函数被调用的时候确定的。也就是执行上下文被创建的时候确定的。
    - 在一个函数上下文中，this 由调用者提供，由调用函数的方式来决定。如果调用者函数被某一个对象所拥有，那么该函数在调用时，内部的 this 指向该对象。如果函数独立调用，那么该函数内部的 this，则指向 undefined。但是在非严格模式中，当 this 指向 undefined 时，它会被自动指向全局对象。
    - 箭头函数本身是没有this和arguments的，在箭头函数中引用this实际上是调用的是定义时的上一层作用域的this。这里强调的是上一层作用域，是因为对象是不能形成独立的作用域的。

### 5. 从输入 URL 到页面加载完成，发生了什么？
    首先需要通过 DNS(域名解析系统) 将 URL 解析为对应的 IP 地址，然后与这个 IP 地址确定的那台服务器建立起 TCP 网络连接，随后向服务器抛出 HTTP 请求，服务器处理完请求之后，把目标数据放在 HTTP 响应里返回给客户端，拿到响应数据的浏览器就可以开始走渲染流程。渲染完毕之后页面便呈现给了用户。
    过程片段:
        1. DNS 解析
        2. TCP 连接
        3. HTTP 请求抛出
        4. 服务器处理请求，HTTP 响应返回
        5. 浏览器拿到响应数据，解析响应内容，把解析的结果展示给用户

### 6. 各个阶段的原理和优化方案(接上一题)?
    DNS 域名解析:
    浏览器的地址栏中输入的地址并不是资源所在的真实位置，域名与 IP 地址之间有一个映射关系。域名解析的过程实际上就是将域名还原为 IP 地址的过程。
    DNS 域名解析花时间，可以使用 浏览器DNS缓存 和 DNS prefetch 来尽量减少解析次数和把解析前置的方法来优化。

    TCP 连接:
    主要是通过三次握手的方式来进行连接。
    第一次握手: 建立连接时，客户端发送 syn 包(syn=j) 到服务器，并进入 SYN_SENT 状态，等待服务器确认；
    第二次握手: 服务器收到 syn 包，必须确认客户的SYN (ack=j+1)，同时自己也发送一个 SYN 包(syn=k)，即 SYN+ACK 包，此时服务器进入 SYN_RECV 状态，这个状态被称为半连接状态；
    第三次握手: 客户端收到服务器的 SYN+ACK 包，向服务器发送确认包 ACK(ack=k+1)，此包发送完毕，客户端和服务器进入 ESTABLISHED(TCP连接成功) 状态，完成三次握手；

    优化方案: 长连接，预连接，接入 APDY 协议。

    HTTP 请求:
    优化方案: 减少请求次数和请求体积。另外，服务器越远，一次请求越慢，那部署的时候把静态资源放在离我们更近的 CDN 上会更快一点。

    页面渲染:
    渲染过程中会发生重绘和重排。
    - Reflow，也称为Layout，中文叫回流，一般意味着元素的内容，结构，位置或尺寸发生了变化，需要重新计算样式和渲染树，这个过程称为Reflow。
    - Repaint，中文重绘，意味着元素发生的改变只是影响了元素的一些外观之类的时候(例如: 背景色，边框颜色，文字颜色等)，此时只需要应用新样式绘制这个元素就OK了。这个过程称为Repaint。

    回流比重绘的成本高得多，DOM树里的每个节点都会有 reflow 方法，一个节点的 reflow 很有可能导致子节点，甚至父节点以及同级节点的reflow。

    成本比较高的操作:
        - 增加，删除，修改DOM节点时，会导致 Reflow 或 Repaint;
        - 移动 DOM 的位置，或是搞个动画的时候;
        - 内容发生变化;
        - 修改 CSS 样式的时候;
        - Resize 窗口的时候，或是滚动的时候;
        - 修改网页的默认字体时;

    浏览器的性能优化: 涉及到资源加载优化，服务端渲染，浏览器缓存机制的利用，DOM 树的构建，网页的排版和渲染过程，回流和重绘的考量，DOM 操作的合理规避等。

### 7. require 和 import 的区别
    - require 是 AMD 规范的引入方式
    - import 是 es6 的一个语法标准，如果要兼容浏览器的话必须转换为 es5 的语法

    - require 是运行时调用，所以 require 理论上可以允许在代码的任何地方调用
    - import 是编译时调用，所以必须放在文件的开头

    - require 是赋值的过程，其实 require 的结果就是对象，数字，字符串，函数等，再把 require 的结果赋值给某个变量
    - import 是结构的过程，但是目前所有的引擎都还没有实现 import，需要将 es6 转码为 es5 再执行，import 语法会被转换为 require

### 8. fetch 和 axios 和 ajax 的区别
    ajax是基于原生的XHR开发的，XHR本身的架构不清晰，已经有了fetch的替代方案。
    ajax技术实现了网页的局部数据刷新，axios实现了对ajax的封装。

    fetch 是一个底层的 api，浏览器原生支持，axios是一个封装好的框架。
    axios:
        - 支持浏览器和 nodejs 发请求，前后端发请求
        - 支持 promise 语法
        - 支持自动解析 json
        - 支持中断请求
        - 支持拦截请求
        - 支持请求进度监测
        - 支持客户端防止 CSRF

    fetch:
        优点:
            - 浏览器级别原生支持的 api
            - 原生支持 promise api
            - 语法简洁，符合 es 标准规范
        缺点:
            - 不支持文件上传进度监测
            - 使用不完美，需要封装
            - 不支持请求终止
            - 默认不带 cookie

### 9. JSONP 的原理是什么？
    尽管浏览器有同源策略，但是 <script> 标签的 src 属性不会被同源策略所约束，可以获取任意服务器上的脚本并执行。jsonp 通过插入 script 标签的方式来实现跨域，参数只能通过 url 传入，仅能支持 get 请求。
    步骤:
        1. 创建 callback 方法
        2. 插入 script 标签
        3. 后台接受到请求，解析前端传过去的 callback 方法，返回该方法的调用，并且数据作为参数传入该方法
        4. 前端执行服务端返回的方法调用

### 10. promise与async和await的区别
    async/await是写异步代码的新方式，以前的方法有回调函数和Promise。
    async/await是基于Promise实现的，它不能用于普通的回调函数。
    async/await与Promise一样，是非阻塞的。
    async/await使得异步代码看起来像同步代码，这正是它的魔力所在。

    区别:
        1. 函数前面多了一个aync关键字。await关键字只能用在aync定义的函数内。async函数会隐式地返回一个promise，该promise的reosolve值就是函数return的值。
        2. 使用async函数可以让代码简洁很多，不需要像Promise一样需要些then，不需要写匿名函数处理Promise的resolve值，也不需要定义多余的data变量，还避免了嵌套代码。
        3. async/await能够使得代码调试更简单。
    
    调试 Promise 很麻烦的理由:
        1. 不能在返回表达式的箭头函数中设置断点
        2. 如果你在.then代码块中设置断点，使用Step Over快捷键，调试器不会跳到下一个.then，因为它只会跳过异步代码。
    
    使用await/async时，你不再需要那么多箭头函数，这样你就可以像调试同步代码一样跳过await语句。

### 11. 插入大量DOM元素的方法(性能优化)
    比如插入一千条DOM节点到页面中，一般会使用循环。但是，由于渲染回流，在for循环内部多次 appendChild 会造成多次渲染，从而出现卡顿，闪屏的现象。
    在 javascript 中通常使用 appendChild()方法来操作 DOM 元素。
    每次调用该方法时，浏览器都会重新渲染页面。如果大量的更新DOM节点，则会非常消耗性能，影响用户体验。
    javascript 提供了一个文档碎片 DocumentFragment 的机制。
    如果将文档中的节点添加到文档片段中，就会从文档树中移除该节点。
    把所有要构造的节点都放在文档片段中执行，这样可以不影响文档树，也就不会造成页面渲染。
    当节点都构造完成后，再将文档片段对象添加到页面中，这时所有的节点都会一次性渲染出来。
    这样就能减少浏览器负担，提高页面渲染速度。

    ```
    <ul id="root"></ul>
    <script>
        var root = document.getElementById(root);
        var fragment = document.createDocumentFragment();
        for(let i = 0; i < 1000; i++){
            let li = document.createElement('li');
            li.innerHTML = '我是li标签';
            fragment.appendChild(li);
        }
        root.appendChild(fragment);
    </script>
    ```

### 12. 24小时弹出一次广告
    ```
    function setcookie(){
        let d = new Date();
        d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
        document.cookie = 'ad=popup-ad;expires=' + d.toGMTString();
        let result = document.cookie;
        return result;
    }

    if(!document.cookie.includes('ad=')){
        $('.ad').show();
        setcookie();
    }else{
        $('.ad').hide();
    }

    ```
