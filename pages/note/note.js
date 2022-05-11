// pages/note/note.js
const Storage = require('../../utils/storage');
const Text_Handler = require('../note/text-handler');
Page({
  data: {
    titleText: "",
    titleMaxlength: -1,
    bodyText: "",
    titleTxtNum: 20,
    bodyTxtNum: 0,
    bodyFocus: false,
    showDialog: false,
    keyboardHeight: -999,
    animationData: {},
    x: 0,
    left: 0
  },
  onLoad(options) {
    let _this = this;
    console.log(options);
    // 获取系统信息
    var systemInfo = wx.getSystemInfoSync();
    console.log(systemInfo);
    var textareaHeight = systemInfo.windowHeight - 220;
    this.setData({
      textareaHeight: textareaHeight,
      platform: 'ios'// systemInfo.platform
    })
    this.getEmojiGroupList();
    this.initPageData(options);
  },
  initPageData(options) {
    let _this = this;
    switch (options.scene) {
      case "3": // 添加新的笔记
        _this.setData({ scene: 3 });
        break;
      case "4": // 编辑旧的笔记
        let note_str = decodeURIComponent(options.note);
        let note = JSON.parse(note_str);
        _this.setData({
          scene: 4,
          noteIdx: parseInt(options.index),
          titleText: note.title,
          titleTxtNum: 20 - note.title.length,
          bodyText: note.body,
          bodyTxtNum: note.body.length
        });
        break;
    }
  },
  titleInput(e) {
    console.log(e);
    let value = e.detail.value;
    console.log(value);
    console.log(value.length);
    this.restWordCount(value);
  },
  restWordCount(str) {
    let _this = this;
    let titleTxtNum = _this.data.titleTxtNum;
    if (_this.data.platform == 'ios') {
      let text = Text_Handler.getWordCount_redbook_ios(str).text;
      let count = Text_Handler.getWordCount_redbook_ios(str).count;
      
      let remain_count = Text_Handler.calculateDifference(20, count);
      _this.setData({ 
        titleText: text,
        titleTxtNum: remain_count 
      });
    }
    if (_this.data.platform == 'android') {
      let text = Text_Handler.getWordCount_redbook_android(str);
      _this.setData({ titleText: text });
    }
  },
  bodyInput(e) {
    console.log(e);
    this.setData({
      bodyText: e.detail.value, 
      bodyTxtNum: e.detail.value.length 
    });
  },
  insertEmoji(e) {
    let _this = this;
    let text = _this.data.bodyText;
    let emoji = e.currentTarget.dataset.emoji;
    wx.getSelectedTextRange({
      complete: res => {
        let textIndex = res.start;
        text = text.substring(0, textIndex) + emoji + text.substring(textIndex, text.length);
        _this.setData({ bodyText: text });
      }
    })
  },
 
  bodyInputFocus(e) {
    this.setData({ 
      keyboardHeight: e.detail.height,
      bodyFocus: true, 
    });
  },
  titleInputBlur(e) {
    this.setData({
      titleText: e.detail.value
    })
  },
  keyboardheightchange(e) {
    this.setData({ keyboardHeight: e.detail.height });
  },

  bodyInputBlur(e) {
    this.setData({
      bodyText: e.detail.value,
      bodyFocus: false
    })
  },
  onEmojiViewTouchmove() {
    this.setData({
      bodyFocus: true
    })
  },

  getEmojiGroupList() {
    let _this = this;
    Storage.getGroupList().then((grouplist)=>{
      _this.setData({ grouplist: grouplist });
    })
  },
  onGroupTitleClick(e) {
    let emojiList = e.currentTarget.dataset.list;
    let gidx = e.currentTarget.dataset.gidx;
    this.setData({ 
      currentEmojiList: emojiList,
      currentGroupIdex: gidx
    });
  },

  saveAsDraft() {
    console.log("点击成功！！！");
    this.setData({
      showDialog: true
    })
  },

  confirmSave() {
    let _this = this;
    this.setData({
      showDialog: false
    })
    let note = {
      title: _this.data.titleText,
      body: _this.data.bodyText,
      time: new Date().getTime()
    };
    // 判断是在添加新笔记还是编辑旧笔记
    switch (_this.data.scene) {
      case 3:
        console.log("保存新笔记");
        if(_this.data.titleText != '' || _this.data.bodyText != '') {
          Storage.setNoteList(note);
        }else {
          wx.showToast({
            title: '内容为空',
            icon: 'none',
            duration: 800
          })
        }
        break;
      case 4:
        console.log("保存修改过的笔记");
        if(_this.data.titleText == '' && _this.data.bodyText == '') {
          wx.showToast({
            title: '内容为空',
            icon: 'none',
            duration: 800
          })
        }else {
          let index = _this.data.noteIdx;
          Storage.getNoteList().then((notelist)=>{
            console.log(notelist);
            notelist.splice(index, 1, note);
            console.log(notelist);
            Storage.setStorage('notelist', notelist);
          })
        }
        break;
    }

  },

  cancelSave() {
    this.setData({
      showDialog: false
    })
  },

  onDialogClose() {
    console.log("dialog关闭")
  },

  copyTitle() {
    var data = this.data.titleText;
    wx.setClipboardData({
      data: data,
      success (res) {
        wx.showToast({
          title: '已复制到剪贴板',
          icon: 'none',
          duration: 800
        })
      }
    })
  },

  copyBody() {
    let char = unescape("\u3164");
    let data = this.data.bodyText;
    let data_str = JSON.stringify(data);
    let new_data_str = data_str.replace(/\\n\\n/g, "\\n"+char+"\\n");
    wx.setClipboardData({
      data: JSON.parse(new_data_str),
      success (res) {
        wx.showToast({
          title: '已复制到剪贴板',
          icon: 'none',
          duration: 800
        })
      }
    })
  },

  previewNote() {
    let _this = this;
    let note = {
      title: _this.data.titleText,
      body: _this.data.bodyText
    };
    let note_str = JSON.stringify(note);
    wx.navigateTo({
      url: '../preview/preview?note=' + encodeURIComponent(note_str),
    })
  },
  touchStrat(e) {
    console.log(e);
    console.log(e.changedTouches[0].pageX);
    this.setData({ x: e.changedTouches[0].pageX });
  },
  touchMove(e) {
    console.log(e);
    let _this = this;
    let x = e.changedTouches[0].pageX;
    let dif = x - this.data.x;
    let animation = wx.createAnimation({
      delay: 400,
      timingFunction: 'linear'
    })
    animation.translateX(dif).step();
    this.setData({
      animationData: animation.export(),
      left: _this.data.left + dif,
      x: x
    });
  },
  touchEnd(e) {
    console.log(e);
    let _this = this;
    let x = e.changedTouches[0].pageX;
    let dif = x - this.data.x;
    let animation = wx.createAnimation({
      delay: 400,
      timingFunction: 'linear'
    })
    animation.translateX(dif).step();
    this.setData({
      animationData: animation.export(),
      left: _this.data.left + dif
    });
  },
  tap() {
    console.log("点击");
  },

  onShareAppMessage() {

  }
})