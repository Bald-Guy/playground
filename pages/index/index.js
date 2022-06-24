// index.js
const Draft_Handler = require("../note/draft-handler");
Component({
  data: {
    currentPage: 1,           // 当前显示页面，1笔记列表页；2搜索页；3废纸篓
    hasMidTitle: false,       // 导航栏中间显示 Logo 还是 title
    bottomSafeHeight: 0,      // 底部安全高度
    scrollViewHeight: 0,      // 滑动区域高度
    scrollTop: 0,             // 控制滑动条位置
    showMenu: false,          // 控制侧边栏的显示&隐藏
    draft: {},                // 接受从笔记编辑页面的草稿
    needRefresh: false,
    needRefresh_note: false,
    needRefresh_search: false,
    needRefresh_trash: false,
    needRefresh_group: false,
  },
  methods: {
    onLoad(){
      let _this = this;
      console.log("笔记列表页面加载");
      this.setUIParm();
      this.setData({
        needRefresh: true,
        needRefresh_trash: true
      });
    },
    onShow() {
     
    },
    // 设置页面元素尺寸
    setUIParm() {
      const app = getApp();
      this.setData({
        bottomSafeHeight: app.globalData.bottomSafeHeight,
        scrollViewHeight: app.globalData.contentViewHeight - app.globalData.bottomSafeHeight,   
      });
    },
    // 打开侧边栏
    openSideBar() {
      this.setData({ showMenu: true });
    },
    onCloseMenu() {
      this.setData({ showMenu: false });
    },
    // 点击添加笔记按钮
    onClickAddNoteBtn() {
      let currentPage = this.data.currentPage;
      let selectedGroup_id = '';
      if(currentPage == 1) {
        
      }
      if(currentPage == -1) {
        selectedGroup_id = this.data.selectedGroup_id
      }
      wx.navigateTo({
        url: '../note/note?scene=3&belong=' + selectedGroup_id,
        events: {
          acceptDraftInS3: function(draft) {
            console.log(draft);
            Draft_Handler.saveDraftInS3(draft);
          }
        }
      })
    },
    scrollToTop() {
      console.log('双击标题栏');
      this.setData({scrollTop: 0})
    },
    onShareAppMessage() {

    },
    switchToListPage() {
      this.selectComponent('#side-bar');  // 这行代码是为了修改currentNoteGroup为-1，避免UI上出现两个被选状态同时出现
      this.setData({ 
        currentPage: 1,
        showMenu: false
      });
    },
    switchToSearchPage() {
      this.selectComponent('#side-bar');
      this.selectComponent('#search-view');
      this.setData({ 
        currentPage: 2,
        showMenu: false,     
      });
    },
    switchToTrashPage() {
      this.selectComponent('#side-bar');
      this.setData({ 
        currentPage: 3,
        showMenu: false 
      });
    },
    switchToNoteGroup(e) {
      console.log(e);
      this.setData({ 
        selectedGroup_id: e.detail.note_group._id,
        pageTitle: e.detail.note_group.name,
        currentPage: -1,
        showMenu: false 
      });
    },
    renameGroup(e) {
      console.log(e);
      this.setData({ 
        pageTitle: e.detail.new_name,
      });
    },
    needRefreshTrash() {
      this.setData({
        needRefresh_trash: true
      })
    },
    needRefreshNote() {
      this.setData({
        needRefresh_note: true
      })
    }
  },
 
  // 数据监听器
  observers: {
    'currentPage': function(currentPage) {
      // 不同的页面展示不同的标题
      switch(currentPage) {
        case -1:
          this.setData({
            hasMidTitle: true,
          })
          break;
        case 1:
          this.setData({
            hasMidTitle: false,
          })
          break;
        case 2:
          this.setData({
            hasMidTitle: true,
            pageTitle: '搜索笔记',
          })
          break;
        case 3:
          this.setData({
            hasMidTitle: true,
            pageTitle: '废纸篓',
          })
        default: break;
      }
    },
    'needRefresh': function(needRefresh) {
      if(needRefresh) {
        let currentPage = this.data.currentPage;
        switch(currentPage) {
          case 1:
            this.setData({
              needRefresh_note: true
            });
            break;
          case -1:
            this.setData({
              needRefresh_note: true,
              needRefresh_group: true
            });
            break;
          case 2:
            this.setData({
              needRefresh_note: true,
              needRefresh_search: true
            });
            break;
          default: break;
        }
      }
      
    }
  }
})
