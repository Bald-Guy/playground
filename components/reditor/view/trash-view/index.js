// components/reditor/trash-view/index.js
Component({
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
    trashs: [],
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
      if(e.detail.trigger == 'restore') {
        this.triggerEvent('restore');
      }
    },
    onClickMoreBtn(e) {
      let trashIndex = e.detail.trashIndex;
      let trashData = e.detail.trashData;
      this.setData({
        showActionSheet: true,
        trashIndex: trashIndex,       // 暂时用不到
        trashData: trashData, 
      })
    },
    onRefresh() {
      let _this = this;
      let count = 0;
      let old_data = [];
      _this.getTrashs(count, old_data)
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
      let old_data = _this.data.trashs;
      _this.setData({ showLoading: true });
      _this.getTrashs(count, old_data)
      .then((res) => {
        _this.setData({ showLoading: false });
      })
      .catch((err) => {
        console.log(err);
      });
    },
    getTrashs(skip_count, old_data) {
      let _this = this;
      const db = wx.cloud.database();
      return new Promise((resolve, reject) => {
        db.collection('trash').skip(skip_count).orderBy('time','desc').get()
        .then((res) => {
          _this.setData({
            trashs: old_data.concat(res.data),
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
