//index.js
//获取应用实例
import {Api} from '../../utils/api.js';
const api = new Api();
const app = getApp()


Page({
  data: {
    mainData:[],
    addressData:[],
    userInfoData:[],
    searchItem:{
      isdefault:1
    },
    buttonClicked: false,
    order_id:'',
  },

  onLoad: function (options) {
    const self = this;
     this.setData({
        fonts:app.globalData.font
      });
    self.data.id = options.id;
    self.getMainData();
    self.distributionGet();

    getApp().globalData.address_id = '';
  },

  onShow(){
    const self = this;
    self.data.searchItem = {};
    if(getApp().globalData.address_id){
      self.data.searchItem.id = getApp().globalData.address_id;
    }else{
      self.data.searchItem.isdefault = 1;
    };
    self.getAddressData();
  },

  getAddressData(){
    const self = this;
    const postData = {}
    postData.token = wx.getStorageSync('token');
    postData.searchItem = api.cloneForm(self.data.searchItem);
    const callback = (res)=>{
      self.data.addressData = res;
      self.setData({
        web_addressData:self.data.addressData,
      });
    };
    api.addressGet(postData,callback);
  },


  getMainData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id,
      id:self.data.id
    }
    const callback = (res)=>{
      self.data.mainData = res.info.data[0]
      wx.hideLoading();
      self.setData({
        web_mainData:self.data.mainData,
      }); 
      self.countTotalPrice();    
    };
    api.productGet(postData,callback);
  },


  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

  addOrder(){
    const self = this;
    if(wx.getStorageSync('info').info.length==0){
      api.showToast('请完善信息');
      setTimeout(function(){
           api.pathTo('/pages/userComplete/userComplete','nav');
        },800)
    }else if(!self.data.order_id){
      self.setData({
        buttonClicked: true
      });
      const postData = {
        token:wx.getStorageSync('token'),
        product:[
          {id:self.data.id,count:self.data.mainData.count}
        ],
        pay:{wxPay:self.data.totalPrice.toFixed(2)},
        snap_address:self.data.addressData.info.data[0],
        type:1,
      };
      const callback = (res)=>{
        if(res&&res.solely_code==100000){
          setTimeout(function(){
            self.setData({
              buttonClicked: false
            })
          }, 1000);
          self.data.order_id = res.info.id
          self.pay(self.data.order_id);         
        }; 
             
      };
      api.addOrder(postData,callback);
    }else{
      self.pay(self.data.order_id)
    }   
  },

  distributionGet(){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('token');
    postData.searchItem = {
      child_no:wx.getStorageSync('info').user_no
    }
    const callback = (res)=>{
      if(res){
        self.data.distributionData = res;
        self.setData({
          web_distributionData:self.data.distributionData,
        });
        self.userUpdate()
      }
      wx.hideLoading();
    };
    api.distributionGet(postData,callback);
  },



  pay(order_id){
    const self = this;
    var order_id = self.data.order_id;
    const postData = {
      token:wx.getStorageSync('token'),
      searchItem:{
        id:order_id
      },
      wxPay:self.data.mainData.price,
      wxPayStatus:0
    };
    const callback = (res)=>{
      wx.hideLoading();
      
      if(res.solely_code==100000){
        const payCallback=(payData)=>{
          if(payData==1){
            self.userUpdate();
            setTimeout(function(){
              api.pathTo('/pages/userOrder/userOrder','redi');
            },800)  
          };   
        };
        api.realPay(res.info,payCallback); 
        
      }else{
        api.showToast('发起微信支付失败','fail')
      }
         
    };
    api.pay(postData,callback);
  },



  userUpdate(){
    const self = this;
    var nowTimestamp =new Date().getTime();
    const postData = {};
    postData.token = wx.getStorageSync('token');
    postData.data = {
      update_time:nowTimestamp
    };
    postData.saveAfter = [];
    if(self.data.distributionData.info.data.length>0){
      var transitionArray = self.data.distributionData.info.data;
        for (var i = 0; i < transitionArray.length; i++){
          if(transitionArray[i].level==1){
              postData.saveAfter.push(
                {
                  tableName:'FlowLog',
                  FuncName:'add',
                  data:{
                    count:wx.getStorageSync('info').thirdApp.custom_rule.firstClass,
                    trade_info:'下级消费佣金奖励',
                    user_no:transitionArray[i].parent_no,
                    type:2,
                    thirdapp_id:getApp().globalData.thirdapp_id
                  }
                }
              );
              }else if(transitionArray[i].level==2){
                postData.saveAfter.push(
                  {
                    tableName:'flowlog',
                    FuncName:'add',
                    data:{
                      count:wx.getStorageSync('info').thirdApp.custom_rule.secondClass,
                      trade_info:'下级消费佣金奖励',
                      user_no:transitionArray[i].parent_no,
                      type:2,
                      thirdapp_id:getApp().globalData.thirdapp_id
                    }
                  }
                );
              }
            }       
          };
          const callback = (data)=>{
          wx.hideLoading();   
        };
      api.userUpdate(postData,callback);
    },

  counter(e){
    const self = this;
    if(api.getDataSet(e,'type')=='+'){
      self.data.mainData.count++;
    }else if(self.data.mainData.count > '1'){
      self.data.mainData.count--;
    }
    self.setData({
      web_mainData:self.data.mainData,
    });
    self.countTotalPrice();
  },

  bindManual(e) {
    const self = this;
    var count = e.detail.value;
    self.setData({
      count:count
    });
  },

  countTotalPrice(){  
    const self = this;
    var totalPrice = 0;
    totalPrice += self.data.mainData.count*parseFloat(self.data.mainData.price);
    self.data.totalPrice = totalPrice;
    self.setData({
      web_totalPrice:self.data.totalPrice.toFixed(2)
    });
  },

  getartData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id
    };
    postData.getBefore = {
      article:{
        tableName:'label',
        searchItem:{
          title:['=',['关于我们']],
          thirdapp_id:['=',[getApp().globalData.thirdapp_id]],
        },
        middleKey:'menu_id',
        key:'id',
        condition:'in',
      },
    };
    const callback = (res)=>{
      self.data.artData = {};
      if(res.info.data.length>0){
        self.data.artData = res.info.data[0];
      };
      console.log(self.data.artData);
      wx.hideLoading();
      self.setData({
        web_artData:self.data.artData,
      });  
    };
    api.articleGet(postData,callback);
  },






})
