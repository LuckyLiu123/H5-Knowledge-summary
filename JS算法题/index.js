
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