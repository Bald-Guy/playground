Component({
  options: {
    multipleSlots: true
  },
  properties: {
    hasMidTitle: Boolean,
    title: String,
    icon: String,
    background: String
  },
  data: {
    statusBarHeight: 0,
    navBarHeight: 0,
    lastTapTimeStamp: 0
  },
  lifetimes: {
    attached: function() {
      let systemInfo = wx.getSystemInfoSync();                        // 获取系统信息
      let menuButtonInfo = wx.getMenuButtonBoundingClientRect();      // 获取胶囊按钮位置信息
      let statusBarHeight = systemInfo.statusBarHeight;
      let navBarHeight = (menuButtonInfo.top - systemInfo.statusBarHeight) * 2 + menuButtonInfo.height;
      this.setData({
        statusBarHeight: statusBarHeight,
        navBarHeight: navBarHeight
      });
    }
  },
  methods: {
    onClickLeftBtn: function() {
      this.triggerEvent('click-left');
    },
    handleDoubleTap: function(e) {
      let currentTimeStamp = e.timeStamp
      if (currentTimeStamp - this.data.lastTapTimeStamp < 200) {
        clearTimeout(this._lastTapTimeoutFunc);
        //执行双击操作
        this.triggerEvent('double-tap');
	    } else {
        this._lastTapTimeoutFunc = setTimeout(() => {
        // 执行单击操作
        this.triggerEvent('single-tap');
		    }, 200);
	    }
      //更新点击时间
      this.setData({lastTapTimeStamp: currentTimeStamp})
    },
    _lastTapTimeoutFunc: function() {}
  }
})