// 验证是否有中文汉字
function checkChinese(str) {
  let reg = new RegExp("[\u4e00-\u9fa5]+");
  return reg.test(str);
}
// 验证是否有英文字母
function checkLetter(str) {
  let reg = new RegExp("[A-Za-z]+");
  return reg.test(str);
}
// 验证是否有数字
function checkNumber(str) {
  let reg = new RegExp("[0-9]+"); 
  return reg.test(str);
}
// 验证是否有英文标点符号（半角）
function checkHalfWidthPBX(str) {
  let reg = new RegExp("[~!@#$%^&*()_+|<>,.?/:;'\\[\\]{}\"]+");
  return reg.test(str);
}
// 验证是否有中文标点符号（全角）
function checkFullWidthPBX(str) {
  let reg = new RegExp("[。？！，、；：“”‘’（）《》〈〉【】『』「」﹃﹄〔〕…—～﹏￥+]");
  return reg.test(str);
}
// 计算文本的字数，无论是数字、符号、字母、汉字、emoji，计数均为1
function getWordCount(str) {
  let arr = Array.from(str);
  let s = 0; // 记录连字符 "200d" 的数量
  for(let i of arr) {
    console.log(i);
    let code = i.codePointAt();
    let hexcode = code.toString(16);
    if (hexcode == '200d') {
      s++;
    }
  }
  let count = arr.length - 2*s;
  return count;
}
/** 
 * 仿小红书 iOS 端的计算方式：
 * 汉字计数1
 * 标点符号、数字、字母计数0.5
 * emoji至少计数1
 * */ 
function getWordCount_redbook_ios(str) {
  let arr = Array.from(str);
  let count = 0;  // 存储字数
  let len = 0;    // 存储长度
  for(let i of arr) {
    len++; 
    let code = i.codePointAt();
    let hexcode = code.toString(16);
    if (checkLetter(i) || checkNumber(i) || checkHalfWidthPBX(i) || checkFullWidthPBX(i)) {
      count += 0.5;
    }else if (hexcode == '200d') {
      count -= 2;
    } else {
      count++;
    }
    while(count == 20) {
      return handleText(str, len, count);
    }
    while(count == 20.5) {
      return handleText(str, len-1, count);
    }
  }
  return handleText(str, len, count);
}
/** 
 * 仿小红书 Android 端的计算方式：
 * 汉字、全角标点符号计数1
 * 半角标点符号、数字、字母计数0.5
 * emoji至少计数1
 * */ 
function getWordCount_redbook_android(str) {
  let arr = Array.from(str);
  let count = 0;  
  for(let i of arr) { 
    let code = i.codePointAt();
    let hexcode = code.toString(16);
    if (checkLetter(i) || checkNumber(i) || checkHalfWidthPBX(i)) {
      count += 0.5;
    }else if (hexcode == '200d') {
      count -= 2;
    } else {
      count++;
    }
  }
  return count;
}
// 对键入的文本进行处理：超过20个字的文本进行截取（仿小红书）
function handleText(str, len, count) {
  let text = str.slice(0, len);
  return {text: text, count: count};
}
// 限制最大输入
function limitMaxlengthByText(text) {
  return text.length;
}
// 计算剩余字数
function calculateDifference(total, count) {
  return Math.floor(total - count);
}

module.exports.getWordCount_redbook_ios = getWordCount_redbook_ios;
module.exports.getWordCount_redbook_android = getWordCount_redbook_android;
module.exports.limitMaxlengthByText = limitMaxlengthByText;
module.exports.calculateDifference = calculateDifference;
