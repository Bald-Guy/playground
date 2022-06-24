// components/reditor/note-card/index.js
const Draft_Handler = require("../../../../pages/note/draft-handler");
Component({
  options: {
    styleIsolation: 'isolated'
  },
  properties: {
    noteData: Object,
    noteIndex: Number
  },
  data: {
    time: String,
  },
  lifetimes: {
    attached: function() {
      let time = this.properties.noteData.time;
      let DATE = new Date(time);
      let year = DATE.getFullYear();
      let month = (DATE.getMonth() + 1) < 10 ? '0'+(DATE.getMonth() + 1) : (DATE.getMonth() + 1);
      let date = DATE.getDate() < 10 ? '0' + DATE.getDate() : DATE.getDate();
      let hour = DATE.getHours() < 10 ? '0' + DATE.getHours() : DATE.getHours();
      let minute = DATE.getMinutes() < 10 ? '0' + DATE.getMinutes() : DATE.getMinutes();
      let second = (DATE.getSeconds() + 1) < 10 ? '0'+DATE.getSeconds() : DATE.getSeconds();
      DATE = year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
      this.setData({ time: DATE });
    }
  },
  methods: {
    onTapCard: function() {
      let _this = this;
      console.log("去编辑该条笔记");
      let index = this.properties.noteIndex;
      let note_str = JSON.stringify(this.properties.noteData);
      wx.navigateTo({
        url: '/pages/note/note?scene=4&index=' + index.toString() + '&note=' + encodeURIComponent(note_str),
        events: {
          acceptDraftInS4: function(draft) {
            console.log(draft);
            Draft_Handler.saveDraftInS4(_this.data.noteData._id, draft);
          }
        }
      })
    },
    onClickMoreBtn: function() {
      let detail = { noteIndex: this.properties.noteIndex, noteData: this.properties.noteData };
      this.triggerEvent('more', detail);
    }
  }
})
