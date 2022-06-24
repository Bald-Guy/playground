// components/reditor/side-bar/index.js
const Text_Handler = require('../../../pages/note/text-handler');
const db = wx.cloud.database();
const userCollection = db.collection('user');
Component({
  behaviors: ['wx://component-export'],
  export() {
    this.setData({currentNoteGroup: -1})
    // return { myField: 'myValue' }
  },
  properties: {
    showMenu: Boolean,
    currentPage: Number,
  },
  data: {
    statusBarHeight: 0,       // 状态栏高度
    navBarHeight: 0,          // 导航栏高度
    bottomSafeHeight: 0,      // 底部安全高度
    sideBarWidth: 0,          // 侧边栏宽度
    scrollViewHeight: 0,
    nickname: '红薯宝宝',
    showDialog: false,
    showActionSheet: false,
    showGroupDialog: false,
    actions: [{name: '重命名'}, {name: '删除'}], 
    handleGroupScene: 'add',  // 场景：新增 or 重命名
    groupName: '',
    isValidGroupName: false,
    note_group: [],
    currentNoteGroup: -1,
  },
  lifetimes: {
    attached: function() {
      this.setUIParm();
      this.getNickname();
      this.getNoteGroups();
    },
  },
  pageLifetimes: {
    show: function() {
      // 页面被展示
      this.getNickname();
    },
    hide: function() {
      // 页面被隐藏
    },
    resize: function(size) {
      // 页面尺寸变化
    }
  },
  methods: {
    setUIParm() {
      const app = getApp();
      this.setData({
        statusBarHeight: app.globalData.statusBarHeight,
        navBarHeight: app.globalData.navBarHeight,
        scrollViewHeight: app.globalData.contentViewHeight - app.globalData.bottomSafeHeight - app.globalData.statusBarHeight - app.globalData.navBarHeight, 
        bottomSafeHeight: app.globalData.bottomSafeHeight,
        sideBarWidth: app.globalData.menuLeft - 20,     
      });
    },
    getNickname() {
      let _this = this;
      wx.getStorage({
        key: 'nickname',
        success(res) {
          _this.setData({nickname: res.data})
        },
        fail(err){
          userCollection.get().then(res => {
            _this.setData({nickname: res.data[0].nickname})
          })  
        }
      })
    },
    getNoteGroups() {
      let _this = this;
      db.collection('note_group').get().then(res => {
        console.log(res.data);
        _this.setData({note_group: res.data})
      })
      .catch(err => {
        console.log(err);
      })
    },
    navigateToSetPage() {
      wx.navigateTo({
        url: '/pages/set/set',
      })
    },
    switchToListPage() {
      this.triggerEvent('switchToListPage',{})
    },
    switchToSearchPage() {
      this.triggerEvent('switchToSearchPage',{})
    },
    switchToTrashPage() {
      this.triggerEvent('switchToTrashPage',{})
    },
    onCloseSideBar() {
      this.triggerEvent('close',{})
    },
    // 新建笔记分组
    newNoteGroup() {
      this.setData({
        showDialog: true,
        handleGroupScene: 'add'
      })
    },
    onCloseDialog() {
      this.setData({showDialog: false})
    },
    onCloseActionSheet() {
      this.setData({showActionSheet: false})
    },
    noteGroupNameInput(e) {
      console.log(e.detail.value);
      this.setData({groupName: e.detail.value})
    },
    // 往数据库中添加&重命名一个分组 
    saveNoteGroup() {
      let _this = this;
      if(this.data.isValidGroupName) {
        let name = this.data.groupName;
        switch(this.data.handleGroupScene) {
          case 'add':
            db.collection('note_group').add({
              data: {
                name: name,
                child: '',
                father: ''
              }
            })
            .then(res => {
              _this.setData({ 
                showDialog: false,
                groupName: ''
              })
              _this.getNoteGroups();
              wx.showToast({
                title: '保存成功',
                icon: 'none',
                duration: 1000
              })
            })
            .catch(console.error)
            break;
          case 'rename':
            let group = _this.data.note_group[_this.data.currentNoteGroup];
            db.collection('note_group').doc(group._id).update({
              data: {
                name: _this.data.groupName
              }
            }).then(res => {
              // HACK
              _this.triggerEvent('rename', {new_name: _this.data.groupName})
              _this.setData({ 
                showDialog: false,
                groupName: ''
              })
              _this.getNoteGroups();
              wx.showToast({
                title: '保存成功',
                icon: 'none',
                duration: 1000
              })
            }).catch(err => {
              console.log(err);
            })
            break;
          default: break;
        }
      }
    },
    cancelNewNoteGroup() {
      this.setData({
        showDialog: false,
        groupName: ''
      })
    },
    switchToNoteGroup(e) {
      console.log(e);
      this.setData({ currentNoteGroup: e.currentTarget.dataset.index })
      this.triggerEvent('tap-group',{note_group: e.currentTarget.dataset.group})
    },
    onClickEditGroupBtn() {
      this.setData({showActionSheet: true})
    },
    selectAction(e) {
      let _this = this;
      let action = e.detail.name;
      switch(action) {
        case '重命名':
          _this.renameGroup();
          break;
        case '删除':
          _this.deleteGroup();
          break; 
        default: break;
      }
    },
    renameGroup() {
      let group_index = this.data.currentNoteGroup;
      this.setData({
        showDialog: true,
        groupName: this.data.note_group[group_index].name,
        handleGroupScene: 'rename'
      })
    },
    deleteGroup() {
      this.setData({
        showGroupDialog: true
      })
    },
    cancelAction() {
      this.setData({
        showActionSheet: false
      })
    },
    confirmDeleteGroup() {
      let _this = this;
      let group = _this.data.note_group[_this.data.currentNoteGroup];
      db.collection('note_group').doc(group._id).remove()
      .then(res => {
        _this.setData({ showGroupDialog: false })
        _this.getNoteGroups();
        _this.switchToListPage();
        wx.showToast({
          title: '删除成功',
          icon: 'none',
          duration: 1000
        })
      }).catch(err => {
        console.log(err);
      })
    },
    cancelDeleteGroup() {
      this.setData({
        showGroupDialog: false
      })
    },
    onGroupDialogClose() {
      this.setData({
        showGroupDialog: false
      })
    }
  },
  observers: {
    'groupName': function(name) {
      if(Text_Handler.checkSpace(name)){
        this.setData({isValidGroupName: false});
      }else {
        this.setData({isValidGroupName: true});
      }
    }
  }
})

