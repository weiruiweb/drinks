//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    isChoose:1,
  },
  
  onLoad: function () {
   
  },
  userInfo:function(){
    wx.navigateTo({
      url:'/pages/userInfo/userInfo'
    })
  },
   bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
 
  newAddress:function(){
    wx.navigateTo({
      url:'/pages/newAddress/newAddress'
    })
  },
  discount:function(){
    wx.navigateTo({
      url:'/pages/discount/discount'
    })
  },
  choosePay:function(e){
    this.setData({
      isChoose:e.currentTarget.dataset.id
    })
  }
})
