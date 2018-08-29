//index.js
//获取应用实例
const app = getApp()

Page({
  data: {

    currentId:0,
    text: '这是一条会滚动的文字滚来滚去的文字跑马灯，哈哈哈哈哈哈哈哈',
    marqueePace: 0.5,//滚动速度
    marqueeDistance: 0,//初始滚动距离
    marqueeDistance2: 0,
    marquee2copy_status: false,
    marquee2_margin: 60,
    size: 14,
    orientation: 'left',//滚动方向
    interval: 20 // 时间间隔
    
  },
  //事件处理函数
 
   onShow: function () {
    // 页面显示
    var vm = this;
    var length = vm.data.text.length * vm.data.size;//文字长度
    var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
    vm.setData({
      length: length,
      windowWidth: windowWidth,
      marquee2_margin: length < windowWidth ? windowWidth - length : vm.data.marquee2_margin//当文字长度小于屏幕长度时，需要增加补白
    });
  
    vm.run2();// 第一个字消失后立即从右边出现
  },
 
  run2: function () {
    var vm = this;
    var interval = setInterval(function () {
      if (-vm.data.marqueeDistance2 < vm.data.length) {
        // 如果文字滚动到出现marquee2_margin=30px的白边，就接着显示
        vm.setData({
          marqueeDistance2: vm.data.marqueeDistance2 - vm.data.marqueePace,
          marquee2copy_status: vm.data.length + vm.data.marqueeDistance2 <= vm.data.windowWidth + vm.data.marquee2_margin,
        });
      } else {
        if (-vm.data.marqueeDistance2 >= vm.data.marquee2_margin) { // 当第二条文字滚动到最左边时
          vm.setData({
            marqueeDistance2: vm.data.marquee2_margin // 直接重新滚动
          });
          clearInterval(interval);
          vm.run2();
        } else {
          clearInterval(interval);
          vm.setData({
            marqueeDistance2: -vm.data.windowWidth
          });
          vm.run2();
        }
      }
    }, vm.data.interval);
  },
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
  indexDetail:function(){
     wx.navigateTo({
      url:'/pages/indexDetail/indexDetail'
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
  }
 
})

  