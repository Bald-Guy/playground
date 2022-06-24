// app.js
const Storage = require("./utils/storage");
const Database = require("./utils/database");
const Check = require('./utils/check');
App({
  globalData: {
    statusBarHeight: 0,   // 状态栏高度
    navBarHeight: 0,      // 导航栏高度 = 状态栏到胶囊的间距（胶囊距上距离-状态栏高度）* 2 + 胶囊高度
    menuLeft: 0,          // 胶囊距左方间距
    menuRight: 0,         // 胶囊距右方间距（保持左、右间距一致）
    menuBottom: 0,        // 胶囊距底部间距（保持顶部、底部间距一致）
    menuHeight: 0,        // 胶囊高度（自定义内容可与胶囊高度保证一致）
    contentViewHeight: 0, // 自定义内容区域高度
    bottomSafeHeight: 0,  // 底部安全区高度（底部小黑条）
    platform: 'android'   // 运行小程序的系统，默认设置为安卓
  },
  onLaunch() {
    // 版本自动更新代码
    Check.checkUpdateVersion()
    wx.cloud.init({ env: 'release-2gbkcl3s784da908' });                // 初始化云环境
    let systemInfo = wx.getSystemInfoSync();                        // 获取系统信息
    let menuButtonInfo = wx.getMenuButtonBoundingClientRect();      // 获取胶囊按钮位置信息
    this.globalData.statusBarHeight = systemInfo.statusBarHeight;
    this.globalData.navBarHeight = (menuButtonInfo.top - systemInfo.statusBarHeight) * 2 + menuButtonInfo.height;
    this.globalData.menuLeft = menuButtonInfo.left;
    this.globalData.menuRight = systemInfo.screenWidth - menuButtonInfo.right;
    this.globalData.menuBottom = menuButtonInfo.top - systemInfo.statusBarHeight;
    this.globalData.menuHeight = menuButtonInfo.height;
    this.globalData.contentViewHeight = systemInfo.windowHeight - this.globalData.navBarHeight - systemInfo.statusBarHeight;
    this.globalData.bottomSafeHeight = systemInfo.screenHeight - systemInfo.safeArea.bottom;
    this.setPlatformStorage(systemInfo.platform);
    this.userLogin();
    this.deleteTrash();
  },
  setPlatformStorage(platform) {
    let _this = this;
    wx.getStorage({
      key: 'platform',
      success(res) {
        _this.globalData.platform = res.data;
      },
      fail(err){
        wx.setStorage({
          key: 'platform',
          data: platform
        })
        _this.globalData.platform = platform;
      }
    })
  },
  userLogin() {
    wx.cloud.callFunction({
      name: 'login',
      data: {
      },
      success: function(res) {
        console.log("用户注册", res)
        Storage.setStorage('userid', res.result.openid);
        Database.isRegister(res.result.openid);
      },
      fail: function(err) {
        console.log(err);
      }
    })
  },
  deleteTrash() {
    wx.cloud.callFunction({
      name: 'deleteTrash'
    }).then(res => {
      console.log(res)
    })
  },
})
