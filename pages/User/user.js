import {Api} from '../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();


Page({
  data: {

    userData:[],
    startTime:'',
    endTime:'',
    searchItem:{
      type:2
        
    },
  },

  
  onLoad(options){
    const self = this;
    self.setData({
     fonts:app.globalData.font
    });
    self.getUserInfoData();
    if(options.scene){
      var scene = decodeURIComponent(options.scene)
    };
    if(options.parentNo){
      var scene = options.parentNo
    };
    console.log('111',scene)
    if(scene){
      var token = new Token({parent_no:scene});
      
    }else{
      var token = new Token();
    };
    token.getUserInfo();
  },

 tel:function () {
    wx.makePhoneCall({
      phoneNumber: '15888888888',
    })
  },

  getUserInfoData(){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('token');
    const callback = (res)=>{
      self.data.userData = res;
      self.setData({
        web_userData:self.data.userData,
      });
     
      wx.hideLoading();
    };
    api.userInfoGet(postData,callback);   
  },
 
  userCredit:function(){
    wx.navigateTo({
      url:'/pages/userCredit/userCredit'
    })
  },
  userMessage:function(){
    wx.navigateTo({
      url:'/pages/userMessage/userMessage'
    })
  },
  userGroup:function(){
    wx.navigateTo({
      url:'/pages/userGroup/userGroup'
    })
  },
  userContact:function(){
    wx.navigateTo({
      url:'/pages/userContact/userContact'
    })
  },
  address:function(){
    wx.navigateTo({
      url:'/pages/userAddress/userAddress'
    })
  }, 
  order:function(){
    wx.navigateTo({
      url:'/pages/userOrder/userOrder'
    })
  }, 
  
  userShare:function(){
    wx.navigateTo({
      url:'/pages/userShare/userShare'
    })
  }, 
  
  sort:function(){
     wx.redirectTo({
      url:'/pages/about/about'
    })
  },
  index:function(){
     wx.redirectTo({
      url:'/pages/index/index'
    })
  },
  User:function(){
     wx.redirectTo({
      url:'/pages/User/user'
    })
  },
  userContact:function(){
    var isShow = !this.data.isShow;
    this.setData({
      isShow:isShow
    })
  },
  cancel:function(){
    this.setData({
      isShow:false
    })
  },

  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },
})
