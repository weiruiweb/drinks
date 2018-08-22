//logs.js
const util = require('../../utils/util.js')
const app = getApp()


Page({
  data: {
    
  },
  onLoad: function () {
    this.setData({
      fonts:app.globalData.font
    })
  },
  userPayment:function(){
    wx.navigateTo({
      url:'/pages/userPayment/userPayment'
    })
  },
   userChongzhi:function(){
    wx.navigateTo({
      url:'/pages/userChongzhi/userChongzhi'
    })
  }, 
  userGroup:function(){
    wx.navigateTo({
      url:'/pages/userGroup/userGroup'
    })
  },
  discount:function(){
    wx.navigateTo({
      url:'/pages/userDiscount/userDiscount'
    })
  },
  address:function(){
    wx.navigateTo({
      url:'/pages/userAddress/userAddress'
    })
  }, 
  userOrder:function(){
    wx.navigateTo({
      url:'/pages/userOrder/userOrder'
    })
  }, 
  
  userComment:function(){
    wx.navigateTo({
      url:'/pages/userComment/userComment'
    })
  }, 
  userTakeOut:function(){
    wx.navigateTo({
      url:'/pages/userTake/userTake'
    })
  },
 

   sort:function(){
     wx.redirectTo({
      url:'/pages/Dishes/dishes'
    })
  },
  index:function(){
     wx.redirectTo({
      url:'/pages/Index/index'
    })
  },
  User:function(){
     wx.redirectTo({
      url:'/pages/User/user'
    })
  }
})
