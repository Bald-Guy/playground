// components/reditor/reditor-scroll-view/index.js
const db = wx.cloud.database();
const notesCollection = db.collection('note');
Component({
  options: {
    multipleSlots: true 
  },
  properties: {
    scrollViewHeight: Number,
    scrollTop: Number,
    triggered: Boolean,
    enabled: Boolean,
    showLoading: Boolean,
    emptyBlockHeight: Number
  },
  data: {
    showLoading: false
  },
  methods: {
    onPulling(e) {
      this.triggerEvent('on-pulling');
    },
    onRefresh(e) {
      this.triggerEvent('on-refresh');
    },
    onRestore(e) {
      this.triggerEvent('on-restore');
    },
    onAbort(e) {
      this.triggerEvent('on-abort');
    },
    reachBottom(e) {
      this.triggerEvent('reach-bottom');
    }
  }
})
