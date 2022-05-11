// index.js
const Storage = require('../../utils/storage');
Page({
  data: {
    statusBarHeight: 0, 
    navBarHeight: 0, 
    menuLeft: 0, 
    bottomSafeHeight: 0,
    scrollViewHeight: 0,      // 滑动区域高度
    userInfoContainerTop: 0,  // 用户信息区域上边距
    showMenu: false,
    showNoteDialog: false,
    showGroupDialog: false,
    showActionSheet: false,
    actions: [
      {
        name: '编辑',
      },
      {
        name: '删除',
      },
    ],
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
  },
  onLoad(){
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    this.setUIParm();
  },
  setUIParm() {
    let app = getApp();
    this.setData({
      statusBarHeight: app.globalData.statusBarHeight,
      navBarHeight: app.globalData.navBarHeight,
      scrollViewHeight: app.globalData.contentViewHeight,
      bottomSafeHeight: app.globalData.bottomSafeHeight,
      menuLeft: app.globalData.menuLeft,
      userInfoContainerTop: wx.getMenuButtonBoundingClientRect().top + app.globalData.menuHeight / 2      
    });
  },
  onShow() {
    this.getEmojiGroupList();
    this.getNoteList();
  },
  openMenu() {
    this.setData({ showMenu: true });
  },
  onCloseMenu() {
    this.setData({ showMenu: false });
  },
  onClickDeleteNoteBtn(e) {
    this.setData({ 
      showNoteDialog: true,
      noteIdx: e.currentTarget.dataset.idx
   });
  },
  confirmDeleteNote(e) {
    let _this = this;
    let index = _this.data.noteIdx;
    let notelist = _this.data.notelist;
    notelist.splice(index, 1);
    Storage.setStorage('notelist', notelist);
    _this.setData({ notelist: notelist });
  },
  onClickMoreBtn(e) {
    let index = e.currentTarget.dataset.idx;
    let group = e.currentTarget.dataset.group;
    this.setData({ 
      showActionSheet: true,
      groupIdx: index,
      group: group
    });
  },
  selectAction(e) {
    console.log(e);
    let _this = this;
    let action = e.detail.name;
    let group = _this.data.group;
    switch (action) {
      case "编辑":
        console.log("用户点击了编辑");
        _this.toEditEmojiGroup(group);
        break;
      case "删除":
        console.log("用户点击了删除");
        _this.toDeleteEmojiGroup();
        break;
    }
  },
  toEditEmojiGroup(group) {
    let index = this.data.groupIdx;
    let group_str = JSON.stringify(group);
    wx.navigateTo({
      url: '/pages/emoji/emoji?scene=2&index='+ index.toString() + '&group=' + encodeURIComponent(group_str),
    })
  },
  toDeleteEmojiGroup() {
    this.setData({ showGroupDialog: true });
  },
  confirmDeleteGroup() {
    let _this = this;
    let index = _this.data.groupIdx;
    let grouplist = _this.data.grouplist;
    grouplist.splice(index, 1);
    Storage.setStorage('grouplist', grouplist);
    _this.setData({ grouplist: grouplist });
  },
  cancelAction() {
    this.setData({ showActionSheet: false });
  },
  onClickAddGroupBtn() {
    wx.navigateTo({
      url: '/pages/emoji/emoji?scene=1',
    })
  },
  addNewNote() {
    wx.navigateTo({
      url: '../note/note?scene=3',
    })
  },
  toEditNote(e) {
    console.log("去编辑该条笔记");
    let index = e.currentTarget.dataset.idx;
    let note_str = JSON.stringify(e.currentTarget.dataset.note);
    wx.navigateTo({
      url: '../note/note?scene=4&index=' + index.toString() + '&note=' + encodeURIComponent(note_str),
    })
  },
  onCloseActionSheet() {
    this.setData({ showActionSheet: false });
  },
  getEmojiGroupList() {
    let _this = this;
    Storage.getGroupList().then((grouplist)=>{
      _this.setData({ grouplist: grouplist });
    })
  },
  getNoteList() {
    let _this = this;
    Storage.getNoteList().then((notelist)=>{
      _this.setData({ notelist: notelist });
    })
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        Storage.setStorage('userInfo', res.userInfo);
        Storage.setStorage('hasUserInfo', true);
      }
    })
  },
})
