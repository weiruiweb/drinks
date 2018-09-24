//index.js
//获取应用实例
import {Api} from '../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';


Page({
  data: {
    mainData:[],
    addressData:[],
    userInfoData:[],
    searchItem:{
      isdefault:1
    },
    buttonClicked:true,
    order_id:'',
    submitData:{
      passage1:''
    },
    complete_api:[],
  },

  onLoad: function (options) {
    const self = this;
     this.setData({
        fonts:app.globalData.font
      });
    self.data.id = options.id;
    self.getMainData();
    self.distributionGet();
    self.userGet();
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
    if(wx.getStorageSync('threeToken')){
      self.data.token = wx.getStorageSync('threeToken')
    }else{
      self.data.token = wx.getStorageSync('token')
    };
    self.getAddressData();
  },

  getAddressData(){
    const self = this;
    const postData = {}
    postData.token = wx.getStorageSync('token');
    postData.searchItem = api.cloneForm(self.data.searchItem);
    const callback = (res)=>{
      if(res){
        self.data.addressData = res;
        self.setData({
          web_addressData:self.data.addressData,
        });
      }else{
        api.showToast('获取地址信息有误','fail');
      };
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
      if(res.info.data.length>0){
        self.data.mainData = res.info.data[0];
        self.setData({
          web_mainData:self.data.mainData,
        }); 
        self.countTotalPrice(); 
        self.data.complete_api.push('getMainData');
      }else{
        api.showToast('商品信息有误','fail');
        return;
      };
      self.checkLoadComplete();
    };
    api.productGet(postData,callback);
  },

  userGet(){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('token');
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.userData = res.info.data[0];
        self.data.complete_api.push('userGet');
      }else{
        api.showToast('用户信息有误','fail');
        return;
      }; 
      self.checkLoadComplete();  
      
    };
    api.userGet(postData,callback);
  },

  distributionGet(){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('token');
    postData.searchItem = {
      child_no:wx.getStorageSync('info').user_no
    };
    postData.getAfter = {
      userInfo:{
        tableName:'user_info',
        middleKey:'parent_no',
        key:'user_no',
        searchItem:{
          status:1
        },
        condition:'=',
        info:['level']
      }
    }
    const callback = (res)=>{
      if(res){
        self.data.distributionData = res;
        self.setData({
          web_distributionData:self.data.distributionData,
        });
        self.data.complete_api.push('distributionGet');
      };
      self.checkLoadComplete();
    };
    api.distributionGet(postData,callback);
  },



  addOrder(){
    const self = this;

    if(self.data.buttonClicked){
      api.showToast('数据有误请稍等','fail');
      return;
    };

    if(wx.getStorageSync('info')&&wx.getStorageSync('info').thirdApp.custom_rule.firstClass&&wx.getStorageSync('info').thirdApp.custom_rule.secondClass){
      if(wx.getStorageSync('info').info.name==''&&wx.getStorageSync('info').info.phone==''){
        api.showToast('请完善信息');
        setTimeout(function(){
           api.pathTo('/pages/userComplete/userComplete','nav');
        },800);
        return;
      }else if(!self.data.order_id){

        self.data.buttonClicked = true;
        const postData = {
          token:self.data.token,
          product:[
            {id:self.data.id,count:self.data.mainData.count}
          ],
          pay:{wxPay:self.data.totalPrice.toFixed(2)},
          type:1,
          passage1:self.data.submitData.passage1
        };
        if(self.data.addressData.info.data[0]){
          postData.snap_address = self.data.addressData.info.data[0];
        };
        const callback = (res)=>{
          if(res&&res.solely_code==100000){
            setTimeout(function(){
              self.data.buttonClicked = false;
            },1000);
            self.data.order_id = res.info.id
            self.pay(self.data.order_id);         
          }; 
        };
        api.addOrder(postData,callback);
      }else{
        self.pay(self.data.order_id);
      };   
    }else{
      var token = new Token();
      const callback = (res)=>{
        self.addOrder(res)
      };
      token.getUserInfo({},callback);
    };
   
  },



  

  pay(order_id){
    const self = this;
    
    const postData = {
      token:self.data.token,
      searchItem:{
        id:order_id,
      },
      wxPay:self.data.totalPrice.toFixed(2),
      wxPayStatus:0
    };
  /*  if(self.data.token==wx.getStorageSync('threeToken')){
      postData.openid = wx.getStorageSync('info').openid
    };*/
    var levelOneCash = (wx.getStorageSync('info').thirdApp.custom_rule.firstClass*self.data.totalPrice.toFixed(2))/100; 
    var levelTwoCash = (wx.getStorageSync('info').thirdApp.custom_rule.secondClass*self.data.totalPrice.toFixed(2))/100;
    var agentRewardCash = (wx.getStorageSync('info').thirdApp.custom_rule.agentReward*self.data.totalPrice.toFixed(2))/100;
    var commmonRewardCash = Number(wx.getStorageSync('info').thirdApp.custom_rule.commonReward);
    
    postData.payAfter = [];
    if(self.data.distributionData.info.data.length>0){
      var transitionArray = self.data.distributionData.info.data;
      for (var i = 0; i < transitionArray.length; i++){
        if(self.data.userData.info.level==1){
          if(transitionArray[i].userInfo.level==1){
            postData.payAfter.push(
              {
                tableName:'FlowLog',
                FuncName:'add',
                data:{
                  count:commmonRewardCash,
                  trade_info:'下级消费佣金奖励(包含3元固定奖励)',
                  user_no:transitionArray[i].parent_no,
                  type:2,
                  thirdapp_id:getApp().globalData.thirdapp_id
                }
              }
            );
          }else if(transitionArray[i].level==2){
            postData.payAfter.push(
              {
                tableName:'flowlog',
                FuncName:'add',
                data:{
                  count:levelTwoCash+commmonRewardCash,
                  trade_info:'下级消费佣金奖励(包含3元固定奖励)',
                  user_no:transitionArray[i].parent_no,
                  type:2,
                  thirdapp_id:getApp().globalData.thirdapp_id
                }
              }
            );
          };    
        }else if(self.data.userData.info.level==2){
          if(transitionArray[i].userInfo.level==1){
            postData.payAfter.push(
              {
                tableName:'FlowLog',
                FuncName:'add',
                data:{
                  count:commmonRewardCash,
                  trade_info:'下级消费佣金奖励(包含3元固定奖励)',
                  user_no:transitionArray[i].parent_no,
                  type:2,
                  thirdapp_id:getApp().globalData.thirdapp_id
                }
              }
            );
          }else if(transitionArray[i].level==2){
            postData.payAfter.push(
              {
                tableName:'flowlog',
                FuncName:'add',
                data:{
                  count:commmonRewardCash,
                  trade_info:'下级消费佣金奖励(包含3元固定奖励)',
                  user_no:transitionArray[i].parent_no,
                  type:2,
                  thirdapp_id:getApp().globalData.thirdapp_id
                }
              }
            );
          };     
        }
      };
    };
    if(self.data.userData.passage1&&self.data.userData.passage1!=''){
      postData.payAfter.push(
        {
          tableName:'Flow_Log',
          FuncName:'add',
          data:{
            count:agentRewardCash+commmonRewardCash,//12.5
            trade_info:'下级消费佣金奖励',
            user_no:self.data.userData.passage1,
            type:2,
            thirdapp_id:getApp().globalData.thirdapp_id
          }
        }
      );
    };
    
    if(self.data.userData.info.level==2){
      postData.payAfter.push(
        {
          tableName:'flow_log',
          FuncName:'add',
          data:{
            count:levelTwoCash,
            trade_info:'合伙人优惠奖励',
            user_no:self.data.userData.user_no,
            type:2,
            thirdapp_id:getApp().globalData.thirdapp_id
          }
        }
      );
    };
    if(wx.getStorageSync('threeToken')){
      postData.payAfter.push(
        {
          tableName:'flow_log',
          FuncName:'add',
          data:{
            count:agentRewardCash,//62.5%
            trade_info:'代理优惠奖励',
            user_no:wx.getStorageSync('threeInfo').user_no,
            type:2,
            thirdapp_id:getApp().globalData.thirdapp_id
          }
        }
      );
    };
    
    const callback = (res)=>{
      wx.hideLoading();
      if(res.solely_code==100000){
        const payCallback=(payData)=>{
          if(payData==1){
            setTimeout(function(){
              api.pathTo('/pages/userOrder/userOrder','redi');
            },800)  
          };   
        };
        api.realPay(res.info,payCallback);  
      }else{
        api.showToast('发起微信支付失败','fail')
      };
    };
    api.pay(postData,callback);
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

  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

  checkLoadComplete(){
    const self = this;
    var complete = api.checkArrayEqual(self.data.complete_api,['getMainData','userGet','distributionGet']);
    if(complete){
      wx.hideLoading();
      self.data.buttonClicked = false;
    };
  },

  changeBind(e){
    const self = this;
    api.fillChange(e,self,'submitData');
    console.log(self.data.submitData);
    self.setData({
      web_submitData:self.data.submitData,
    });  
  },

  




})
