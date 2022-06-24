// pages/note/note.js
const Storage = require('../../utils/storage');
const Database = require('../../utils/database');
const Text_Handler = require('../note/text-handler');
const Draft = require('./draft-handler');
const db = wx.cloud.database();
const notesCollection = db.collection('note');
Component({
  data: {
    titleText: "",            // 标题文本
    bodyText: "",             // 正文文本
    textareaHeight: 300,      // 正文文本框高度
    bottomSafeHeight: 0,
    titleTextWordCount: 0,    // 标题文本字数
    bodyTextWordCount: 0,     // 正文文本字数
    titleFocus: false,        // 标题输入框聚焦
    bodyFocus: false,         // 正文输入框聚焦
    showDraftDialog: false,   // 控制恢复草稿的对话框显示&隐藏
    showDialog: false,        // 控制保存笔记的对话框显示&隐藏
    showActionSheet: false,   // 控制返回编辑的动作面板显示&隐藏
    platform: 'android',      // 当下小程序正在运行的平台
    needSaveDraft: true,
    actions: [{name: '返回编辑'},{name: '保存并退出'},
    ],
  },
  methods: {
    onLoad(options) {
      let _this = this;
      console.log(options);
      let systemInfo = wx.getSystemInfoSync();    // 获取系统信息
      console.log(systemInfo);
      this.setUIParm(systemInfo);
      this.setPlatform();          
      this.initNoteData(options);
    },
    // 设置 UI 参数
    setUIParm(systemInfo) {
      let _this = this;
      let textareaHeight = systemInfo.windowHeight;
      let query = this.createSelectorQuery();
      query.selectAll('.nav-bar,.title-area,.body-left-num,.bottom-area').boundingClientRect();
      query.exec((res)=>{
        for(let i = 0; i < res[0].length; i++) {
          textareaHeight -= res[0][i].height;
        }
        _this.setData({ textareaHeight: textareaHeight - 100 });  // 100 为留白区域高度
      });
      let app = getApp();
      this.setData({
        bottomSafeHeight: app.globalData.bottomSafeHeight,  
      });
    },
    // 设置正在运行小程序的平台
    setPlatform() {
      this.setData({ platform: getApp().globalData.platform });
    },
    // 笔记数据初始化
    initNoteData(options) {
      let _this = this;
      _this.setData({belong: options.belong})
      switch (options.scene) {
        case "3": // 添加新的笔记
          _this.setData({ scene: 3 });
          Draft.checkDraftInS3();
          break;
        case "4": // 编辑旧的笔记
          let note_str = decodeURIComponent(options.note);
          let note = JSON.parse(note_str);
          console.log(note)
          _this.initNoteDataInS4(options.index, note);
          Draft.checkDraftInS4(note._id);
          break;
        default:
          break;
      }
    },
    initNoteDataInS4(index, note) {
      this.setData({
        scene: 4,
        noteIdx: parseInt(index),
        titleText: note.title,
        bodyText: note.body,
        noteId: note._id,
      });
    },
    // 继续编辑草稿
    continueEdit() {
      Draft.continueEdit();
    },
    // 丢弃草稿
    discardDraft() {
      Draft.discardDraft();
    },
    // 提示是否保存笔记的对话框关闭时触发
    onDialogClose() {
      this.setData({ showDialog: false });
    },
    titleInput(e) {
      let value = e.detail.value;
      this.setData({ titleText: value });
    },
    bodyInput(e) {
      let value = e.detail.value;
      this.setData({ bodyText: e.detail.value });
    },
    titleInputFocus(e) {
      this.setData({ 
        titleFocus: true
      });
    },
    bodyInputFocus(e) {
      this.setData({ 
        bodyFocus: true
      });
    },
    titleInputBlur(e) {
      this.setData({
        titleText: e.detail.value,
        titleFocus: false
      })
    },
    bodyInputBlur(e) {
      this.setData({
        bodyText: e.detail.value,
        bodyFocus: false
      })
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
    // 内容过滤
    filterText() {
      let _this = this;
      let note = {
        title: _this.data.titleText,
        body: _this.data.bodyText
      };
      let note_str = JSON.stringify(note);
      wx.navigateTo({
        url: '../filter/filter?note=' + encodeURIComponent(note_str),
        events: {
          acceptTitleFromOpenedPage: function(data) {
            console.log(data);
            _this.setData({ titleText: data.title });
          },
          acceptBodyFromOpenedPage: function(data) {
            console.log(data);
            _this.setData({ bodyText: data.body });
          }
        }
      })
    },
    onClickPreviewBtn() {
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
    // 点击返回按钮
    onClickBackBtn() {
      switch (this.data.scene) {
        case 3:
          this.onClickBackBtnInS3();
          break;
        case 4:
          this.onClickBackBtnInS4();
          break;
        default:
          break;
      } 
    },
    // 在添加新笔记场景中点击【返回】按钮
    onClickBackBtnInS3() {
      if(this.checkNullContent()) {
        this.setData({ needSaveDraft: false });
        wx.navigateBack();
      }else {
        this.setData({ showActionSheet: true })
      }
    },
    // 在编辑旧笔记场景中点击【返回】按钮
    onClickBackBtnInS4() {
      if(this.checkNullContent()) {
        this.setData({ needSaveDraft: false });
        wx.navigateBack();
      }else {
        this.setData({ showActionSheet: true });
      }
    },
    // 点击【返回】按钮 - 进行选择
    selectAction(e) {
      let _this = this;
      let action = e.detail.name;
      switch(action) {
        case '返回编辑':
          _this.backToEdit();
          break;
        case '保存并退出':
          _this.saveAndBack();
          break;
        default: break;
      }
    },
    // 点击【返回】按钮 - 选择【取消】
    cancelAction() {
      this.setData({ showActionSheet: false });
    },
    onCloseActionSheet() {
      this.setData({ showActionSheet: false });
    },
    // 点击【返回】按钮 - 选择【返回编辑】
    backToEdit() {
      this.setData({ showActionSheet: false });
    },
    // 点击【返回】按钮 - 选择【保存并退出】
    saveAndBack() {
      switch (this.data.scene) {
        case 3:
          this.saveAndBackInS3();
          break;
        case 4:
          this.saveAndBackInS4();
          break;
        default: break;
      }
    },
    // 在添加新笔记场景中选择【保存并退出】
    saveAndBackInS3() {
      let note = {
        title: this.data.titleText,
        body: this.data.bodyText,
        belong: this.data.belong,
        time: new Date().getTime()
      };
      notesCollection.add({
        data: note
      }).then(res => {
        this.needRefresh();
        this.setData({ needSaveDraft: false });
        Draft.deleteDraftInS3();
        wx.navigateBack().then(res => { // 返回笔记列表页
          // console.log("通过按钮卸载");
          // Draft.backToIndexPageByBtn();
          wx.showToast({
            title: '笔记保存成功',
            icon: 'none',
            duration: 1000
          })
        })
      })
    },
    // 在编辑旧笔记场景中选择【保存并退出】
    saveAndBackInS4() {
      let _this = this;
      let noteId = _this.data.noteId;
      notesCollection.doc(noteId).update({
        data: {
          title: _this.data.titleText, 
          body: _this.data.bodyText
        }
      }).then(res => {
        this.needRefresh();
        this.setData({ needSaveDraft: false });
        Draft.deleteDraftInS4();
        wx.navigateBack().then(res => { // 返回笔记列表页
          // console.log("通过按钮卸载");
          // Draft.backToIndexPageByBtn();
          wx.showToast({
            title: '笔记保存成功',
            icon: 'none',
            duration: 1000
          })
        })
      })
    },
    // 点击【保存】按钮
    onClickSaveBtn() {
      if(this.checkNullContent()) {
        wx.showToast({
          title: '内容不能为空',
          icon: 'error',
          duration: 1000
        })
      }else {
        this.setData({ showDialog: true });
      }
    },
    // 点击【保存】按钮 - 选择【取消】
    cancelSave() {
      this.setData({ showDialog: false });
    },
    // 点击【保存】按钮 - 选择【保存】
    confirmSave() {
      switch (this.data.scene) {
        case 3:
          this.confirmSaveInS3();
          break;
        case 4:
          this.confirmSaveInS4();
          break;
        default: break;
      }
    },
    // 在添加新笔记场景中点击【保存】按钮 - 选择【保存】
    confirmSaveInS3() {
      this.saveAndBackInS3(); // 逻辑相同
    },
    // 在编辑旧笔记场景中点击【保存】按钮 - 选择【保存】
    confirmSaveInS4() {
      this.saveAndBackInS4(); // 逻辑相同
    },
    // 检查笔记内容是否全为空
    checkNullContent() {
      let title = this.data.titleText;
      let body = this.data.bodyText;
      return Text_Handler.checkSpace(title) && Text_Handler.checkSpace(body);
    },
    // 将微信切入后台或点击右上角胶囊按钮会触发 onHide
    onHide() {
      console.log("页面隐藏")
    },
    // 右滑返回上级页面会触发 onUnload
    onUnload() {
      console.log("通过其他卸载");
      // this.needRefresh();
      if(this.data.needSaveDraft) {
        switch(this.data.scene) {
          case 3: 
            const eventChannel_S3 = this.getOpenerEventChannel();
            eventChannel_S3.emit('acceptDraftInS3', {title: this.data.titleText, body: this.data.bodyText});
            break;
          case 4:
            const eventChannel_S4 = this.getOpenerEventChannel();
            eventChannel_S4.emit('acceptDraftInS4', {title: this.data.titleText, body: this.data.bodyText});
            break;
          default: break;
        }
      }
      console.log("页面卸载")
    },
    // 当保存笔记成功后修改刷新上一级页面
    needRefresh() {
      let pages = getCurrentPages();
      let indexPage = pages[0]; // 笔记列表页
      console.log(indexPage)
      indexPage.setData({
        needRefresh: true,
      })
    }
  },
  observers: {
    'titleText': function(titleText) {
      const platform = getApp().globalData.platform;
      let count = Text_Handler.getTitleWordCount_redbook(platform, titleText);
      this.setData({ titleTextWordCount: count });
    },
    'bodyText': function(bodyText) {
      const platform = getApp().globalData.platform;
      let count = Text_Handler.getBodyWordCount_redbook(platform, bodyText);
      this.setData({ bodyTextWordCount: count });
    }
  }
})