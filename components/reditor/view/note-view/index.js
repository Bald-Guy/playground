// components/reditor/view/note-view/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: Boolean,
    scrollViewHeight: Number,
    scrollTop: Number,
    triggered: Boolean,
    needRefresh: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    notes: [],
    count: 0,
    showLoading: false,
    showActionSheet: false
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
    onRefresh() {
      let _this = this;
      let count = 0;
      let old_data = [];
      _this.getNotes(count, old_data)
      .then((res) => {
        _this.setData({ triggered: false });
      })
      .catch((err) => {
        console.log(err);
      });
    },
    reachBottom() {
      let _this = this;
      let count = _this.data.count;
      let old_data = _this.data.notes;
      _this.setData({ showLoading: true });
      _this.getNotes(count, old_data)
      .then((res) => {
        _this.setData({ showLoading: false });
      })
      .catch((err) => {
        console.log(err);
      });
    },
    getNotes(skip_count, old_data) {
      let _this = this;
      const db = wx.cloud.database();
      return new Promise((resolve, reject) => {
        db.collection('note').skip(skip_count).orderBy('time','desc').get()
        .then((res) => {
          _this.setData({
            notes: old_data.concat(res.data),
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
    }
  }
})
