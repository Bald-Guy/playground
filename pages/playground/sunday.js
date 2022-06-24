function getMoveLengthObj (str) {
  var resObj = {},
      len = str.length;
  for (var i = 0; i < len; i++) {
      resObj[str[i]] = len - i;
  }
  return resObj;
}

function Sunday (src, dest) {
  var res = [];
  var moveObj = getMoveLengthObj(dest);
  var len1 = src.length,
      len2 = dest.length;
  var i = 0,
      j = 0;
  while (i < len1 && j < len2) {
    console.log(i, j)
      if (src[i] === dest[j]) {
          i++;
          j++;
      } else {
          i = i - j;
          var offset = moveObj[src[i + len2]];
          if (offset) {
              i += offset;
          } else {
              i += len2;
          }
          j = 0;
      }
      if (j === len2) {
        // return i - j;
        console.log(j, i)
        res.push([i-j, i-j+len2-1])
        j = 0;
      }
  }

  return res;
}

module.exports.Sunday = Sunday;