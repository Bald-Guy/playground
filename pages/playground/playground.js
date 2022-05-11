// pages/playground/playground.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    animationData: {},
    x: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  touchStrat(e) {
    console.log(e);
    console.log(e.changedTouches[0].pageX);
    this.setData({ x: e.changedTouches[0].pageX });
  },
  touchMove(e) {
    console.log(e);
    let x = e.changedTouches[0].pageX;
    let dif = x - this.data.x;
    let animation = wx.createAnimation({
      delay: 400,
      timingFunction: 'linear'
    })
    animation.left(dif).step();
    this.setData({
      animationData: animation.export()
    });
  },
  touchEnd(e) {
    console.log(e);
  },
  tap() {
    console.log("点击");
  }
})