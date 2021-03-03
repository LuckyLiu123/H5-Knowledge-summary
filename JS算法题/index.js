
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
 * 4. 深拷贝
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