// 验证是否有中文汉字
function checkChinese(str) {
  let reg = new RegExp("[\u4E00-\u9FA5]+");
  return reg.test(str);
}
// 验证是否有ASCII字符
function checkASCII(str) {
  let reg = new RegExp("[\u0000-\u007F]+");
  return reg.test(str);
}
// 验证是否为空或全空格
function checkSpace(str) {
  return str.match(/^[ ]*$/);
}
// 根据平台不同的处理逻辑计算字数（标题）
function getTitleWordCount_redbook(platform, str) {
  if (platform == 'ios') {
    return getWordCount_redbook_ios(str);
  } else {
    return getWordCount_redbook_android(str);
  }
}
// 根据平台不同的处理逻辑计算字数（正文）
function getBodyWordCount_redbook(platform, str) {
  if (platform == 'ios') {
    return Array.from(str).length;
  } else {
    return str.length;
  }
}
/** 
 * 仿小红书 iOS 端的计算方式：
 * 汉字计数1
 * 其他 Unicode 字符计数0.5
 * */ 
function getWordCount_redbook_ios(str) {
  let count = 0;  // 存储字数
  for (let i = 0; i < str.length; i++) {
    if (checkChinese(str[i])) {
      count++;
    } else {
      count += 0.5;
    }
  }
  return Math.ceil(count);
}
/** 
 * 仿小红书 Android 端的计算方式：
 * ASCII 字符计数0.5
 * 其他 Unicode 计数1
 * */ 
function getWordCount_redbook_android(str) {
  let count = 0;  // 存储字数
  for (let i = 0; i < str.length; i++) {
    if (checkASCII(str[i])) {
      count += 0.5;
    } else {
      count++;
    }
  }
  return Math.ceil(count);
}
// 计算剩余字数
function calculateDifference(total, count) {
  return Math.floor(total - count);
}

module.exports.getTitleWordCount_redbook = getTitleWordCount_redbook;
module.exports.getBodyWordCount_redbook = getBodyWordCount_redbook;
module.exports.calculateDifference = calculateDifference;
module.exports.checkSpace = checkSpace;
