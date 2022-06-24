const cloud = require('wx-server-sdk')
exports.main = async (event, context) => {
  let { OPENID, APPID, UNIONID } = cloud.getWXContext()
  return {
    OPENID,
    APPID,
    UNIONID,
  }
}