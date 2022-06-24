// components/reditor/search-bar/search-bar.js
const Text_Handler = require("../../../pages/note/text-handler");
Component({

  properties: {
    focus: Boolean,
    value: String
  },

  data: {

  },
  methods: {
    onChange(e) {
      this.properties.value = e.detail;
    },
    clear() {
      
    },
    search(e) {
      let key = e.detail;
      if(Text_Handler.checkSpace(key)) {
        console.log("搜索词为空");
      }else{
        console.log(key);
        this.triggerEvent('search', {key: key});
      }
    }
  }
})
