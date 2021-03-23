
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

