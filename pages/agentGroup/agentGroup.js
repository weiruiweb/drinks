import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp()
import {Token} from '../../utils/token.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    mainData:[],
    startTime:'',
    endTime:'',
    searchItem:{
      thirdapp_id:getApp().globalData.thirdapp_id,
      user_type:'0',
      passage1:wx.getStorageSync('threeInfo').user_no
    }

  },
    

  onLoad(){
    const self = this;
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    wx.showLoading();
    if(self.data.searchItem.passage1&&self.data.searchItem.passage1!=undefined){
      self.getMainData();
    }else{
      api.logOff();
    }
    self.setData({
      fonts:app.globalData.font
    });
  },

  onPullDownRefresh(){
    const self = this;
    wx.showNavigationBarLoading(); 
    delete self.data.searchItem.create_time;
    self.setData({
      web_startTime:'',
      web_endTime:'',
    });
    self.getMainData(true);
  },

  getMainData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self);  
    };
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.token = wx.getStorageSync('threeToken');
    postData.searchItem = api.cloneForm(self.data.searchItem);
    postData.order = {
      create_time:'desc'
    }
    console.log('postData',postData)
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','none');
      };
      setTimeout(function()
      {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      },300);
      wx.hideLoading();
      self.setData({
        web_mainData:self.data.mainData,
        web_total:res.info.total
      });  
    };
    if(!postData.searchItem.passage1){
      api.showToast('网络故障','none');
      return;
    };
    api.userGet(postData,callback);
  },


  onReachBottom() {
    const self = this;
    if(!self.data.isLoadAll){
      self.data.paginate.currentPage++;
      self.getMainData();
    };
  },


  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },


  bindTimeChange: function(e) {
    const self = this;
    var label = api.getDataSet(e,'type');
    this.setData({
      ['web_'+label]: e.detail.value
    });
    self.data[label+'stap'] = new Date(self.data.date+' '+e.detail.value).getTime();
    if(self.data.endTimestap&&self.data.startTimestap){
      self.data.searchItem.create_time = ['between',[self.data.startTimestap,self.data.endTimestap]];
    }else if(self.data.startTimestap){
      self.data.searchItem.create_time = ['>',self.data.startTimestap/1000];
    }else{
      self.data.searchItem.create_time = ['<',self.data.endTimestap/1000];
    };
    self.getMainData(true);   
  },

 
})