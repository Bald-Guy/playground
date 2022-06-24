const filter = require("./sunday");
const Extract = require("./extract")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text:'',
    ke: []
  },
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
    }).exec()
  },

  textInput(e) {
    console.log(e);
    this.setData({ text: e.detail.value });
  },
  textBlur(e) {
    this.setData({ text: e.detail.value });
    // this.editorCtx.format('background-color','#cccccc');
  },
  empty() {
    this.setData({ 
      text: '',
      ke: []
    });
  },
  // filter() {
  //   this.editorCtx.setContents({
  //     html: '<span style="background-color:#cccccc;">H</span><span style="background-color:#cccccc;">e</span><span style="background-color:#cccccc;">l</span><span style="background-color:#cccccc;">l</span><span style="background-color:#cccccc;">o</span><span>world</span>',
  //     success: (res) => {
  //       console.log(res);
  //     },
  //     fail: (err) => {
  //       console.log(err);
  //     }
  //   })
  // },
  extract() {
    let _this = this;
    Extract.postRequest(this.data.text).then((res) => {
      if(res.data.code == '0') {
        _this.setData({
          ke: res.data.ke
        })
      }else {
        wx.showToast({
          title: '提取失败',
          icon: 'error'
        })
      }
    }).catch((err) => {
      wx.showToast({
        title: '提取失败',
        icon: 'error'
      })
    });
  },
  // getText() {
  //   let that = this;
  //   this.editorCtx.getContents({
  //     success:(res)=>{
  //       console.log(res)
  //       that.setData({text: res.text})
  //     },
  //     fail:(err) =>{
  //       console.log(err);
  //     }
  //   })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})