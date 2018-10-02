//index.js
//获取应用实例
import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp()


Page({


  data: {
  
    QrData:[],
    buttonClicked:true,
    complete_api:[]
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

 getArtData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id,
      title:['=','分享图']
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.artData = res;
        self.data.complete_api.push('getArtData') 
      }
      self.setData({
        web_artData:self.data.artData,
      });
      self.checkLoadComplete();
    };
    api.labelGet(postData,callback);
  },

   checkLoadComplete(){
    const self = this;
    var complete = api.checkArrayEqual(self.data.complete_api,['getArtData','getQrData']);
    if(complete){
      
      
      self.getImageInfo()
    };
  },



  getImageInfo(){
    const self = this;
    wx.getImageInfo({
       src:self.data.artData.info.data[0].mainImg[0].url,
       success(res){
        self.data.imgOne = res.path;
        if(self.data.imgOne&&self.data.imgTwo){
          self.canva()
        }
       },
       fail: function (res) {
            console.log('fail',res)
        }
    })

    wx.getImageInfo({
       src:self.data.QrData.info.url,
       success(res){
        console.log(res)
        self.data.imgTwo = res.path;
        if(self.data.imgOne&&self.data.imgTwo){
          self.canva()
        };
       },
       fail: function (res) {
            console.log('fail',res)
        }
    })
    
  },

  canva(){
    const self = this;
    console.log('self.data.imgOne',self.data.imgOne);
    console.log('self.data.imgTwo',self.data.imgTwo);
    const ctx = wx.createCanvasContext('shareCanvas');
    ctx.drawImage(self.data.imgOne, 2.5, 2.5, 370, 555);
    ctx.setTextAlign('center');   
    ctx.setFillStyle('#fff');
    ctx.drawImage(self.data.imgTwo, 117.5, 158, 140, 140);
    ctx.stroke();
    ctx.draw();
    wx.hideLoading();
    self.data.buttonClicked = false;
  },


  save(){
    const self = this;
    if(self.data.buttonClicked){
      api.showToast('数据有误请稍等','none');
      setTimeout(function(){
        wx.showLoading();
      },800)   
      return;
    }
    wx.canvasToTempFilePath({
      canvasId: 'shareCanvas',
      fileType:'jpg',
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.hideLoading();
            wx.showToast({
              title: '保存成功',
            });
          },
          fail(){
            wx.hideLoading()
          }
        })
      }
    })
  }

})
