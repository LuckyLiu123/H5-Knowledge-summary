## 1. 事件循环机制



## 2. 原型和原型链
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

## 3. 执行上下文
    - 一个函数可以访问在它的调用上下文中定义的变量，这个就是词法作用域(Lexical scope).
    - 当执行一个函数的时候，就会创建一个执行上下文，并且压入执行上下文栈，当函数执行完毕的时候，就会将函数的执行上下文从栈中弹出。
    - 闭包: 无论何时声明新函数并将其赋值给变量，都要存储函数定义和闭包，闭包包含在函数创建时作用域中的所有变量，它类似于背包。
    - 当一个函数被创建并传递或从另一个函数返回时，它会携带一个背包，背包中是函数声明时作用域内的所有变量。

## 4. this
    - this 的指向，是在函数被调用的时候确定的。也就是执行上下文被创建的时候确定的。
    - 在一个函数上下文中，this 由调用者提供，由调用函数的方式来决定。如果调用者函数被某一个对象所拥有，那么该函数在调用时，内部的 this 指向该对象。如果函数独立调用，那么该函数内部的 this，则指向 undefined。但是在非严格模式中，当 this 指向 undefined 时，它会被自动指向全局对象。