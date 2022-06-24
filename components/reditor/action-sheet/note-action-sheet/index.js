// components/reditor/action-sheet/note-action-sheet/index.js
const db = wx.cloud.database();
const _ = db.command;
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
    noteIndex: Number,
    noteData: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    actions: [{name: '移动至'}, {name: '删除'}], 
    showDeleteDialog: false,    // 控制删除笔记弹出框的显示&隐藏
    showMoveDialog: false,    // 控制移动笔记的弹出框的显示&隐藏
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 选择
    selectAction(e) {
      let _this = this;
      let action = e.detail.name;
      switch(action) {
        case '移动至':
          _this.selectMoveAction();
          break;
        case '删除':
          _this.selectDeleteAction();
          break; 
        default: break;
      }
    },
    selectMoveAction() {
      this.getAvailableGroups();
      this.setData({ showMoveDialog: true})
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
      // 从 note 表中删除, 然后放入废纸篓
      this.deleteNote(this.data.noteData._id).then((res) => {
        this.addTrash().then((res) => {
          this.triggerEvent('need-refresh', {needRefresh: true, trigger: 'delete'});
        })
      });
    },

    // 移动相关
    onCloseMoveDialog() {
      this.setData({ showMoveDialog: false });
    },
    cancelMove() {
      this.setData({ showMoveDialog: false });
    },
    confirmMove(e) {
      let _this = this;
      Database.updateData('note', _this.data.noteData._id, {belong: e.currentTarget.dataset.group._id})
      .then((res) => {
        Toast.showSuccess('移动成功');
        _this.onCloseMoveDialog();
        this.triggerEvent('need-refresh', {needRefresh: true});
      })
      .catch((err) => {
        console.log(err);
      });
    },

    // 数据库操作相关
    getAvailableGroups() {
      let _this = this;
      // 获取除该笔记所在分组之外的所有笔记分组，以供移动
      let belong = this.data.noteData.belong || '';
      db.collection('note_group').where({
        _id: _.not(_.eq(belong))
      }).get().then(res => {
        _this.setData({
          note_groups: res.data
        })
      }).catch(err => {
        console.log(err);
      })
    },
    addTrash() {
      let _this = this;
      let {title, body, time, belong} = _this.data.noteData;
      let data = {
        title: title,
        body: body,
        time: time,
        belong: belong,
        delete_time: new Date().getTime()
      };
      return new Promise((resolve, reject) => {
        Database.addData('trash', data)
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
    deleteNote(noteId) {
      return new Promise((resolve, reject) => {
        Database.deleteData('note', noteId)
        .then((res) => {
          console.log(res);
          resolve(res);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
          console.log("删除失败");
          Toast.showError('网络开小差了');
        });
      });
    },
  }
})
