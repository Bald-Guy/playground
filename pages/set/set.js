// pages/set/set.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bottomSafeHeight: 0,
    index: 0,
    systems: ['安卓','苹果']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let platform = getApp().globalData.platform;
    this.setData({
      index: platform == 'ios' ? 1 : 0,
      bottomSafeHeight: getApp().globalData.bottomSafeHeight,
    });
  },
  onClickBackBtn() {
    wx.navigateBack();
  },
  toSetAccount() {
    wx.navigateTo({
      url: '../account/account',
    })
  },
  setMobileSystem(e) {
    // 当前页面
    this.setData({ index: e.detail.value });
    let platforms = ['android','ios'];
    // 缓存
    wx.setStorage({
      key: 'platform',
      data: platforms[e.detail.value]
    })
    // globalData
    getApp().globalData.platform = platforms[e.detail.value];
  }
})