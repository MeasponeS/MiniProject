function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}


/**
 * 根据数组对象里面的key排序
 * @param key
 * @param desc   true 倒序
 * @returns {function(*, *): number}
 */
export function objSort(key,desc) {
    return function(a,b){
        //return desc ? ~~(parseInt(a[key]) < parseInt(b[key])) : ~~(parseInt(a[key]) > parseInt(b[key]));解决简单的json数组还行，但是遇到复杂重复比较多的数就不行了
        return desc ? ((parseInt(a[key]) < parseInt(b[key]))?1:((parseInt(a[key]) > parseInt(b[key]))?-1:0)):((parseInt(a[key]) < parseInt(b[key]))?-1:((parseInt(a[key]) > parseInt(b[key]))?1:0))  //杠杠的，注意括号就是！

    }
}

export function toChinesNum(num){
        num = Number(num);
        let upperCaseNumber = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '百', '千', '万', '亿'];
        let length = String(num).length;
        if (length == 1) {
            return upperCaseNumber[num];
        } else if (length == 2) {
            if (num == 10) {
                return upperCaseNumber[num];
            } else if (num > 10 && num < 20) {
                return '十' + upperCaseNumber[String(num).charAt(1)];
            } else {
                return upperCaseNumber[String(num).charAt(0)] + '十' + upperCaseNumber[String(num).charAt(1)].replace('零', '');
            }
        }
}
