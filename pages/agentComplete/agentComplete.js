//logs.js
import {Api} from '../../utils/api.js';
const api = new Api();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {
    sForm:{
      phone:'',
      name:'',  
      address:''  
    },

    mainData:{},
    
  },


  onLoad(){
    const self = this;
    wx.showLoading();
    if(wx.getStorageSync('threeToken')&&wx.getStorageSync('threeToken')){
      self.userInfoGet()
    }else{
      api.logOff();
    };
  },


  userInfoGet(){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('threeToken');
    const callback = (res)=>{
      console.log(res)
      self.data.mainData = res;
      self.data.sForm.phone = res.info.data[0].info.phone;
      self.data.sForm.name = res.info.data[0].info.name;
      self.data.sForm.address = res.info.data[0].info.address;
      self.setData({
        web_sForm:self.data.sForm,
      });
      wx.hideLoading();
    };
    api.userGet(postData,callback);
  },


  changeBind(e){
    const self = this;
    api.fillChange(e,self,'sForm');
    console.log(self.data.sForm);
    self.setData({
      web_sForm:self.data.sForm,
    });  
  },


  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },


  userInfoUpdate(){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('threeToken');
    postData.data = {};
    postData.data = api.cloneForm(self.data.sForm);
    const callback = (data)=>{
      wx.hideLoading();
      if(data.solely_code==100000){
        api.showToast('完善成功','none')
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
  

  

  submit(){
    const self = this;
    var phone = self.data.sForm.phone;
    const pass = api.checkComplete(self.data.sForm);
    if(pass){
      if(phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)){
        api.showToast('手机格式不正确','none')
      }else{    
          wx.showLoading();
          const callback = (user,res) =>{
            self.userInfoUpdate(); 
          };
          api.getAuthSetting(callback);      
      }
    }else{
      api.showToast('请补全信息','none');
    };
  },
 
})
