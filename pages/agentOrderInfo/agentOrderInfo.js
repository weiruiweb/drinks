//logs.js
import {Api} from '../../utils/api.js';
const api = new Api();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {

    sForm:{
      express_info:''
    },
    mainData:[]
    
  },


  onLoad(options){
    const self = this;
    self.data.id = options.id;
    if(options.id){
      self.getMainData();
    }   
  },


 getMainData(isNew){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('threeToken');
    postData.searchItem = {
      id:self.data.id,
      user_type:0
    }
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData= res.info.data[0]
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','fail');
      };
      wx.hideLoading();
      self.setData({
        web_mainData:self.data.mainData,
      });  
    };
    api.orderGet(postData,callback);
  },

  changeBind(e){
    const self = this;
    api.fillChange(e,self,'sForm');
    console.log(self.data.sForm);
    self.setData({
      web_sForm:self.data.sForm,
    });  
  },

  orderUpdate(e){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('threeToken');
    postData.data ={
      transport_status:1,
      express_info:self.data.sForm.express_info
    };
    postData.searchItem = {
      user_type:0,
      id:self.data.id
    };
    const callback  = res=>{
      if(res.solely_code==100000){
        api.showToast('发货成功','none')
        setTimeout(function(){
          wx.navigateBack({
            delta: 1
          });
        },500); 
      }else{
        api.showToast('网络故障','none')
      };
      
    };
    api.orderUpdate(postData,callback);
  },





  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },



  

  

 
})
