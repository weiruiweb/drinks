//logs.js
const util = require('../../utils/util.js')
const app = getApp()


Page({
  data: {
    isShow:false,
  },
  onLoad: function () {
    this.setData({
      fonts:app.globalData.font
    })
  },
 tel:function () {
    wx.makePhoneCall({
      phoneNumber: '15888888888',
    })
  },
 
  userCredit:function(){
    wx.navigateTo({
      url:'/pages/userCredit/userCredit'
    })
  },
  userMessage:function(){
    wx.navigateTo({
      url:'/pages/userMessage/userMessage'
    })
  },
  userGroup:function(){
    wx.navigateTo({
      url:'/pages/userGroup/userGroup'
    })
  },
  userContact:function(){
    wx.navigateTo({
      url:'/pages/userContact/userContact'
    })
  },
  address:function(){
    wx.navigateTo({
      url:'/pages/userAddress/userAddress'
    })
  }, 
  order:function(){
    wx.navigateTo({
      url:'/pages/userOrder/userOrder'
    })
  }, 
  
  userShare:function(){
    wx.navigateTo({
      url:'/pages/userShare/userShare'
    })
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
  userContact:function(){
    var isShow = !this.data.isShow;
    this.setData({
      isShow:isShow
    })
  },
  cancel:function(){
    this.setData({
      isShow:false
    })
  }
})
