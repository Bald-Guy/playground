// pages/preview/preview.js
const Storage = require('../../utils/storage');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    note: {},
    swiperWidth: 0,
    swiperHeight: 0,
    avatarUrl: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let note_str = decodeURIComponent(options.note);
    console.log(note_str)
    let note = JSON.parse(note_str);
    console.log(note.body);
    this.setData({
      note: note
    })
    this.setUIParm();
  },
  setUIParm() {
    let app = getApp();
    let _this = this;
    let systemInfo = wx.getSystemInfoSync();
    this.setData({
      swiperWidth: systemInfo.windowWidth,
      swiperHeight: systemInfo.windowWidth * 4/3 + 30
    });
    Storage.getStorage('userInfo').then((userInfo)=>{
      _this.setData({ avatarUrl: userInfo.avatarUrl });
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})