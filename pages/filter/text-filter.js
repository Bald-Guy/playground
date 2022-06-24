async function filterTitle(that, title) {
  wx.showLoading({
    title: '过滤中',
  })
  let title_str = JSON.stringify(title);
  let title_str_length = Array.from(title_str).length;
  let result = await sendAuditRequest(title_str);
  console.log(result);
  if(result.conclusionType == 1) { // 状态为 1 说明：内容合规，没有敏感词; 否则内容不合规
    const html_title = handleGoodResult(title_str);
    setTitleEditorContents(that, html_title);
  }else {
    const wordPositions = handleBadResult(title_str, result.data);
    const sliceArray = createSliceArray(title_str_length, wordPositions);
    const html_title = createHtml(title_str, sliceArray);
    setTitleEditorContents(that, html_title);
    that.setData({ sensitiveWordCount_title: getSensitiveWordsCount(wordPositions) });
  }
  wx.hideLoading();
}

async function filterBody(that, body) {
  wx.showLoading({
    title: '过滤中',
  })
  let body_str = JSON.stringify(body);
  let body_str_length = Array.from(body_str).length;
  let result = await sendAuditRequest(body_str);
  console.log(result);
  if(result.conclusionType == 1) { // 状态为 1 说明：内容合规，没有敏感词; 否则内容不合规
    const html_body = handleGoodResult(body_str);
    setBodyEditorContents(that, html_body);
  }else {
    const wordPositions = handleBadResult(body_str, result.data);
    const sliceArray = createSliceArray(body_str_length, wordPositions);
    const html_body = createHtml(body_str, sliceArray);
    setBodyEditorContents(that, html_body);
    that.setData({ sensitiveWordCount_body: getSensitiveWordsCount(wordPositions) });
  }
  wx.hideLoading();
}


function getToken() {
  // 正式环境
  const client_id = 'VqO9F72490I3d2UtDcZypyWA';
  const client_secret = 'QF12p9jmszGvlhIfVeRyR2SCtmlTSXgZ';
  const url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${client_id}&client_secret=${client_secret}`;
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      method: 'GET',
      success: (res) => {
        console.log(res);
        resolve(res.data.access_token); // 获取access_token
      },
      fail: (err) => {
        console.log(err);
        reject(err);
      }
    });
  });
}

async function sendAuditRequest(str) {
  const access_token = await getToken();
  const url = `https://aip.baidubce.com/rest/2.0/solution/v1/text_censor/v2/user_defined?access_token=${access_token}`;
  return new Promise((resolve, reject) => {
    //文本内容审核
    wx.request({
      url: url,
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data:{
        'text': str
      },
      success: (res) => {
        console.log(res);
        resolve(res.data);
      },
      fail: (err) => {
        console.log(err);
        reject(err);
      }
    });
  });
}

function handleGoodResult(str) {
  const html = str.replace(/\\n/g, "<br>");
  return JSON.parse(html);
}

// 提取出所有敏感词在文本中的起始-结束位置
function handleBadResult(str, data) {
  console.log(data);
  let res = [];
  for(let i = 0; i < data.length; i++) {
    if(data[i].type == 13) {  // 命中自定义文本黑名单中的词需要自己找位置
      for(let ci = 0, clen = data[i].hits.length; ci < clen; ci++) {
        let { words } = data[i].hits[ci];
        for(let wi = 0, wlen = words.length; wi < wlen; wi++) {
          let cus_res = Sunday(str, words[wi]);
          res.push(...cus_res);
        }
      }
    }else {
      for(let di = 0, dlen = data[i].hits.length; di < dlen; di++) {
        let { wordHitPositions } = data[i].hits[di];
        if(wordHitPositions.length != 0){
          for(let hi = 0, hlen = wordHitPositions.length; hi < hlen; hi++){
            let { positions } = wordHitPositions[hi];
            for(let pi = 0, plen = positions.length; pi < plen; pi++){
              res.push(positions[pi])
            }
          }
        }
      }
    }
  }
  console.log(res);
  return sortAndCombArray(res);
}

function sortAndCombArray(arr) {
  arr.sort(function(a,b){
    return a[0] - b[0];
  })
  let res = [];
  for(let i = 0; i < arr.length; i++) {
    if(res.length == 0) {
      res.push(arr[i]);
      continue;
    }
    if(res[res.length-1][1] < arr[i][0]){
      res.push(arr[i]);
    }else {
      res[res.length-1][1] = Math.max(res[res.length-1][1], arr[i][1]);
    }
  }
  console.log(res);
  return res;
}

// 这个函数是为了生成将文本分割为合法和不合法的部分的数组，以便后续对不合法的文本进行标红
function createSliceArray(strLength, arr) {
  let res = [];
  // 第三个数字，1代表合法，2代表不合法
  res.push([0, 0, 1]);                                  // 补齐第一个双引号
  for(let i = 0; i < arr.length; i++) {
    if(i == 0 && arr[i][0] > 1) {                       // 第一个敏感词前面有合法词
      res.push([1, arr[i][0]-1, 1]);
    }
    if(i > 0 && arr[i][0] > arr[i-1][1]) {              // 两个敏感词中间有合法词
      res.push([arr[i-1][1]+1, arr[i][0]-1, 1]); 
    } 
    res.push([arr[i][0], arr[i][1], 2]);                // 敏感词
    if(i == arr.length-1 && arr[i][1] < strLength-2) {  // 最后一个敏感词后面有合法词 
      res.push([arr[i][1]+1, strLength-2, 1]); 
    } 
  }
  res.push([strLength-1, strLength-1, 1]);              // 补齐最后一个双引号
  console.log(res);
  if(res.length == 2) {         // 当内容合规时过滤完成后下方也显示结果
    res.splice(1,0,[1,strLength-2,1]);
  }
  return res;
}

function createHtml(str, arr) {
  let str_arr = Array.from(str);
  let html = '';
  for(let i = 1; i < arr.length-1; i++){  // 去掉首尾的双引号
    if(arr[i][2] == 1) {
      html += '<span>'+ str_arr.slice(arr[i][0], arr[i][1]+1).join('') +'</span>';
    }else {
      html += '<span style="background-color:#f1b2b5;">'+ str_arr.slice(arr[i][0], arr[i][1]+1).join('') +'</span>';
    }
  }
  html = html.replace(/\\n/g, "<br>");
  console.log(html);
  return html;
}

function getSensitiveWordsCount(arr) {
  let count = 0;
  for(let i = 0; i < arr.length; i++) {
    count += arr[i][1] - arr[i][0] + 1;
  }
  return count;
}

function setTitleEditorContents(that, html) {
  that.editorCtx_title.setContents({
    html: html,
    success: (res) => {
      console.log(res);
    },
    fail: (err) => {
      console.log(err);
    }
  })
}

function setBodyEditorContents(that, html) {
  that.editorCtx_body.setContents({
    html: html,
    success: (res) => {
      console.log(res);
    },
    fail: (err) => {
      console.log(err);
    }
  })
}

function getMoveLengthObj(str) {
  var resObj = {};
  var arr_str = Array.from(str);
  var len = arr_str.length;
  for (var i = 0; i < len; i++) {
      resObj[arr_str[i]] = len - i;
  }
  return resObj;
}

function Sunday(src, dest) {
  var res = [];
  var moveObj = getMoveLengthObj(dest);
  var arr_str = Array.from(src);
  var arr_dest = Array.from(dest);
  var len1 = arr_str.length,
      len2 = arr_dest.length;
  var i = 0,
      j = 0;
  while (i < len1 && j < len2) {
      if (arr_str[i] === arr_dest[j]) {
          i++;
          j++;
      } else {
          i = i - j;
          var offset = moveObj[arr_str[i + len2]];
          if (offset) {
              i += offset;
          } else {
              i += len2;
          }
          j = 0;
      }
      if (j === len2) {
        res.push([i-j, i-j+len2-1])
        j = 0;
      }
  }
  return res;
}

module.exports.filterBody = filterBody;
module.exports.filterTitle = filterTitle;