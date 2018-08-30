//logs.js
const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    logs: []
  },
  onLoad: function () {
     this.setData({
          isHidden: false,
          fonts:app.globalData.font
        });
  },
  sort:function(){
     wx.redirectTo({
      url:'/pages/about/about'
    })
  },
  index:function(){
     wx.redirectTo({
      url:'/pages/index/index'
    })
  },
  User:function(){
     wx.redirectTo({
      url:'/pages/User/user'
    })
  },
  detail:function(){
     wx.navigateTo({
      url:'/pages/detail/detail'
    })
  }
})
