const Storage = require("../utils/storage");
function isRegister(openid) {
  const db = wx.cloud.database()
  db.collection('user').where({
    userid: openid
  })
  .get({
    success: function(res) {
      console.log(res.data)
      if(res.data.length == 0) {  // 未注册用户
        userRegister(openid);
        importDefautData();
      }else {                     // 已注册用户
        const db = wx.cloud.database();
        db.collection('user').get().then(res => {
          console.log(res);
          wx.setStorage({
            key: 'nickname',
            data: res.data[0].nickname
          })
          wx.setStorage({
            key: 'avatarUrl',
            data: res.data[0].avatarUrl
          })
        })
      }
    },
    fail: function(err) {
      console.log(err);
    }
  })
}
function userRegister(userid) {
  wx.setStorage({
    key: 'nickname',
    data: '红薯宝宝'
  })
  wx.setStorage({
    key: 'avatarUrl',
    data: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
  })
  const db = wx.cloud.database()
  db.collection('user').add({
    data: {
      userid: userid,
      nickname: '红薯宝宝',
      avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
    },
    success: function(res) {
      console.log(res);
    },
    fail: function(err) {
      console.log(err);
    }
  })
}
function importDefautData() {
  const db = wx.cloud.database()
  // 添加默认笔记
  db.collection('note').add({
    data: {
      title: "👋你好，小红书创作者",
      body: "Reditor 是一个帮助你更好编辑小红书笔记文本内容的工具，在这里你可以：\n🔹 拥有更大的编辑空间\n🔹 检测笔记中的敏感词\n🔹 提前预览发布后的效果\n🔹 一键复制粘贴，空行不会丢失\n🔹 对笔记分组管理，支持笔记搜索\n🔹 期待未来更多 amazing 的功能\n望使用愉快～如有任何反馈请联系：\n🛰️lht19960624\n🥳 如果还想要加入红薯编辑器的用户群，和其他博主一起交流分享小红书运营心得以及产品使用体验的话，加微时请备注「加群」\n😘 希望红薯编辑器能越变越好，成为那款高效、趁手、你喜欢的工具～\n❤️ 感谢你的支持，我们江湖再见",
      time: new Date().getTime()
    },
    success: function(res) {
      console.log(res);
    },
    fail: function(err) {
      console.log(err);
    }
  })
  // 添加默认分组
  // let grouplist = [{title: "标题常用", list: ["㊙️", "‼️", "❓", "❗️", "🆘", "🔥"]},{title: "段首常用", list: ["1⃣️", "2⃣️", "3⃣️", "4⃣️", "5⃣️", "6⃣️", "7⃣️", "8⃣️", "9⃣️"]},{title: "高频使用", list: ["❌", "✅", "📌", "🏷️", "▪️", "✨", "🌟", "💰", "🌈"]}];
  // for(let i = 0; i < grouplist.length; i++) {
  //   db.collection('emoji_group').add({
  //     data: grouplist[i],
  //     success: function(res) {
  //       console.log(res);
  //     },
  //     fail: function(err) {
  //       console.log(err);
  //     }
  //   })
  // }
}
function queryEmojiGroupList(_this) {
  Storage.getStorage('userid').then((userid)=>{
    const db = wx.cloud.database()
    db.collection('emoji_group').where({
      _openid: userid
    }).get().then((res)=>{
      _this.setData({ grouplist: res.data });
    })
  })
}
function queryNoteList(_this) {
  Storage.getStorage('userid').then((userid)=>{
    const db = wx.cloud.database()
    db.collection('note').where({
      _openid: userid
    }).get().then((res)=>{
      _this.setData({ notelist: res.data });
    })
  })
}
function addNote(note) {
  const db = wx.cloud.database()
  // 添加默认笔记
  db.collection('note').add({
    data: note,
    success: function(res) {
      console.log(res);
    },
    fail: function(err) {
      console.log(err);
    }
  })
}
function updateNote(noteId, title, body, time) {
  const db = wx.cloud.database()
  db.collection('note').doc(noteId).update({
    data: {
      title: title,
      body: body,
      time: time
    },
    success: function(res) {
      console.log(res.data)
    },
    fail: function(err) {
      console.log(err);
    }
  })
}
function deleteNote(noteid) {
  const db = wx.cloud.database();
  db.collection('note').doc(noteid).remove({
    success: function(res) {
      console.log(res.data)
    },
    fail: function(err) {
      console.log("删除失败");
    }
  })  
}

function addData(coll, data) {
  const db = wx.cloud.database();
  return new Promise((resolve, reject) => {
    db.collection(coll).add({
      data: data,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    })
  });
}

function updateData(coll, id, new_data) {
  const db = wx.cloud.database();
  return new Promise((resolve, reject) => {
    db.collection(coll).doc(id).update({
      data: new_data,
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err);
      }
    })
  });
}

function deleteData(coll, id) {
  const db = wx.cloud.database();
  return new Promise((resolve, reject) => {
    db.collection(coll).doc(id).remove({
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    })
  })
}

module.exports.isRegister = isRegister;
module.exports.queryEmojiGroupList = queryEmojiGroupList;
module.exports.queryNoteList = queryNoteList;
module.exports.addNote = addNote;
module.exports.updateNote = updateNote;
module.exports.deleteNote = deleteNote;

module.exports.addData = addData;
module.exports.updateData = updateData;
module.exports.deleteData = deleteData;
