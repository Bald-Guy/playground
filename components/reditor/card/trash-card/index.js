// components/reditor/note-card/index.js
Component({
  options: {
    styleIsolation: 'isolated'
  },
  properties: {
    trashData: Object,
    trashIndex: Number
  },
  data: {
    delete_time: String
  },
  lifetimes: {
    attached: function() {
      let delete_time = this.properties.trashData.delete_time;
      let d = new Date(delete_time);
      let year = d.getFullYear();
      let month = (d.getMonth() + 1) < 10 ? '0'+(d.getMonth() + 1) : (d.getMonth() + 1);
      let ri = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
      let hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
      let minute = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
      let second = (d.getSeconds() + 1) < 10 ? '0'+d.getSeconds() : d.getSeconds();
      d = year + '-' + month + '-' + ri + ' ' + hour + ':' + minute + ':' + second;
      this.setData({ delete_time: d });
    }
  },
  methods: {
    onClickMoreBtn(e) {
      let detail = { trashIndex: this.properties.trashIndex, trashData: this.properties.trashData };
      this.triggerEvent('more', detail);
    }
  }
})
