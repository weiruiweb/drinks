//logs.js
import {Api} from '../../utils/api.js';
var api = new Api();
var app = getApp()


Page({
  data: {
   num:1,
   mainData:[],
   searchItem:{
      thirdapp_id:getApp().globalData.thirdapp_id,
    },
    buttonClicked: false
  },


  onLoad(options){
    const self = this;
    if(options.num){
      self.changeSearch(options.num)
    };
    self.setData({
      fonts:app.globalData.font
    });
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    self.getMainData()
  },


  getMainData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self);  
    };
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.token = wx.getStorageSync('token');
    postData.searchItem = api.cloneForm(self.data.searchItem)
    postData.order = {
      create_time:'desc'
    }
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','fail');
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
      api.showToast('已确认收货','fail');
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
        if(transitionArray[i].userInfo.level==1){
          postData.payAfter.push(
            {
              tableName:'FlowLog',
              FuncName:'add',
              data:{
                count:levelOneCash+commmonRewardCash,
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
      };
    };
    if(self.data.userData.passage1&&self.data.userData.passage1!=''){
      postData.payAfter.push(
        {
          tableName:'Flow_Log',
          FuncName:'add',
          data:{
            count:agentRewardCash,
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
         self.getMainData(true)
        };   
      };
        api.realPay(res.info,payCallback);  
      }else{
        api.showToast('发起微信支付失败','fail')
      };
    };
    api.pay(postData,callback);
  },

  

  menuClick: function (e) {
    const self = this;
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
    if(num=='1'){

    }else if(num=='2'){
      self.data.searchItem.pay_status = '0';
      self.data.searchItem.order_step = '0';
    }else if(num=='3'){
      self.data.searchItem.pay_status = '1';
      self.data.searchItem.transport_status = '1';
      self.data.searchItem.order_step = '0';
    }else if(num=='4'){
      self.data.searchItem.order_step = '3';
    }else if(num=='5'){
      self.data.searchItem.order_step = '2';
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


})

