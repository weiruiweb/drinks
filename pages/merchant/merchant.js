//logs.js
import {Api} from '../../utils/api.js';
var api = new Api();

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
    web_show:false,
  
  },
    


  onLoad(){
    const self = this;
     wx.showShareMenu({
      withShareTicket: true
    });
  },

  onShow(){
    const self = this;
    if(wx.getStorageSync('threeInfo')&&wx.getStorageSync('threeToken')){
      self.setData({
        web_show:true
      })
    }else{
      api.logOff();
    } 
  },

  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

 


  onShareAppMessage(res){
    const self = this;
    return {
      title: '直销商城',
      path: 'pages/index/index?passage1='+wx.getStorageSync('threeInfo').user_no+'_',
      success: function (res){
        console.log(res);
      }
    }
  }


})
