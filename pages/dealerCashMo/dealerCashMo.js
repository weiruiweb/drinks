//logs.js
import {Api} from '../../utils/api.js';
var api = new Api();

import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {

    submitData:{
      score:'',

    }
  },



  onLoad(){
    const self = this;
    wx.showLoading();
    if(wx.getStorageSync('threeToken')){
      self.data.token = wx.getStorageSync('threeToken')
      self.data.info = wx.getStorageSync('threeInfo')
    }else{
      self.data.token = wx.getStorageSync('token')
      self.data.info = wx.getStorageSync('info')
    };
    self.getUserInfoData();
  },



  getUserInfoData(){
    const self = this;
    const postData = {};
    postData.token = self.data.token;
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.userData = res.info.data[0].balance
      }
      wx.hideLoading();
    };
    api.userInfoGet(postData,callback);   
  },

  changeBind(e){
    const self = this;
    if(api.getDataSet(e,'value')){
      self.data.submitData[api.getDataSet(e,'key')] = api.getDataSet(e,'value');
    }else{
      api.fillChange(e,self,'submitData');
    };
    console.log(self.data.submitData);
    self.setData({
      web_submitData:self.data.submitData,
    }); 
  },


  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },


  flowLogAdd(){
    const self = this;
    const postData = {
      token:self.data.token,
      data:{
        user_no:self.data.info.user_no,
        count:-self.data.submitData.score,
        trade_info:self.data.submitData.trade_info,
        status:0,
        type:2
      }
    };
    const callback = (res)=>{
      api.showToast('申请成功','none'); 
      wx.navigateBack({
        delta: 1
      }) 
    };
    api.flowLogAdd(postData,callback)
  },


  

  submit(){
    const self = this;
    wx.showLoading();
    var num = self.data.submitData.score;
    const pass = api.checkComplete(self.data.submitData);
    if(pass){  
      if(self.data.userData &&self.data.userData >=num){
        if(!(/(^[1-9]\d*$)/.test(num))){
         api.showToast('请输入正整数','none')
        }else{
          self.flowLogAdd();
        }   
      }else{
        api.showToast('佣金不足','none');  
      }   
    }else{
      api.showToast('请补全信息','none');
    };
  },





})
