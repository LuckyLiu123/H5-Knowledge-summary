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




























