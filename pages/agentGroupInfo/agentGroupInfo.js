//logs.js
import {Api} from '../../utils/api.js';
const api = new Api();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {
 

    mainData:{},
    
  },


  onLoad(options){
    const self = this;
    self.data.id = options.id
    console.log(options.id)
    wx.showLoading();
    if(wx.getStorageSync('threeInfo')&&wx.getStorageSync('threeToken')){
       self.userInfoGet();
    }else{
      api.logOff();
    }
    
    
  },


  userInfoGet(){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('threeToken')
    postData.searchItem = {
      user_no:self.data.id,
      user_type:0
    }
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData = res.info.data[0];
      };
      self.setData({
        web_mainData:self.data.mainData,
      });
      wx.hideLoading();
    };
    api.userGet(postData,callback);
  },




  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },


  userInfoUpdate(){
    const self = this;
    wx.showLoading();
    const postData = {};
    postData.token = wx.getStorageSync('threeToken');
    postData.searchItem = {
      user_no:self.data.id,
      user_type:0
    }
    postData.data = {
      level:2,
    };
    const callback = (data)=>{
      wx.hideLoading();
      if(data.solely_code==100000){
        api.showToast('升级成功','none')
        setTimeout(function(){
          wx.navigateBack({
            delta: 1
          });
        },500); 
      }else{
        api.showToast('网络故障','none')
      };
    };
    api.userInfoUpdate(postData,callback);
  },
  

  


 
})
