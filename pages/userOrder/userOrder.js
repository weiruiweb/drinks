//logs.js
const util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
   isTrue:true,
   currentId:0,
  },
  onLoad: function () {
   this.setData({
     fonts:app.globalData.font
   })
  },
  great:function(){
    var isTrue = !this.data.isTrue
    console.log(isTrue)
    this.setData({
      isTrue:isTrue
    })
  },
  order_click:function(e){
    this.setData({
      currentId:e.currentTarget.dataset.id
    })
  }
})
