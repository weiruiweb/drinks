//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    background: ['/images/banner1.jpg', '/images/banner1.jpg', '/images/banner1.jpg'],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    currentId:0,
    isChoose:0,
    
  },
  //事件处理函数
 
  onLoad: function () {
     this.setData({
          isHidden: false,
          fonts:app.globalData.font
        });
        var that = this;
        setTimeout(function(){
          that.setData({
              isHidden: true
          });
         
        }, 2000);
  },
  
  
  sort:function(){
     wx.redirectTo({
      url:'/pages/about/about'
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
  },
  indexRegular:function(){
     wx.navigateTo({
      url:'/pages/indexRegular/indexRegular'
    })
  }, 
  orderComfirm:function(){
     wx.navigateTo({
      url:'/pages/confirmOrder/confirmOrder'
    })
  },
  click_this:function(e){

    this.setData({
      currentId:e.currentTarget.dataset.id
    })
  },
  close:function(){
    // var isShow == !this.data.isShow
    this.setData({
      isShow:true
    })
  },
  changeTab:function(e){
    var isChoose= e.currentTarget.dataset.id
    this.setData({
      isChoose:isChoose
    })
  }
 
})

  