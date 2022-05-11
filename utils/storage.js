function setStorage (key, data) {
  wx.setStorage({
    key: key,
    data: data,
    success (res) {
      console.log("缓存成功，反馈日志：", res);
    },
    fail(err) {
      console.log("缓存失败，反馈日志：", err);
    }
  })
}
function getStorage (key) {
  return new Promise((resolve)=>{
    wx.getStorage({
      key: key,
      success(res) {
        console.log("获取缓存成功，反馈日志：", res);
        resolve(res.data);
      },
      fail(err) {
        console.log("获取缓存失败，反馈日志：", err);
      }
    })
  })
}
function getGroupList () {
  return new Promise((resolve)=>{
    wx.getStorage({
      key: 'grouplist',
      success (res) {
        console.log("获取表情分组列表缓存成功，反馈日志：", res);
        resolve(res.data);
      },
      fail (err) {
        console.log("获取表情分组列表缓存失败，反馈日志：", err);
        setStorage('grouplist', [{title: "标题常用", list: ["㊙️", "‼️", "❓", "❗️", "🆘", "🔥"]},{title: "段首常用", list: ["1⃣️", "2⃣️", "3⃣️", "4⃣️", "5⃣️", "6⃣️", "7⃣️", "8⃣️", "9⃣️"]},{title: "高频使用", list: ["❌", "✅", "📌", "🏷️", "▪️", "✨", "🌟", "💰", "🌈"]}]);
        resolve([{title: "标题常用", list: ["㊙️", "‼️", "❓", "❗️", "🆘", "🔥"]},{title: "段首常用", list: ["1⃣️", "2⃣️", "3⃣️", "4⃣️", "5⃣️", "6⃣️", "7⃣️", "8⃣️", "9⃣️"]},{title: "高频使用", list: ["❌", "✅", "📌", "🏷", "▪️", "✨", "🌟", "💰", "🌈"]}]);
      }
    })
  })  
}
function setGroupList (group) {
  wx.getStorage({
    key: 'grouplist',
    success (res) {
      console.log("获取表情分组列表缓存成功，反馈日志：", res);
      let grouplist = res.data;
      grouplist.push(group);
      setStorage('grouplist', grouplist);
    },
    fail (err) {
      console.log("获取表情分组列表缓存失败，反馈日志：", err);
      let grouplist = [];
      grouplist.push(group);
      setStorage('grouplist', grouplist);
    }
  })
}
function getNoteList () {
  return new Promise((resolve)=>{
    wx.getStorage({
      key: 'notelist',
      success (res) {
        console.log("获取表情分组列表缓存成功，反馈日志：", res);
        resolve(res.data);
      },
      fail (err) {
        console.log("获取表情分组列表缓存失败，反馈日志：", err);
        setStorage('notelist', [{title:"👋你好，小红书创作者",body:"这是一个帮助你更好编辑小红书笔记文本内容的工具，在这里你可以：\n1⃣️拥有更大的编辑空间\n2⃣️提前预览发布后的效果\n3⃣️一键复制粘贴，空行不会丢失\n望使用愉快～如有任何反馈请联系：\n🛰️lht19960624",time: new Date().getTime()}]);
        resolve([{title:"👋你好，小红书创作者",body:"这是一个帮助你更好编辑小红书笔记文本内容的工具，在这里你可以：\n1⃣️拥有更大的编辑空间\n2⃣️提前预览发布后的效果\n3⃣️一键复制粘贴，空行不会丢失\n望使用愉快～如有任何反馈请联系：\n🛰️lht19960624",time: new Date().getTime()}]);
      }
    })
  })  
}
function setNoteList (note) {
  wx.getStorage({
    key: 'notelist',
    success (res) {
      console.log("获取表情分组列表缓存成功，反馈日志：", res);
      let notelist = res.data;
      notelist.push(note);
      setStorage('notelist', notelist);
    },
    fail (err) {
      console.log("获取表情分组列表缓存失败，反馈日志：", err);
      let notelist = [];
      notelist.push(group);
      setStorage('notelist', notelist);
    }
  })
}


module.exports.setStorage = setStorage;
module.exports.getStorage = getStorage;
module.exports.getGroupList = getGroupList;
module.exports.setGroupList = setGroupList;
module.exports.getNoteList = getNoteList;
module.exports.setNoteList = setNoteList;
