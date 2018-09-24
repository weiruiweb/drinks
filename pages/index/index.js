import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {
    text:'',
    currentId:0,
    marqueePace: 0.5,//滚动速度
    marqueeDistance: 0,//初始滚动距离
    marqueeDistance2: 0,
    marquee2copy_status: false,
    marquee2_margin: 60,
    size: 14,
    orientation: 'left',//滚动方向
    interval: 20,
    shareBtn:'',
    isshare:'',// 时间间隔
    complete_api:[]
  },
  //事件处理函数
 
   onShow: function () {
    // 页面显示
    var self = this;
    var length = self.data.text.length * self.data.size;//文字长度
    var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
    self.setData({
      length: length,
      windowWidth: windowWidth,
      marquee2_margin: length < windowWidth ? windowWidth - length : self.data.marquee2_margin//当文字长度小于屏幕长度时，需要增加补白
    });
  
    self.run2();// 第一个字消失后立即从右边出现
  },
 
  run2: function () {
    var self = this;
    var interval = setInterval(function () {
      if (-self.data.marqueeDistance2 < self.data.length) {
        // 如果文字滚动到出现marquee2_margin=30px的白边，就接着显示
        self.setData({
          marqueeDistance2: self.data.marqueeDistance2 - self.data.marqueePace,
          marquee2copy_status: self.data.length + self.data.marqueeDistance2 <= self.data.windowWidth + self.data.marquee2_margin,
        });
      } else {
        if (-self.data.marqueeDistance2 >= self.data.marquee2_margin) { // 当第二条文字滚动到最左边时
          self.setData({
            marqueeDistance2: self.data.marquee2_margin // 直接重新滚动
          });
          clearInterval(interval);
          self.run2();
        } else {
          clearInterval(interval);
          self.setData({
            marqueeDistance2: -self.data.windowWidth
          });
          self.run2();
        }
      }
    }, self.data.interval);
  },

  onLoad(options) {
    const self = this;
    wx.showLoading();
    self.setData({
      fonts:app.globalData.font
    });
    wx.showShareMenu({
      withShareTicket: true
    });
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    self.getMainData();
    self.getArtData();
    self.getArtTwoData()
    
    if(options.scene){
      var scene = decodeURIComponent(options.scene)
    };
    if(options.parentNo){
      var scene = options.parentNo
    };
    if(options.passage1){
      var scene = options.passage1
    };
    
    if(scene){
      var num = scene.search('_');
      var sceneNew = scene.substring(0,scene.length-1);

      if(num==-1){
        var token = new Token({parent_no:scene}); 
      }else{
        var token = new Token({passage1:sceneNew}); 
      }   
      token.getUserInfo();
      console.log('getToken',sceneNew)
    }else{
      if(!wx.getStorageSync('token')){
        var token = new Token();
        token.getUserInfo();
        console.log('getToken')
      };
    }; 
  },
  
  
  getMainData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self); 
      self.setData({
        web_mainData:self.data.mainData
      }); 
    };
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData = res; 
        self.data.complete_api.push('getMainData');
      } 
      self.setData({
        web_mainData:self.data.mainData,
      }); 
      self.checkLoadComplete();    
    };
    api.productGet(postData,callback);
  },

  getArtData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id
    };
    postData.getBefore = {
      article:{
        tableName:'label',
        searchItem:{
          title:['=',['首页主图']],
        },
        middleKey:'menu_id',
        key:'id',
        condition:'in',
      },
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.artData = res;
        self.data.text = res.info.data[0].description;
        self.data.complete_api.push('getArtData');
      }
      self.setData({
        web_artData:self.data.artData,
      });
      self.checkLoadComplete();  
    };
    api.articleGet(postData,callback);
  },

  getArtTwoData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id
    };
    postData.getBefore = {
      article:{
        tableName:'label',
        searchItem:{
          title:['=',['规则说明']],
        },
        middleKey:'menu_id',
        key:'id',
        condition:'in',
      },
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.artTwoData = res; 
        self.data.complete_api.push('getArtTwoData'); 
      }
      self.setData({
        web_artTwoData:self.data.artTwoData,
      }); 
      self.checkLoadComplete(); 
    };
    api.articleGet(postData,callback);
  },

  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

  intoPathRedi(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  },


  onShareAppMessage(res){
    const self = this;
    return {
      title: '直销商城',
      path: 'pages/index/index?parentNo='+wx.getStorageSync('info').user_no,
      success: function (res){
        console.log(res);
      }
    }
  },

  checkLoadComplete(){
    const self = this;
    var complete = api.checkArrayEqual(self.data.complete_api,['getMainData','getArtTwoData','getArtData']);
    console.log(self.data.complete_api)
    if(complete){
      wx.hideLoading();
    };
  },


})

  