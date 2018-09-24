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
    self.getArtData()
  },

 tel() {
  const self = this;
    wx.makePhoneCall({
      phoneNumber:self.data.artData.description,
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
 
  getArtData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id,
      title:'联系我们'
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.artData = res.info.data[0]
      }
      self.setData({
        web_artData:self.data.artData,
      });  
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
})
