const MD5 = require("../../components/miniprogram_npm/blueimp-md5/index");
function postRequest(text) {
  console.log(text)
  // 接口地址
  const url ="http://ltpapi.xfyun.cn/v1/ke"
  // 开放平台应用ID
  const x_appid = "1f622a94"
  // 开放平台应用接口秘钥
  const api_key = "76f6d3fdaf2dfc071912d609afbbf212"
  const x_text = JSON.stringify(text);
  const x_time = String(parseInt(new Date().getTime()/1000));
  const param = {"type":"dependent"};
  const x_param = base64_encode(JSON.stringify(param));
  const x_checksum = MD5(api_key + x_time + x_param);
  console.log(x_checksum)
  wx.showLoading({
    title: '提取中',
  })
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        'X-Appid': x_appid,
        'X-CurTime': x_time,
        'X-Param': x_param,
        'X-CheckSum': x_checksum
      },
      data:{
        text: x_text
      },
      success: (res) => {
        console.log(res);
        wx.hideLoading();
        resolve(res.data);
      },
      fail: (err) => {
        console.log(err);
        reject(err);
      }
    })
  });
}

function base64_encode(str) {
  var c1, c2, c3;
  var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var i = 0, len = str.length, string = '';

  while (i < len) {
    c1 = str.charCodeAt(i++) & 0xff;
    if (i == len) {
      string += base64EncodeChars.charAt(c1 >> 2);
      string += base64EncodeChars.charAt((c1 & 0x3) << 4);
      string += "==";
      break;
    }
    c2 = str.charCodeAt(i++);
    if (i == len) {
      string += base64EncodeChars.charAt(c1 >> 2);
      string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
      string += base64EncodeChars.charAt((c2 & 0xF) << 2);
      string += "=";
      break;
    }
    c3 = str.charCodeAt(i++);
    string += base64EncodeChars.charAt(c1 >> 2);
    string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
    string += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
    string += base64EncodeChars.charAt(c3 & 0x3F)
  }
  return string
}

function toUtf8(str) {
  var out, i, len, c;
  out = "";
  len = str.length;
  for(i = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if ((c >= 0x0001) && (c <= 0x007F)) {
      out += str.charAt(i);
    } else if (c > 0x07FF) {
      out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
      out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
    } else {
      out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
    }
  }
  return out;
}

module.exports.postRequest = postRequest;