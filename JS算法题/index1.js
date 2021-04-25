// 1. JS找出数组中第二大的数字
// 设置两个变量a，b；数组在arr[]中，假设arr[0]最大，记为a；arr[1]第二大，记为b；若a小于b，则交换值。
// 遍历数组，若元素大于a，则a的值赋给b，最大值赋给a；若元素小于a，大于b，则元素赋值给b，遍历完毕，b为次大值，时间复杂度为O（n）
function findSecondNumber(){
    var arr = [2,4,14,20,8,3,15];
    var a = arr[0], b = arr[1];
    if(a < b){
        var temp = a;
        a = b;
        b = temp;
    }
    
    for(var i = 2; i < arr.length; i++){
        if(arr[i] > a){
            b = a;
            a = arr[i];
        }else if(arr[i] < a && arr[i] > b){
            b = arr[i];
        }
    }
    console.log('最大值:' + a + ' ;第二大:' + b);
}

/**
 * 2. 字符串翻转 方法一
 * 考虑32位有符号的整数，设置数值范围，超过则返回0
*/
const reverse1 = (x) => {
    if(typeof x !== 'number'){
        return;
    }
    const MAX = 2147483647;
    const MIN = -2147483648;

    //识别数字剩余部分并翻转
    const rest = x > 0 ? String(x).split('').reverse().join('') : String(x).slice(1).split('').reverse().join('');
    
    //转换位正常值，区分正负数
    const result = x > 0 ? parseInt(rest, 10) : 0 - parseInt(rest, 10);

    //边界情况
    if(result >= MIN && result <= MAX){
        return result;
    }
    return 0;
}

/**
 * 方法二
*/
const reverse2 = (x) => {
    let int = Math.abs(x);
    const MAX = 2147483647;
    const MIN = -2147483648;
    let num = 0;

    while(int !== 0){
        //借鉴欧几里得算法，从 num 的最后一位开始取值拼成新的数
        num = (int % 10) + (num * 10);
        //剔除掉被消费的部分
        int = Math.floor(int / 10);
    }

    if(num > MAX || num < MIN){
        return 0;
    }

    if(x < 0){
        return num * -1;
    }
    return num;
}

/**
 * 3. 有效的字母异位词
 * 给定两个字符串 s 和 t ，编写一个函数来判断 t 是否是 s 的字母异位词。
 * 思路: 首先，对字符串字母进行排序，然后，比较两字符串是否相等。
 * 方法一:
 * 时间复杂度为 O(nlogn)
*/
const isAnagram1 = (s, t) => {
    const sArr = s.split('');
    const tArr = t.split('');

    const sortFn = (a, b) => {
        return a.charCodeAt() - b.charCodeAt();
    }

    sArr.sort(sortFn);
    tArr.sort(sortFn);
    return sArr.join('') === tArr.join('');
}

//方法二
//思路: 声明一个对象记录字符串每个字母的个数，另外一个字符串每项与得到的对象做匹配，最后，根据计数判断是否相等。
//时间复杂度为 O(n)
const isAnagram2 = (s, t) => {
    if(s.length !== t.length){
        return false;
    }

    const hash = {};
    for(const k of s){
        hash[k] = hash[k] || 0;
        hash[k] += 1;
    }

    for(const k of t){
        if(!hash[k]){
            return false;
        }
        hash[k] -= 1;
    }
    return true;
}


/**
 * 4. 字符串转换整数
 * 方法一
*/
const myAtoi1 = function(str){
    //用正则提取需要的字符
    const result = str.trim().match(/^(-|\+)?\d+/g);
    return result ? Math.max(Math.min(Number(result[0]), Math.pow(2, 31) - 1) , -Math.pow(2, 31)) : 0;
}

//方法二
const myAtoi2 = function(str){
    const news = str.trim();
    if(parseInt(news)){
        return returnNum(parseInt(news));
    }else{
        return 0;
    }
}

const returnNum = function(num){
    if(num >= -Math.pow(2, 31) && num <= Math.pow(2, 31) - 1){
        return num;
    }else{
        return num > 0 ? Math.pow(2, 31) - 1 : -Math.pow(2, 31);
    }
}



















