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
    buttonClicked: false,
    order_id:'',
    submitData:{
      passage1:''
    }
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

  changeBind(e){
    const self = this;
    api.fillChange(e,self,'submitData');
    console.log(self.data.submitData);
    self.setData({
      web_submitData:self.data.submitData,
    });  
  },

  addOrder(){
    const self = this;
    if(wx.getStorageSync('info')&&wx.getStorageSync('info').thirdApp.custom_rule.firstClass&&wx.getStorageSync('info').thirdApp.custom_rule.secondClass){
       if(wx.getStorageSync('info').info.name==''&&wx.getStorageSync('info').info.phone==''){
      api.showToast('请完善信息');
      setTimeout(function(){
           api.pathTo('/pages/userComplete/userComplete','nav');
        },800)
      }else if(!self.data.order_id){
        self.buttonClicked = true;
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
          passage1:self.data.submitData.passage1
        };
        const callback = (res)=>{
          if(res&&res.solely_code==100000){
            setTimeout(function(){
              self.setData({
                buttonClicked: false
              })
              self.buttonClicked = false;
            }, 1000);
            self.data.order_id = res.info.id
            self.pay(self.data.order_id);         
          }; 
        };
        api.addOrder(postData,callback);
      }else{
        self.pay(self.data.order_id)
      }   
    }else{
      var token = new Token();
      const callback = (res)=>{
        self.addOrder(res)
      };
      token.getUserInfo({},callback);
    };
   
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
      }
      wx.hideLoading();
    };
    api.distributionGet(postData,callback);
  },

  userGet(){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('token');
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.userData = res.info.data[0]
      }   
      wx.hideLoading();
    };
    api.userGet(postData,callback);
  },

  pay(order_id){
    const self = this;
    var order_id = self.data.order_id;
    const postData = {
      token:wx.getStorageSync('token'),
      searchItem:{
        id:order_id
      },
      wxPay:self.data.totalPrice.toFixed(2),
      wxPayStatus:0
    };
    var levelOneCash = (wx.getStorageSync('info').thirdApp.custom_rule.firstClass*self.data.totalPrice.toFixed(2))/100; 
    var levelTwoCash = (wx.getStorageSync('info').thirdApp.custom_rule.secondClass*self.data.totalPrice.toFixed(2))/100;
    var agentRewardCash = (wx.getStorageSync('info').thirdApp.custom_rule.agentReward*self.data.totalPrice.toFixed(2))/100;
    var commmonRewardCash = Number(wx.getStorageSync('info').thirdApp.custom_rule.commonReward);
    console.log(wx.getStorageSync('info').thirdApp.custom_rule.commonReward)
    console.log((wx.getStorageSync('info').thirdApp.custom_rule.firstClass*self.data.totalPrice.toFixed(2))/100)
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
    }
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
