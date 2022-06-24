const Text_Handler = require('./text-handler');
const Database = require("../../utils/database");
// 通过返回按钮和保存按钮返回笔记列表页（弃用）
function backToIndexPageByBtn() {
  let pages = getCurrentPages();
  let indexPage = pages[0]; // 笔记列表页
  indexPage.setData({
    canSaveDraft_a: false
  })
}
// 通过右滑或其它方式返回笔记列表页（弃用）
function backToIndexPageByOther(draft) {
  let pages = getCurrentPages();
  let indexPage = pages[0]; // 笔记列表页
  indexPage.setData({
    canSaveDraft_b: true,
    draft: draft
  })
}
// 保存草稿（弃用）
function saveDraft(draftData) {
  switch(draftData.scene) {
    case 3:
      saveDraftInS3(draftData);
      break;
    case 4:
      saveDraftInS4(draftData);
      break;
    default: break;
  }
}
// 在添加新笔记场景下保存草稿
function saveDraftInS3(draft) {
  if(Text_Handler.checkSpace(draft.title) && Text_Handler.checkSpace(draft.body)) {
    // 内容为空，不必保存
  }else {
    wx.setStorage({
      key: 'draft',
      data: draft
    })
  }
}
// 在编辑旧笔记场景下保存草稿
function saveDraftInS4(noteId, draft) {
  if(Text_Handler.checkSpace(draft.title) && Text_Handler.checkSpace(draft.body)) {
    // 内容为空，不必保存
  }else {
    Database.updateData('note', noteId, {draft: draft})
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
  }
}
// 在添加新笔记场景下检查是否有草稿
function checkDraftInS3() {
  let _this = getCurrentPages()[1];
  wx.getStorage({
    key: 'draft',
    success(res) {
      _this.setData({ showDraftDialog: true })  // 展示弹出框
    },
    fail(err) {

    }
  }) 
}
// 在编辑旧笔记场景下检查是否有草稿
function checkDraftInS4(noteId) {
  let _this = getCurrentPages()[1];
  const db = wx.cloud.database();
  db.collection('note').doc(noteId).get().then(res => {
    console.log(res);
    if(res.data.draft) {
      _this.setData({ 
        showDraftDialog: true,
        draft: res.data.draft
      })  // 展示弹出框
    }else {
      
    }
  })
}
// 继续编辑草稿
function continueEdit() {
  let _this = getCurrentPages()[1];
  switch(_this.data.scene) {
    case 3:
      continueEditInS3(_this);
      break;
    case 4:
      continueEditInS4(_this);
      break;
    default:
      break;
  }
}
// 在添加新笔记场景下选择【继续编辑】草稿
function continueEditInS3(_this) {
  let draft = wx.getStorageSync('draft');
  _this.setData({
    titleText: draft.title,
    bodyText: draft.body,
    showDraftDialog: false
  })
}
// 在编辑旧笔记场景下选择【继续编辑】草稿
function continueEditInS4(_this) {
  let draft = _this.data.draft;
  _this.setData({
    titleText: draft.title,
    bodyText: draft.body,
    showDraftDialog: false
  });
}
// 丢弃草稿
function discardDraft() {
  let _this = getCurrentPages()[1];
  switch(_this.data.scene) {
    case 3:
      discardDraftInS3(_this);
      break;
    case 4:
      discardDraftInS4(_this);
      break;
    default:
      break;
  }
}
// 在添加新笔记场景下选择【丢弃草稿】
function discardDraftInS3(_this) {
  _this.setData({ showDraftDialog: false });
  deleteDraftInS3();
}
// 在编辑旧笔记场景下选择【丢弃草稿】
function discardDraftInS4(_this) {
  _this.setData({ showDraftDialog: false });
  deleteDraftInS4();
}
// 在添加新笔记场景下删除草稿
function deleteDraftInS3() {
  wx.removeStorage({             
    key: 'draft',
    success (res) {
      console.log(res)
    }
  })
}
// 在编辑旧笔记场景下删除草稿
function deleteDraftInS4() {
  let _this = getCurrentPages()[1];
  console.log(_this.data);
  const db = wx.cloud.database();
  const notesCollection = db.collection('note');
  const _ = db.command;
  notesCollection.doc(_this.data.noteId).update({
    data: {
      draft: _.remove()
    }
  })
}


// module.exports.backToIndexPageByBtn = backToIndexPageByBtn;
// module.exports.backToIndexPageByOther = backToIndexPageByOther;
// module.exports.saveDraft = saveDraft;
module.exports.saveDraftInS3 = saveDraftInS3;
module.exports.saveDraftInS4 = saveDraftInS4;
module.exports.checkDraftInS3 = checkDraftInS3;
module.exports.checkDraftInS4 = checkDraftInS4;
module.exports.continueEdit = continueEdit;
module.exports.discardDraft = discardDraft;
module.exports.deleteDraftInS3 = deleteDraftInS3;
module.exports.deleteDraftInS4 = deleteDraftInS4;