//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
  currentId:0,
  
  },
  
  onLoad: function () {
    this.setData({
        isHidden: false,
        fonts:app.globalData.font
    });
  },
  order_status:function(e){
    var current = e.currentTarget.dataset.id
    this.setData({
      currentId:current
    })
  },
 
  bindTimeChange: function(e) {
    
  },
})
