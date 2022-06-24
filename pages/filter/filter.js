// pages/filter/filter.js
const Filter = require('./text-filter');
const Text_Handler = require('../note/text-handler');
Component({
  data: {
    currentPage: 1,
    bodyText: '',
    titleText: '',
    bodyTextWordCount: 0,
    titleTextWordCount: 0,
    sensitiveWordCount_body: 0,
    sensitiveWordCount_title: 0
  },
  methods: {
    onLoad(options) {
      let _this = this;
      let note_str = decodeURIComponent(options.note);
      console.log(note_str)
      let note = JSON.parse(note_str);
      console.log(note.body);
      this.setData({
        bodyText: note.body,
        titleText: note.title
      })
      this.filterBody();
      this.filterTitle();
      this.setUIParm();
    },
    setUIParm() {
      const app = getApp();
      this.setData({
        bodyTextHeight: (app.globalData.contentViewHeight - app.globalData.bottomSafeHeight) / 2 - 100,
        titleTextHeight: 50, 
        bottomSafeHeight: app.globalData.bottomSafeHeight,  
      });
    },
    onClickBackBtn() {
      wx.navigateBack();
    },
    switchToBodyPage() {
      this.setData({ currentPage: 1 });
    },
    switchToTitlePage() {
      this.setData({ currentPage: 2 });
    },
    bodyInput(e) {
      const eventChannel = this.getOpenerEventChannel();
      eventChannel.emit('acceptBodyFromOpenedPage', {body: e.detail.value});
      this.setData({ bodyText: e.detail.value });
    },
    titleInput(e) {
      const eventChannel = this.getOpenerEventChannel();
      eventChannel.emit('acceptTitleFromOpenedPage', {title: e.detail.value});
      this.setData({ titleText: e.detail.value });
    },
    filterBody() {
      Filter.filterBody(this, this.data.bodyText);
    },
    filterTitle() {
      Filter.filterTitle(this, this.data.titleText);
    },
    bodyEditorReady() {
      const that = this
      wx.createSelectorQuery().select('#editor_body').context(function (res) {
        that.editorCtx_body = res.context
      }).exec()
    },
    titleEditorReady() {
      const that = this
      wx.createSelectorQuery().select('#editor_title').context(function (res) {
        that.editorCtx_title = res.context
      }).exec()
    },
  },
  observers: {
    'bodyText': function(bodyText) {
      const platform = getApp().globalData.platform;
      let count = Text_Handler.getBodyWordCount_redbook(platform, bodyText);
      this.setData({ bodyTextWordCount: count });
    },
    'titleText': function(titleText) {
      const platform = getApp().globalData.platform;
      let count = Text_Handler.getTitleWordCount_redbook(platform, titleText);
      this.setData({ titleTextWordCount: count });
    }
  }
})