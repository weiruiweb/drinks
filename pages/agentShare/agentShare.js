//index.js
//获取应用实例
import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp()


Page({


  data: {
  
    QrData:[]

  },
    

  onLoad(){
    const self = this;
    wx.showLoading();
    if(wx.getStorageSync('threeToken')&&wx.getStorageSync('threeToken')){
       self.getQrData();
    }else{
      api.logOff();
    };  
    self.setData({
      fonts:app.globalData.font
    })
  },


  getQrData(){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('threeToken');
    postData.qrInfo = {
      scene:wx.getStorageSync('threeInfo').user_no+'_',
      path:'pages/index/index',
    };
    postData.output = 'url';
    postData.ext = 'png';
    const callback = (res)=>{
      if(res){
        self.data.QrData = res;
      }  
      self.setData({
        web_QrData:self.data.QrData,
      });
      wx.hideLoading();
    };
    api.getQrCode(postData,callback);
 },

})