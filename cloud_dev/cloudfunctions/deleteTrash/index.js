// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command;
const trashCollection = db.collection('trash');
// 云函数入口函数
exports.main = async (event, context) => {
  let currentDate = new Date().getTime();
  let deleteDate = currentDate - 30*24*60*60*1000;
  return await trashCollection.where({
    _openid: cloud.getWXContext().OPENID,
    delete_time: _.lt(deleteDate)
  }).remove()
}