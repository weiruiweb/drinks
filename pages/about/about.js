import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();


Page({
  data: {
    artTwoData:[],
    artData:[],
  },

  onLoad(options) {
    const self = this;
    self.setData({
      fonts:app.globalData.font
    });
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    self.getArtData();
    self.getArtTwoData()
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
          title:['=',['公司简介']],
        },
        middleKey:'menu_id',
        key:'id',
        condition:'in',
      },
    };
    const callback = (res)=>{
      self.data.artData = res;
      self.data.text = res.info.data[0].description;
      self.setData({
        web_artData:self.data.artData,
      });  
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
          title:['=',['公司动态']],
        },
        middleKey:'menu_id',
        key:'id',
        condition:'in',
      },
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.artTwoData.push.apply(self.data.artTwoData,res.info.data);
        if(res.info.data.length>2){
          self.data.artTwoData = self.data.artTwoData.slice(0,2) 
        }
      }else{
        self.data.isLoadAll = true;
      };
      self.setData({
        web_artTwoData:self.data.artTwoData,
      });  
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


})
