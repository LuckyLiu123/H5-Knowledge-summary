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

    ```js script
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
    ```javascript
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

### 13. JS垃圾收集
    标记清除:
        JavaScript中最常用的垃圾收集方式是标记清除。当变量进入环境(例如: 在函数中声明一个变量)时，就将这个变量标记为"进入环境
        "。逻辑上讲，永远不能释放进入环境的变量所占用的内存，因为只要执行流进入响应的环境，就可能会用到它们。而当变量离开环境时，
        则讲其标记为"离开环境"。
        垃圾收集器在运行的时候会给存储在内存中的所有变量都加上标记(可以使用任何方式来标记变量)。然后，它会去掉环境中的变量以及被环
        境中的变量引用的变量的标记。而在此之后再被加上标记的变量将被视为准备删除的变量，原因是环境中的变量已经无法访问到这些变量
        了。最后，垃圾收集器完成内存清除工作，销毁那些带有标记的值并回收它们所占用的内存空间。

    引用计数：
        另一种不太常用的垃圾收集策略叫做引用计数。引用计数的含义就是跟踪记录每个值被引用的次数。当声明了一个变量并将一个引用类型的
        值赋给该变量时，则这个值的引用次数就是1。如果同一个值又被赋给另一个变量，则该值的引用次数加1。相反，如果包含对这个值引用的
        变量又获得了另一个值，则这个值的引用次数减1。当这个值的引用次数变成0时，则说明没有办法再访问这个值了，因而就可以将其占用的
        内存空间回收回来。这样，当垃圾收集器下次再运行的时候，它就会释放那些引用次数为零的值所占用的内存。

        问题: 循环引用。循环引用是指对象 A 中包含一个指向对象 B 的指针，而对象 B 中也包含一个指向对象 A 的引用。
        解决办法: 手动的将变量设置为 null，切断变量与它此前引用的值之间的连接。

### 14. JavaScript中变量的类型
    JavaScript 中的变量包含两种不同的数据类型的值: 基本类型值和引用类型值。
    5中基本数据类型: Undefined, Null, Boolean, Number, String;
    引用类型: Object;

    ES6 引入了一种新的原始数据类型Symbol，表示独一无二的值，它是 JavaScript 语言的第七种数据类型。
    ES5 的对象属性名都是字符串，这容易造成属性名的冲突。比如，你使用了一个他人提供的对象，但又想为这个对象添加新的方法（mixin 模
    式），新方法的名字就有可能与现有方法产生冲突。
    Symbol 值通过Symbol函数生成。这就是说，对象的属性名现在可以有两种类型，一种是原来就有的字符串，另一种就是新增的 Symbol 类型。
    Symbol函数前不能使用new命令，否则会报错。这是因为生成的 Symbol 是一个原始类型的值，不是对象。也就是说，由于 Symbol 值不是
    对象，所以不能添加属性。基本上，它是一种类似于字符串的数据类型。

    - 基本类型值在内存中占据固定大小的空间，因此被保存在栈内存中；
    - 引用类型的值是对象，保存在堆内存中；
    - JavaScript 不允许直接访问内存中的位置，也就是说不能直接操作对象的内存空间。在操作对象时，实际上是在操作对象的引用而不是实
    际的对象，引用类型的值是按引用访问的；
    - 包含引用类型值的变量实际上包含的并不是对象本身，而是一个指向该对象的指针；
    - 从一个变量向另一个变量复制引用类型的值，复制的其实是指针，因此两个变量最终都指向同一个对象；
    - 确定一个值是哪几种基本类型可以使用 typeof 操作符，而确定一个值是哪种引用类型可以使用 instanceof 操作符；

### 15. JS中判断变量的类型的方法
    typeof: 返回一个字符串，表示未经计算的操作符的类型
        ```js script
            typeof 333      //number
            typeof true     //boolean
            typeof 'aaa'    //string
            typeof []       //array
            typeof function(){}    //function
            typeof {}       //object
            typeof undefined   //undefined
            typeof null     //object
        ```

    instanceof: 
        用于检测构造函数的prototype属性是否出现在某个实例对象的原型链上。如果变量是给定引用类型的实例，那么instanceof操作符始
        终会返回true。只有引用数据类型(Array, Function, Object)能被精准判断，其他(Number, Boolean, String)字面值不能被
        instanceof精准判断。
        如果表达式 obj instanof Foo 返回true，则并不意味着该表达式会永远返回true，因为Foo.prototype属性的值有可能会改变，
        改变之后的值很有可能不存在于obj的原型链之上。另一种情况下，原表达式的值也会改变，就是改变对象obj的原型链的情况，可以借助
        __proto__属性来实现: obj.__proto__ = {}，之后 obj instanceof Foo就会返回false。

    constructor:
        ```js script
            function a(){}
            var b = new a();
            b.constructor = a;    //true
        ```
        当创建变量b时，js会在b的原型上添加 constructor 属性，指向b的引用。
        注意： null 和 undefined 是无效的，因此没有 constructor 属性。重写对象的 prototype 之后，原有的 constructor 引
        用会丢失，造成判断不准确的问题。

    Object.prototype.toString:
        toString()方法返回一个表示该对象的字符串。可以通过toString()方法来获取每个对象的类型。为了每个对象都能通过 Object.
        prototype.toString() 来检测，需要以 Function.prototype.call() 或 Function.prototype.apply() 的形式来调用，
        传递要检查的对象作为第一个参数。
        ```js script
            var toString = Object.prototype.toString;
            toString.call(333);         //[object Number]
            toString.call('aaa');       //[object String]
            toString.call(true);        //[object Boolean]
            toString.call([]);          //[object Array]
            toString.call(function(){})    //[object Function]
            toString.call({});          //[object Object]
            toString.call(undefined);   //[object Undefined]
            toString.call(null);        //[object Null]

            //内置对象
            toString.call(new Date);    //[object Date]
            toString.call(new String);  //[object String]
            toString.call(Math);        //[object Math]
        ```
        


### 16. 数组 Array 中常用的方法
    - pop(): 从数组的末尾移除最后一项，减少数组的length值，然后返回移除的项。
    - push(): 接收任意数量的参数，把它们逐个添加到数组的末尾，并返回修改后数组的长度。
    - shift(): 移除数组中的第一个项并返回该项，同时将数组长度减1。
    - unshift(): 在数组前端添加任意个项并返回新数组的长度。
    - reverse(): 反转数组的顺序。
    - sort(): 对数组项进行排序。为了实现排序，该方法会调用每个数组项的 toString() 转型方法，然后比较得到的字符串，以确定如何排
    序。即时数组中的每一项都是数值，该方法比较的也是字符串。
    - splice(): 可删除从 index 处开始的零个或多个元素，并且用参数列表中声明的一个或多个值来替换那些被删除的元素。返回值是所有删
    除的元素组成的数组，如果没有删除任何元素，将会得到一个空数组。
    - slice(): 基于当前数组中的一个或多个项创建一个新数组。返回从指定位置开始到结束位置的所有项。该方法不会影响原始数组。
    - concat(): 用于连接两个或多个数组，仅会返回被连接数组的一个副本。
    - join(): 接收一个参数作为分隔符的字符串，然后返回包含所有数组项的字符串。
    - toString(): 返回由数组中的每个值的字符串形式拼接而成的一个以逗号分隔的字符串。
    - valueOf(): 返回一个数组。
    - indexOf() / lastIndexOf(): 返回查找原数组的索引，不会改变原数组。
    - every(): 对数组中的每一项运行给定的函数，如果该函数对每一项都返回true，则返回true。
    - some(): 对数组中的每一项运行给定的函数，如果该函数对任一项返回true，则返回true。
    - filter(): 对数组中的每一项运行给定的函数，返回该函数会返回true的项组成的数组。
    - forEach(): 对数组中的每一项运行给定的函数。这个方法没有返回值。
    - map(): 对数组中的每一项运行给定的函数，返回每次函数调用的结果组成的数组。
    - reduce(): 从数组的第一项开始，逐个遍历数组的所有项，接收一个函数作为累加器，数组中的每个值开始缩减，最终计算为一个值。
    - reduceRight(): 从最后一项开始向前遍历数组的所有项(同上)。

    改变原数组的方法: pop(), push(), shift(), unshift(), sort(), reverse(), splice().
    不会改变原数组的方法: concat(), join(), slice(), toString(), indexOf(), lastIndexOf(), reduce(), reduceRight(), filter(), forEach(), map(), every(), some().

### 17. 什么是 Promise
    Promise 是异步编程的一种解决方案：从语法上讲，promise是一个对象，从它可以获取异步操作的消息；从本意上讲，它是承诺，承诺它过
    一段时间会给你一个结果。promise有三种状态： pending(等待态)，fulfiled(成功态)，rejected(失败态)；状态一旦改变，就不会再
    变。创造promise实例后，它会立即执行。

    promise是用来解决两个问题的：
        - 回调地狱，代码难以维护， 常常第一个的函数的输出是第二个函数的输入这种现象
        - promise可以支持多个并发的请求，获取并发请求中的数据
        - 这个promise可以解决异步的问题，本身不能说promise是异步的

    Promise是一个构造函数，自己身上有all、reject、resolve这几个方法，原型上有then、catch等方法。
    Promise的构造函数接收一个参数：函数，并且这个函数需要传入两个参数：
        - resolve ：异步操作执行成功后的回调函数
        - reject：异步操作执行失败后的回调函数

    catch的用法:
        它和 then 的第二个参数一样，用来指定reject的回调。不过它还有另外一个作用：在执行resolve的回调（也就是then中的第一个参
        数）时，如果抛出异常了（代码出错了），那么并不会报错卡死js，而是会进到这个catch方法中。请看下面的代码：
        ```js script
            p.then((data) => {
                console.log('resolved', data);
                console.log(somedata); //此处的somedata未定义
            })
            .catch((err) => {
                console.log('rejected', err);
            });
        ```
        代码进到catch方法里面去了，而且把错误原因传到了err参数中。即便是有错误的代码也不会报错了，这与 try/catch 语句有相同的功能
    
    all的用法:
        谁跑的慢，以谁为准执行回调。all接收一个数组参数，里面的值最终都算返回Promise对象。Promise的all方法提供了并行执行异步操
        作的能力，并且在所有异步操作执行完后才执行回调。
        ```js script
            let Promise1 = new Promise(function(resolve, reject){})
            let Promise2 = new Promise(function(resolve, reject){})
            let Promise3 = new Promise(function(resolve, reject){})
            
            let p = Promise.all([Promise1, Promise2, Promise3])
            
            p.then(funciton(){
                // 三个都成功则成功  
            }, function(){
                // 只要有失败，则失败 
            })
        ```
        有一个场景是很适合用这个: 一些游戏类的素材比较多的应用，打开网页时，预先加载需要用到的各种资源如图片、flash以及各种静态文
        件。所有的都加载完后，我们再进行页面的初始化。

    race的用法:
        谁跑的快，以谁为准执行回调。

        race的使用场景:
            比如我们可以用race给某个异步请求设置超时时间，并且在超时后执行相应的操作
        ```javascript
            //请求某个图片资源
            function requestImg(){
                var p = new Promise((resolve, reject) => {
                    var img = new Image();
                    img.onload = function(){
                        resolve(img);
                    }
                    img.src = '图片的路径';
                });
                return p;
            }

            //延时函数，用于给请求计时
            function timeout(){
                var p = new Promise((resolve, reject) => {
                    setTimeout(() => {
                        reject('图片请求超时');
                    }, 5000);
                });
                return p;
            }

            Promise.race([requestImg(), timeout()]).then((data) =>{
                console.log(data);
            }).catch((err) => {
                console.log(err);
            });
        ```

### 18. 事件委托
    利用事件冒泡的特性，只指定一个事件处理程序，就可以管理某一类型的所有事件。比如将本应该注册在子元素上的处理事件注册在父元素上，
    这样点击子元素时发现其本身没有相应事件就到父元素上寻找作出相应。
    优势:
        - 减少DOM操作，提高性能。
        - 随时可以添加子元素，添加的子元素会自动有相应的处理事件。

    <ul id="ul1">
        <li id="aaa">111</li>
        <li id="bbb">222</li>
        <li id="ccc">333</li>
        <li id="ddd">444</li>
    </ul>
    ```js script
        var $ul = document.getElementById('ul1');
        $ul.onClick = function(e){
            var e = e || window.event;
            var target = e.target || e.srcElement;
            if(target.nodeName.toLowerCase() === 'li'){
                console.log(target.id);
            }
        }
    ```

### 19. 加密和解密
    加密算法分 对称加密 和 非对称加密，其中对称加密算法的加密与解密 密钥相同，非对称加密算法的加密密钥与解密 密钥不同，此外，还有
    一类 不需要密钥 的 散列算法。

    常见的 对称加密 算法主要有 DES、3DES、AES 等，常见的 非对称算法 主要有 RSA、DSA 等，散列算法 主要有 SHA-1、MD5 等。

    对称加密算法: 又称为 共享密钥加密算法。在 对称加密算法 中，使用的密钥只有一个，发送 和 接收 双方都使用这个密钥对数据进行 加
    密 和 解密。这就要求加密和解密方事先都必须知道加密的密钥。

    非对称加密算法: 又称为 公开密钥加密算法。它需要两个密钥，一个称为 公开密钥 (public key)，即 公钥，另一个称为 私有密钥 
    (private key)，即 私钥。因为 加密 和 解密 使用的是两个不同的密钥，所以这种算法称为 非对称加密算法。

    常见的签名加密算法:
        - MD5算法: MD5 用的是 哈希函数，它的典型应用是对一段信息产生 信息摘要，以 防止被篡改。严格来说，MD5 不是一种 加密算法
        而是 摘要算法。无论是多长的输入，MD5 都会输出长度为 128bits 的一个串。

        - SHA1算法: SHA1 是和 MD5 一样流行的 消息摘要算法，然而 SHA1 比 MD5 的 安全性更强。对于长度小于 2 ^ 64 位的消息，
        SHA1 会产生一个 160 位的 消息摘要。基于 MD5、SHA1 的信息摘要特性以及 不可逆 (一般而言)，可以被应用在检查 文件完整性
        以及 数字签名 等场景。

        - HMAC算法: HMAC 是密钥相关的 哈希运算消息认证码（Hash-based Message Authentication Code），HMAC 运算利用 哈希
        算法 (MD5、SHA1 等)，以 一个密钥 和 一个消息 为输入，生成一个 消息摘要 作为 输出。HMAC 发送方 和 接收方 都有的 key
        进行计算，而没有这把 key 的第三方，则是 无法计算 出正确的 散列值的，这样就可以 防止数据被篡改。

        - DES算法: DES 加密算法是一种 分组密码，以 64 位为 分组对数据 加密，它的 密钥长度 是 56 位，加密解密 用 同一算法。
        DES 加密算法是对 密钥 进行保密，而 公开算法，包括加密和解密算法。这样，只有掌握了和发送方 相同密钥 的人才能解读由 DES加
        密算法加密的密文数据。因此，破译 DES 加密算法实际上就是 搜索密钥的编码。对于 56 位长度的 密钥 来说，如果用 穷举法 来进
        行搜索的话，其运算次数为 2 ^ 56 次。

        - 3DES算法: 是基于 DES 的 对称算法，对 一块数据 用 三个不同的密钥 进行 三次加密，强度更高。

        - AES算法: AES 加密算法是密码学中的 高级加密标准，该加密算法采用 对称分组密码体制，密钥长度的最少支持为 128 位、 192
        位、256 位，分组长度 128 位。AES 本身就是为了取代 DES 的，AES 具有更好的 安全性、效率 和 灵活性。

        - RSA算法: RSA 加密算法是目前最有影响力的 公钥加密算法，并且被普遍认为是目前 最优秀的公钥方案 之一。RSA 是第一个能同时
        用于 加密 和 数字签名 的算法，它能够 抵抗 到目前为止已知的 所有密码攻击，已被 ISO 推荐为公钥数据加密标准。RSA 加密算法
        基于一个十分简单的数论事实：将两个大 素数 相乘十分容易，但想要对其乘积进行 因式分解 却极其困难，因此可以将 乘积 公开作为
        加密密钥。

        - ECC算法: ECC 也是一种 非对称加密算法，主要优势是在某些情况下，它比其他的方法使用 更小的密钥，比如 RSA 加密算法，提
        供 相当的或更高等级 的安全级别。不过一个缺点是 加密和解密操作 的实现比其他机制 时间长 (相比 RSA 算法，该算法对 CPU 消耗
        严重)。

    对称算法与非对称加密算法的比较:
        对称算法: 密钥管理比较难，不适合互联网，一般用于内部系统；安全性中等；加密速度快好几个数量级，适合大数据量的加解密处理。
        非对称算法: 密钥容易管理；安全性高；加密速度比较慢，适合 小数据量 加解密或数据签名。

### 20. HTTPS
    HTTP 协议中没有加密机制，但可以通过和SSL(安全套接层)或TLS(安全传输层协议)的组合使用，加密HTTP的通信内容。用SSL建立安全通信
    线路之后，就可以在这条线路上进行HTTP通信了。与SSL组合使用的HTTP被称为HTTPS(超文本传输安全协议)。
    SSL不仅提供加密处理，而且还使用了一种被称为证书的手段，可用于确定通信方。证书由值得信任的第三方机构颁发，用以证明服务器和客户
    端是实际存在的。另外，伪造证书从技术角度来说是异常困难的一件事。所以只要能够确认通信方(服务器或客户端)持有的证书，即可判断通信
    方的真实意图。
    HTTP加上加密处理和认证以及完整性保护后就是HTTPS。HTTPS并非是应用层的一种新协议，只是HTTP通信接口部分用 SSL 和 TLS 协议代
    替而已。通常，HTTP 直接和 TCP 通信。当使用 SSL 时，则演变成先和 SSL 通信，再由 SSL 和 TCP 通信了。简而言之，所谓HTTPS，
    其实就是身披 SSL 协议这层外壳的 HTTP。

### 21.状态吗
    2XX 成功: 2XX 的响应结果表明请求被正常处理了。
        - 200: OK。表示从客户端发来的请求在服务器端被正常处理了。
        - 204: 表示服务器接收的请求已成功处理，但在返回的响应报文中不含实体的主体部分(没有资源可返回)。
        - 206: 表示客户端进行了范围请求，而服务器成功执行了这部分的GET请求(对资源某一部分的请求)。响应报文中包含由Content-Range指定范围的实体内容。

    3XX 重定向: 3XX 响应结果表明浏览器需要执行某些特殊的处理以正确处理请求。
        - 301: 永久性重定向。表示请求的资源已被分配了新的URI，以后应使用资源现在所指的URI。
        - 302: 临时性重定向。表示请求的资源已被分配了新的URI，希望用户(本次)能使用新的URI访问。资源不是被永久移动，只是临时性质的。
        - 303: 表示由于请求对应的资源存在着另一个URI，应使用 GET 方法定向获取请求的资源。与302状态码功能相同，但303状态吗明确表示客户端应当采用 GET 方法获取资源。
        - 304: 表示客户端发送附带条件的请求时，服务器端允许请求访问资源，但因发生请求为满足条件的情况后，直接返回 304 (服务器端资源未改变，可直接使用客户端未过期的缓存)。

    4XX 客户端错误: 4XX 的响应结果表明客户端是发生错误的原因所在。
        - 400: 表示请求报文中存在语法错误。
        - 401: 表示发送的请求需要有通过HTTP认证(BASIC认证，DIGEST认证)的认证信息。另外若之前已进行过一次请求，则表示用户认证失败。
        - 403: 表示对请求资源的访问被服务器拒绝了。
        - 404: 表示服务器上无法找到请求的资源。

    5XX 服务器错误: 5XX 的响应结果表明服务器本身发生错误。
        - 500: 表示服务器端在执行请求时发生了错误。
        - 503: 表示服务器暂时处于超负载或正在进行停机维护。























































