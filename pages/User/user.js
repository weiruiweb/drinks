import {Api} from '../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();


Page({
  data: {
    artData:[], 
    userData:[],
    startTime:'',
    endTime:'',
    searchItem:{
      type:2  
    },
    complete_api:[]
  },

  
  onLoad(options){
    const self = this;
    wx.showLoading();
    self.setData({
     fonts:app.globalData.font
    });
    self.getUserInfoData();
    self.getArtData();
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



  getUserInfoData(){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('token');
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.userData = res;
        self.data.complete_api.push('getUserInfoData')
      }
      self.setData({
        web_userData:self.data.userData,
      });    
      self.checkLoadComplete()
    };
    api.userInfoGet(postData,callback);   
  },
 
  getArtData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id,
      title:'联系我们'
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.artData = res.info.data[0];
        self.data.complete_api.push('getArtData')
      }
      self.setData({
        web_artData:self.data.artData,
      });  
      self.checkLoadComplete()
    };
    api.labelGet(postData,callback);
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

  intoPathRedi(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  },

  tel() {
    const self = this;
    wx.makePhoneCall({
      phoneNumber:self.data.artData.description,
    })
  },

  checkLoadComplete(){
    const self = this;
    var complete = api.checkArrayEqual(self.data.complete_api,['getUserInfoData','getArtData']);
    console.log(self.data.complete_api)
    if(complete){
      wx.hideLoading();
    };
  },

})
