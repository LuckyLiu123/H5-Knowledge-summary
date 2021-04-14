
// 1. 实现一个 JSON.stringify()
function jsonStringify(obj){
    let type = typeof obj;
    if(type !== 'object' || type === null){
        if(/string|undefined|function/.test(type)){
            obj = '"' + obj + '"';
        }
        return String(obj);
    }else{
        let json = [];
        let arr = obj && obj.constructor === Array;
        for(let key in obj){
            let value = obj[key];
            let type = typeof value;
            if(/string|undefined|function/.test(type)){
                value = '"' + value + '"';
            }else if(type === 'object'){
                value = jsonStringify(value);
            }
            json.push((arr ? "" : '"' + key + '":') + String(value));
        }
        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
    }
}

/** 
 * 2. 浅拷贝 
 * 浅拷贝和深拷贝都是针对的引用类型：浅拷贝进行一层拷贝，深拷贝进行无限层拷贝
 * */
//针对对象类型的拷贝
function shallowClone(source){
    var target = {};
    for(let key in source){
        if(source.hasOwnProperty(key)){
            target[key] = source[key];
        }
    }
    return target;
}

//数组类型可以使用 slice，concat 返回一个新数组的特性来实现拷贝，但是克隆的并不彻底

var shallowCopy = function(obj){
    //只拷贝对象
    if(typeof obj !== 'object') return;
    //根据 obj 的类型判断是新建一个数组还是对象
    var newObj = obj instanceof Array ? [] : {};
    for(var key in obj){
        if(obj.hasOwnProperty(key)){
            newObj[key] = obj[key];
        }
    }
    return newObj;
}

/**
 * 3. 深拷贝
 * 深拷贝可以分为两个问题：浅拷贝 + 递归
*/
//最简单的深拷贝
function clone(source){
    var target = {};
    for(let key in source){
        if(source.hasOwnProperty(key)){
            if(typeof source[key] === 'object'){
                target[key] = clone(source[key]);
            }else{
                target[key] = source[key];
            }
        }
    }
    return target;
}

/**
 * 上面的代码不足之处:
 * 1. 没对参数做校验；
 * 2. 判断对象类型逻辑不够严谨；
 * 3. 没有考虑到数组的兼容性；
 * 4. 递归最大的问题在于爆栈，当数据的层数很深的时候就会栈溢出；
*/

//判断对象类型的方法
// function isObject(obj){
//     return Object.prototype.toString.call(obj) === '[object Object]';
// }

//判断对象类型并保留数组的写法
function isObject(obj){
    return typeof obj === 'object' && obj !== null;
}

/**
 * 最简单的深拷贝
 * 不仅适用于数组也适用于对象，但不能拷贝函数，而且不能解决循环引用的问题
*/
function cloneJSON(source){
    return JSON.parse(JSON.stringify(source));
}

//兼容数组的写法
var deepCopy = function(obj){
    if(!isObject(obj)) return;
    var newObj = obj instanceof Array ? [] : {};
    for(var key in obj){
        if(obj.hasOwnProperty(key)){
            newObj[key] = typeof obj[key] === 'object' ? deepCopy(obj[key]) : obj[key];
        }
    }
    return newObj;
}

/**
 * 使用哈希表解决 循环引用 的问题
 * 就是循环检测，设置一个数组或者哈希表存储已经拷贝过的对象，当检测到当前对象已经存在于哈希表中的时候，取出该值并返回即可。
 * 同时用此方法还解决了引用丢失的问题
*/
function cloneDeep(source, hash = new WeakMap()){
    if(!isObject(source)) return;
    if(hash.has(source)) hash.get(source);  //查哈希表

    var target = Array.isArray(source) ? [] : {};
    hash.set(source, target);    //哈希表设值

    for(var key in source){
        if(Object.prototype.hasOwnProperty.call(source, key)){
            if(isObject(source[key])){
                target[key] = cloneDeep(source[key], hash);
            }else{
                target[key] = source[key];
            }
        }
    }
    return target;
}

/**
 * 检测数组的方法 Array.isArray 和 instanceof 有什么区别?
 * - instanceof 假定了单一的全局执行环境，如果存在两个不同的全局执行环境，从而存在两个不同版本的 Array 构造函数。
 * - 例如 intanceof Array 在 iframes 中不起作用.
 * - Array.isArray 将是更可靠的解决方案。
*/

/**
 * hasOwnProperty()方法：检测一个属性是否是对象的自有属性，或对象自身属性中是否具有指定的属性
 * 写法: obj.hasOwnProperty(key)    Object.prototype.hasOwnProperty.call(obj, key)
*/



/**
 * 4. 如何让 (a == 1 && a == 2 && a == 3) 的值为true？
*/
//  == 操作符在左右数据类型不一致时，会先进行隐式转换。
//  a == 1 && a == 2 && a == 3 的值意味着其不可能是基本数据类型。
//  因此可以推测 a 是复杂数据类型，JS 中复杂数据类型只有 object
//方法一: 部署 [Symbol.toPrimitive]，valueOf / toString 皆可
    var a = {
        [Symbol.toPrimitive]: (function(hint){
            let i = 1;
            return function(){
                return i++;
            }
        })()
    }

//方法二: 利用数据劫持(Proxy/Object.defineProperty)
    let i = 1;
    let a = new Proxy({}, {
        i: 1,
        get: function(){
            return () => this.i++;
        }
    });

//方法三: 数组的 toString 接口默认调用数组的 join 方法，重写 join 方法
    let a = [1, 2, 3];
    a.join = a.shift;

/**
 * 5. promise.all中，其中一个promise出错，如何确保执行到最后
 * 使用 map 方法过滤每一个 promise 任务，其中任意一个 promise 报错，return 一个返回值
*/
    var p1 = new Promise((resolve, reject) => {
        resolve('p1');
    });
    var p2 = new Promise((resolve, reject) => {
        resolve('p2');
    });
    var p3 = new Promise((resolve, reject) => {
        reject('p3');
    });
    Promise.all([p1, p2, p3].map(p => p.catch(e => '出错后的返回值'))).then(value => {
        console.log('value=>>', value);
    }).catch(err => {
        console.log('err=>>', err);
    })

/**
 * 6. 实现两个数组的合并
*/
    var a = [1, 2, 3];
    var b = [4, 5, 6];
    //方法一:
    var c = a.concat(b);

    //方法二:
    for(let i in b){
        a.push(b[i]);
    }

    //方法三:
    a.push.apply(a, b);

    //方法四:
    var d = [...a, ...b];

/**
 * 7. 手写一个 Promise
*/
    class Promise{
        constructor(executor){
            this.state = 'pending';  //初始化 state 为等待状态
            this.value = undefined;  //成功的值
            this.reason = undefined;  //失败的原因
            this.onResolvedCallbacks = [];   //成功存放的数组
            this.onRejectedCallbacks = [];   //失败存放的数组

            let resolve = value => {
                if(this.state === 'pending'){
                    this.state = 'fulfilled';   //resolve 调用后，state 转换为成功态
                    this.value = value;   //存储成功的值
                    this.onResolvedCallbacks.forEach(fn => fn());  //一旦 resolve 执行，调用成功数组的函数
                }
            }
            
            let reject = reason => {
                if(this.state === 'pending'){
                    this.state = 'rejected';   //reject调用后，state转换为失败态
                    this.reason = reason;   //存储失败的原因
                    this.onRejectedCallbacks.forEach(fn => fn());  //一旦 reject 执行，调用失败数组的函数
                }
            }

            //如果 executor 执行报错，直接执行reject
            try{
                executor(resolve, reject);
            } catch (err){
                reject(err);
            }
        }

        then(onFulfilled, onRejected){
            // onFulfilled如果不是函数，就忽略onFulfilled，直接返回value
            onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
            // onRejected如果不是函数，就忽略onRejected，直接扔出错误
            onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err};

            //声明返回的 promise2
            let promise2 = new Promise((resolve, reject) => {
                //状态为 fulfilled，执行 onFulfilled，传入成功的值
                if(this.state === 'fulfilled'){
                    //异步
                    setTimeout(() => {
                        try{
                            let x = onFulfilled(this.value);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e){
                            reject(e);
                        }
                    }, 0)
                }
                //状态为 rejected，执行 onRejected，传入失败的原因
                if(this.state === 'rejected'){
                    //异步
                    setTimeout(() => {
                        try{
                            let x = onRejected(this.reason);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch(e){
                            reject(e);
                        }
                    }, 0)
                }
                //当状态为 pending 的时候
                if(this.state === 'pending'){
                    //onFulfilled 传入到成功的数组
                    this.onResolvedCallbacks.push(() => {
                        //异步
                        setTimeout(() => {
                            try{
                                let x = onFulfilled(this.value);
                                resolvePromise(promise2, x, resolve, reject);
                            } catch(e){
                                reject(e);
                            }
                        }, 0)
                    })
                    //onRejected 传入到失败的数组
                    this.onRejectedCallbacks.push(() => {
                        //异步
                        setTimeout(() => {
                            try{
                                let x = onRejected(this.reason);
                                resolvePromise(promise2, x, resolve, reject);
                            } catch(e){
                                reject(e);
                            }
                        }, 0)
                    })
                }
            })
            return promise2;
        }

        catch(fn){
            return this.then(null, fn);
        }
    }

    function resolvePromise(promise2, x, resolve, reject){
        //循环引用报错
        if(x === promise2){
            return reject(new TypeError('Chaining cycle detected for promise'));
        }
        let called;  //防止多次调用
        if(x != null && (typeof x === 'object' || typeof x === 'function')){
            try{
                // A+规定，声明then = x的then方法
                let then = x.then;
                // 如果then是函数，就默认是promise了
                if(typeof then === 'function'){
                    then.call((x, y) => {
                        // 成功和失败只能调用一个
                        if(called) return;
                        called = true;
                        // resolve的结果依旧是promise 那就继续解析
                        resolvePromise(promise2, y, resolve, reject);
                    }, err => {
                        // 成功和失败只能调用一个
                        if(called) return;
                        called = true;
                        reject(err);
                    })
                }else{
                    resolve(x);  // 直接成功即可
                }
            } catch (err){
                if(called) return;
                called = true;
                reject(err);
            }
        }else{
            resolve(x);
        }
    }

    //resolve 方法
    Promise.resolve = function(val){
        return new Promise((resolve, reject) => {
            resolve(val);
        })
    }

    //reject 方法
    Promise.reject = function(){
        return new Promise((resolve, reject) => {
            reject(val);
        })
    }

    //race 方法
    Promise.race = function(promises){
        return new Promise((resolve, reject) => {
            for(let i = 0; i < promises.length; i++){
                promises[i].then(resolve, reject);
            }
        })
    }

    //all方法(获取所有的promise，都执行then，把结果放到数组，一起返回)
    Promise.all = function(promises){
        let arr = [];
        let i = 0;
        function processData(index, data){
            arr[index] = data;
            i++;
            if(i == promises.length){
                resolve(arr);
            }
        }
        return new Promise((resolve, reject) => {
            for(let i = 0; i < promises.length; i++){
                promises[i].then(data => {
                    processData(i, data);
                }, reject);
            }
        })
    }

/**
 * 8. 实现一个继承
 * 
 * - 一般只建议写这种，因为其它方式的继承会在一次实例中调用两次父类的构造函数或有其它缺点。
 * - 核心实现是：用一个 F 空的构造函数去取代执行了 Parent 这个构造函数。
*/
function Parent(name){
    this.name = name;
}

Parent.prototype.sayName = function(){
    console.log('Parent name:', this.name);
}

function Child(name, parentName){
    Parent.call(this, parentName);
    this.name = name;
}

function create(proto){
    function F(){};
    F.prototype = proto;
    return new F();
}

Child.prototype = create(Parent.prototype);
Child.prototype.sayName = function(){
    console.log('Child name:', this.name);
}
Child.prototype.constructor = Child;

var parent = new Parent('father');
parent.sayName();

var child = new Child('son', 'father');


/**
 * 9. 实现一个JS函数柯里化
 * 
 * 柯里化: 在计算机科学中，柯里化（Currying）是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）
 *        的函数，并且返回接受余下的参数且返回结果的新函数的技术。
 * 
 * 函数柯里化的主要作用和特点就是参数复用、提前返回和延迟执行。
*/

function curry(fn, args){
    var length = fn.length;
    var args = args || [];
    return function(){
        var newArgs = args.concat(Array.prototype.slice.call(arguments));
        if(newArgs.length < length){
            return curry.call(this, fn, newArgs);
        }else{
            return fn.apply(this, newArgs);
        }
    }
}

function multiFn(a, b, c){
    return a * b * c;
}

var multi = curry(multiFn);

multi(2)(3)(4);
multi(2,3,4);
multi(2)(3,4);
multi(2,3)(4);

// ES6 的写法
const curry = (fn, arr = []) => (...args) => (
    arg => arg.length === fn.length
    ? fn(...arg)
    : curry(fn, arg)
)([...arr, ...args])

var curryTest = curry((a, b, c, d) => a + b + c + d);
curryTest(1,2,3)(4)   //返回10
curryTest(1,2)(4)(3)  //返回10
curryTest(1,2)(3,4)   //返回10


/**
 * 10. 实现一个call或 apply
*/
/**
 * call核心：
*      - 将函数设为对象的属性
*      - 执行&删除这个函数
*      - 指定this到函数并传入给定参数执行函数
*      - 如果不传入参数，默认指向为 window
*/
Function.prototype.call2 = function(content = window){
    content.fn = this;
    let args = [...arguments].slice(1);
    let result = content.fn(...args);
    delete content.fn;
    return result;
}

let foo = {
    value: 1
}

function bar(name){
    console.log(name);
    console.log(this.value);
}

bar.call2(foo, 'black');

// apply()的实现和call()类似，只是参数形式不同
Function.prototype.apply2 = function(context = window){
    context.fn = this;
    let result;
    // 判断是否有第二个参数
    if(arguments[1]){
        result = context.fn(...arguments[1]);
    }else{
        result = context.fn()
    }
    delete context.fn();
    return result;
}

/**
 * 11. 实现一个bind()方法
 * bind 方法会创建一个新函数，bind的第一个参数将作为新函数运行时的this，
 * 其余的参数将会在新函数后续被调用时位于其他实参前被传入。
 * 此外，bind()实现需要考虑实例化后对原型链的影响。
*/
Function.prototype.bind2 = function(content){
    if(typeof this != 'function'){
        throw Error('not a function');
    }
    // 若没问参数类型则从这开始写
    let fn = this;
    let args = [...arguments].slice(1);

    let resFn = function(){
        return fn.apply(this instanceof resFn ? this : content, args.concat(...arguments));
    }

    //新函数也能使用 new 操作符创建对象，构造器为原函数
    /**
     * 那么我们知道new fn()操作执行时，一个新的对象会被创建，并且该对象继承自fn.prototype，然后fn会被执行，
     * fn的this指向这个新对象（当然最后还有return的过程）。从new操作的顺序来看我们能通过 this instanceof fn 这段
     * 代码判断某次调用是否通过new调用，如果是通过new调用的，那么this就是fn的实例。直接调用函数时的this指向global。
    */
    function tmp(){};
    tmp.prototype = this.prototype;
    resFn.prototype = new tmp();

    return resFn;
}

/**
 * 12. 实现一个 new 操作符
 * 
 * new 操作符做的事情:
 *   - 它创建一个全新的对象
 *   - 它会被执行 [[prototype]] (也就是__proto__)连接
 *   - 它使 this 指向新创建的对象
 *   - 通过 new 创建的每个对象将最终被 [[prototype]] 链接到这个函数的 prototype 对象上
 *   - 如果函数没有返回对象类型 Object(包含 Function, Array, Date, RegExg, Error)，那么 new 表达式中的函数调用将返回该对象引用
*/
function New(func){
    var res = {};
    if(func.prototype !== null){
        res.__proto__ = func.prototype;
    }

    var ret = func.apply(res, Array.prototype.slice.call(arguments, 1));
    if((typeof ret === 'object' || typeof ret === 'function') && ret !== null){
        return ret;
    }
    return res;
}

/************************************ JS 继承的几种方式 ***********************************/
/**
 * 13. JS原型链继承
*/
    // Personal 对象想要继承 Main 对象，则通过将 Main 的实例赋值给 Personal 的原型对象 
    Personal.prototype = new Main();
    // 如此 Personal 原型对象就能通过 Main 对象的实例中的 [[Prototype]] 来访问到 Main 原型对象中的属性和方法了。而此时，
    // Personal 原型对象则与 Personal 函数断开了联系，因为 Personal 原型对象被重新赋值了，所以还需要重新将 Personal 函数
    // 和 Personal 原型对象建立联系:
    Personal.prototype.constructor = Personal;

    //完整代码如下:
    function Main(){

    }
    Main.prototype.sex = '男';
    Main.prototype.eat = function(){
        console.log('Main eat ...');
    }

    function Personal(){

    }

    //先继承
    Personal.prototype = new Main();
    Personal.prototype.constructor = Personal;

    //后定义属性和方法
    Personal.prototype.name = '张三';
    Personal.prototype.sayName = function(){
        console.log('Personal name');
    }

    var p = new Personal();
    console.log(p.sex);
    console.log(p.name);
    p.eat();
    p.sayName();

    // 如果先定义 Personal 的属性和方法就会发现 p.name 为 undefined，sayName()这个方法也没有找到。原因在于代码后面重新赋值了
    // Personal.prototype = new Main(); 因此找不到一开始定义在 Personal.prototype 上的 name 属性和 sayName()方法。因此
    // 在使用原型链继承的时候，要在继承之后再去原型对象上定义自己所需要的属性和方法。

    /**
     * 缺点:
     *  - 引用类型的值会被所有的实例共享。
     *  - 在创建子类型的实例时，不能向超类型的构造函数中传递参数。应该说没有办法在不影响所有对象实例的情况下，给超类型的构造函数传递参数
    */

/**
 * 14. 借用构造函数
 *   解决原型中包含引用类型值所带来的问题
 *   原理: 子类型构造函数的内部调用超类型构造函数, 通过call()方法或apply()方法
*/
function SuperType(){
    this.colors = ['red', 'blue', 'green'];
}

function SubType(){
    //继承了SuperType
    SuperType.call(this);
}

var instance1 = new SubType();

/**
 * 缺点: 如果仅仅是借用构造函数，那么也将无法避免构造函数模式存在的问题: 方法都在构造函数中定义，
 *      因此函数复用就无从谈起。而且，在超类型的原型中定义的方法，对子类型而言也是不可见的。
*/

/**
 * 15. 组合继承
 *    将原型链和借用构造函数的技术组合到一起
 *  思路: 使用原型链实现对原型属性和方法的继承，而通过借用构造函数来实现对实例属性的继承。
*/
function SuperType(name){
    this.name = name;
    this.colors = ['red', 'blue', 'green'];
}

SuperType.prototype.sayName = function(){

}

function SubType(name, age){
    SuperType.call(this, name);
    this.age = age;
}

SubType.prototype = new SuperType();
SubType.prototype.constructor = SubType;

SubType.prototype.sayAge = function(){

}

var instance2 = new SubType('zhangsan', 20);

/**
 * 组合继承避免了原型链和借用构造函数的缺陷，融合了它们的优点，是JavaScript中最常用的继承模式
 * 可以使用 instanceof 和 isPrototypeof() 能够识别基于组合继承创建的对象。
 * 
 * 缺点: 无论什么情况下，都会调用两次超类型的构造函数: 一次是在创建子类型原型的时候，另一次是在子类型构造函数内部。
*/

/**
 * 16. 原型式继承
 *   借助原型可以基于已有的对象创建新对象，同时还不必因此创建自定义类型。
 *   在 object() 函数内部，先创建一个临时性的构造函数，然后将传入的对象作为这个构造函数的原型，最后返回了这个临时类型的一个新实例。
*/
function object(o){
    function F(){}
    F.prototype = o;
    return new F();
}

//注: 包含引用类型值的属性始终都会共享相应的值，就像使用原型模式一样。

/**
 * 17. 寄生式继承
 *   寄生式继承是与原型式继承紧密相关的一种思路。寄生式继承的思路与寄生构造函数和工厂模式类似，即创建一个仅用于封装过程的函数，
 *   该函数在内部以某种方式来增强对象，最后再像真地是它做了所有工作一样返回对象。
*/
function createAnother(original){
    var clone = object(original);     //通过调用函数创建一个新对象
    clone.sayHi = function(){    //以某种方式来增强这个对象
        console.log('Hi');
    }
    return clone;
}

//前面示范继承模式时使用的 object() 函数不是必需的，任何能够返回新对象的函数都适用于此模式。

/**
 * 18. 寄生组合式继承
 *   借用构造函数来继承属性，通过原型链的混成形式来继承方法。
 *   思路: 使用寄生式继承来继承超类型的原型，然后再将结果指定给子类型的原型。
*/
function inheritPrototype(subType, superType){
    var prototype = object(superType.prototype);    //创建对象
    prototype.constructor = subType;     //增强对象
    subType.prototype = prototype;      //指定对象
}

function SuperType(name){
    this.name = name;
    this.colors = ['red', 'blue', 'green'];
}

SuperType.prototype.sayName = function(){
    console.log(this.name);
}

function SubType(name, age){
    SuperType.call(tihs, name);
    this.age = age;
}

inheritPrototype(SubType, SuperType);

SubType.prototype.sayAge = function(){
    console.log(this.age);
}


















































