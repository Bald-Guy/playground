// components/reditor/action-sheet/trash-action-sheet/index.js
const Database = require("../../../../utils/database");
const Toast = require("../../../../utils/toast");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    trashIndex: Number,
    trashData: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    actions: [{name: '恢复'}, {name: '彻底删除'}],  
    showDeleteDialog: false,    // 控制删除笔记弹出框的显示&隐藏
  },

  /**
   * 组件的方法列表
   */
  methods: {
    selectAction(e) {
      let _this = this;
      let action = e.detail.name;
      switch(action) {
        case '恢复':
          _this.selectRestoreAction();
          break;
        case '彻底删除':
          _this.selectDeleteAction();
        default: break;
      }
    },
    selectRestoreAction() {
      // 添加进note表中，再从trash表中删除
      this.addNote().then((res) => {
        this.deleteTrash().then((res) => {
          this.triggerEvent('need-refresh', {needRefresh: true, trigger: 'restore'});
        })
      });
    },
    selectDeleteAction() {
      this.setData({ showDeleteDialog: true})
    },
    cancelAction() {
      this.setData({ show: false })
    },
    onCloseActionSheet() {
      this.setData({ show: false })
    },

    // 删除相关
    onCloseDeleteDialog() {
      this.setData({ showDeleteDialog: false });
    },
    cancelDelete() {
      this.setData({ showDeleteDialog: false });
    },
    confirmDelete() {
      this.deleteTrash().then((res) => {
        this.triggerEvent('need-refresh', {needRefresh: true});
      });
    },

    // 数据库操作相关
    deleteTrash() {
      let id = this.properties.trashData._id;
      return new Promise((resolve, reject) => {
        Database.deleteData('trash', id)
        .then((res) => {
          console.log(res);
          resolve(res);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
      });
    },
    addNote() {
      let trash = this.properties.trashData;
      let data = {
        title: trash.title,
        body: trash.body,
        time: trash.time,
        belong: trash.belong || ''
      }
      return new Promise((resolve, reject) => {
        Database.addData('note', data)
        .then((res) => {
          console.log(res);
          resolve(res);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
      });
    }
  }
})
