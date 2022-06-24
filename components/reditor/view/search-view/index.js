// components/reditor/search-view/index.js
const Text_Handler = require("../../../../pages/note/text-handler");
const db = wx.cloud.database();
const _ = db.command;
const notesCollection = db.collection('note');
Component({
  behaviors: ['wx://component-export'],
  export() {
    this.setData({results: []})
    // return { myField: 'myValue' }
  },
  /**
   * 组件的属性列表
   */
  properties: {
    show: Boolean,
    scrollViewHeight: Number,     // TODO 可不可以放到data中
    scrollTop: Number,
    triggered: Boolean,
    needRefresh: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    key: '',
    results: [],       // 存放搜索结果
    count: 0,
    showLoading: false, 
    showActionSheet: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    needRefresh(e) {
      this.setData({
        needRefresh: e.detail.needRefresh
      });
      if(e.detail.trigger == 'delete') {
        this.triggerEvent('delete');
      }
    },
    onClickMoreBtn(e) {
      let noteIndex = e.detail.noteIndex;
      let noteData = e.detail.noteData;
      this.setData({ 
        showActionSheet: true,
        noteIndex: noteIndex,       // 暂时用不到
        noteData: noteData, 
      });
    },
    // 搜索笔记
    search(e) { 
      this.setData({ key: e.detail.key });
      wx.showLoading({
        title: '搜索中',
      })
      this.onRefresh();
    },
    // TODO 虽然不允许下拉刷新，但是应该允许代码触发刷新吧，一会儿测试一下
    onRefresh() {
      let _this = this;
      let count = 0;
      let old_data = [];
      _this.getResults(count, old_data)
      .then((res) => {
        _this.setData({ triggered: false });
        wx.hideLoading();
      })
      .catch((err) => {
        console.log(err);
      });
    },
    // 搜索页触底加载
    reachBottom() {
      let _this = this
      let count = _this.data.count;
      let old_data = _this.data.results;
      _this.setData({ showLoading: true });
      _this.getResults(count, old_data)
      .then((res) => {
        _this.setData({ showLoading: false });
      })
      .catch((err) => {
        console.log(err);
      });
    },
    getResults(skip_count, old_data) {
      let _this = this;
      let key = _this.data.key;
      return new Promise((resolve, reject) => {
        notesCollection.where(_.or([
          {
            title: db.RegExp({
              regexp: key
            })
          },
          {
            body: db.RegExp({
              regexp: key
            })
          }
        ])).skip(skip_count).orderBy('time','desc').get().then((res) => {
          _this.setData({
            results: old_data.concat(res.data),
            count: skip_count + res.data.length
          });
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
      });
    }
  },
  observers: {
    'needRefresh': function(needRefresh) {
      if(needRefresh) {
        this.onRefresh();
      }
    },
  }
})
