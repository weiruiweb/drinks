//logs.js
import {Api} from '../../utils/api.js';
var api = new Api();
var app = getApp()


Page({
  data: {
   num:3,
   mainData:[],
   searchItem:{
    user_type:0,
    pay_status :1,
    transport_status :0,
    order_step :0
   },
   buttonClicked: false
  },


  onLoad(options){
    const self = this;
    if(options.num){
      self.changeSearch(options.num)
    }
    this.setData({
      fonts:app.globalData.font
    });
    self.setData({
      num: self.data.num
    });
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    
  },

  onShow(){
    const self = this;
    wx.showLoading();
    if(wx.getStorageSync('threeToken')&&wx.getStorageSync('threeInfo')){
      self.getMainData(true);
    }else{
      api.logOff();
    };  
  },  


  getMainData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self);  
    };
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.token = wx.getStorageSync('threeToken');
    postData.searchItem = api.cloneForm(self.data.searchItem)
    postData.order = {
      create_time:'desc'
    };
    postData.getBefore = {
      user:{
        tableName:'user',
        searchItem:{
          passage1:['=',[wx.getStorageSync('threeInfo').user_no]],
        },
        middleKey:'user_no',
        key:'user_no',
        condition:'in',
      },
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','none');
      };
      wx.hideLoading();
      self.setData({
        buttonClicked: false
      });
      self.setData({
        web_mainData:self.data.mainData,
      });  
    };
    api.orderGet(postData,callback);
  },

  deleteOrder(e){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('token');
    postData.searchItem = {};
    postData.searchItem.id = api.getDataSet(e,'id');
    const callback  = res=>{
      api.dealRes(res);
      self.getMainData(true);
    };
    api.orderDelete(postData,callback);
  },

  orderUpdate(e){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('token');
    postData.data ={
      transport_status:2,
      order_step:3
    }
    postData.searchItem = {};
    postData.searchItem.id = api.getDataSet(e,'id');
    const callback  = res=>{
      api.showToast('已确认收货','none');
      self.getMainData(true);
    };
    api.orderUpdate(postData,callback);
  },



  pay(e){
    const self = this;
    var id = api.getDataSet(e,'id');
    var price = api.getDataSet(e,'price')
    const postData = {
      token:wx.getStorageSync('token'),
      searchItem:{
        id:id
      },
      wxPay:price,
      wxPayStatus:0
    };
    const callback = (res)=>{
      wx.hideLoading();
      
      const payCallback=(payData)=>{
          self.getMainData(true)  
      };
      api.realPay(res.info,payCallback);   
    };
    api.pay(postData,callback);
  },


  menuClick: function (e) {
    const self = this;
    wx.showLoading();
    self.setData({
      buttonClicked: true
    });
    const num = e.currentTarget.dataset.num;
   
    self.changeSearch(num);
  },

  changeSearch(num){
    const self = this;
    self.setData({
      num: num
    });
    self.data.searchItem = {};
    if(num=='3'){
      self.data.searchItem.pay_status = '1';
      self.data.searchItem.transport_status = '0';
      self.data.searchItem.order_step = '0';
    }else if(num=='4'){
      self.data.searchItem.pay_status = '1';
      self.data.searchItem.transport_status = '1';
      self.data.searchItem.order_step = '0';
    }else if(num=='5'){
      self.data.searchItem.pay_status = '1';
      self.data.searchItem.transport_status = '2';
      self.data.searchItem.order_step = '0';
    }
    self.setData({
      web_mainData:[],
    });
    self.getMainData(true);
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


})

