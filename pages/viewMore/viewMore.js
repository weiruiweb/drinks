import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();


Page({
  data: {
    artTwoData:[],
  },

  onLoad(options) {
    const self = this;
    wx.showLoading();
    self.setData({
      fonts:app.globalData.font
    });
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    self.getArtTwoData()
  },

 getArtTwoData(){
    const self = this;
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
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
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','none');
      };
      wx.hideLoading();
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

  onReachBottom() {
    const self = this;
    if(!self.data.isLoadAll){
      self.data.paginate.currentPage++;
      self.getArtTwoData();
    };
  },

})