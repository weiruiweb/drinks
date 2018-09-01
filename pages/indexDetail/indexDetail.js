import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp()

Page({
  data: {
   
    mainData:[],
    num:0,
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: false,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    currentId:0,
    id:'',
    isShow:true,
    isChoose:0
    
  },
  //事件处理函数
 
  onLoad: function (options) {
    const self = this;
    this.setData({
      fonts:app.globalData.font
    });
    self.setData({
      web_num: self.data.num
    });
    self.data.id = options.id;
    console.log(self.data.id)
    self.getMainData();
  },

  getMainData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      id:self.data.id
    }
    const callback = (res)=>{
      self.data.mainData = res.info.data[0]
      wx.hideLoading();
      self.data.mainData.content = api.wxParseReturn(res.info.data[0].content).nodes;
      self.setData({
        web_mainData:self.data.mainData,
      });     
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
          {id:self.data.id,count:1}
        ],
        pay:{score:self.data.mainData.price},
      };
      const callback = (res)=>{
        if(res&&res.solely_code==100000){
          setTimeout(function(){
            self.setData({
              buttonClicked: false
            })
          }, 1000)         
        }; 
        self.data.order_id = res.info
        self.pay(self.data.order_id);     
      };
      api.addOrder(postData,callback);
    }else{
       api.showToast('支付失败','fail')
    }   
  },




  pay(order_id){
    const self = this;
    var order_id = self.data.order_id;
    const postData = {
      token:wx.getStorageSync('token'),
      searchItem:{
        id:order_id
      },
      score:self.data.mainData.price
    };
    const callback = (res)=>{
      wx.hideLoading();
      if(res.solely_code==100000){
        api.showToast('订单已兑换','fail'),
        self.show()
      }else{
        api.showToast('支付失败','fail')
      }
         
    };
    api.pay(postData,callback);
  },

  menuClick: function (e) {
    const self = this;
    const num = e.currentTarget.dataset.num;
    self.changeSearch(num);
  },


  changeSearch(num){
    const self = this;
    self.setData({
      web_num: num
    });
    if(num==1){
      self.getartData()
    }
    self.getMainData(true);
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
          title:['=',['购买须知']],
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
        self.data.artData.content = api.wxParseReturn(res.info.data[0].content).nodes;
      };
      wx.hideLoading();
      self.setData({
        web_artData:self.data.artData,
      });  
    };
    api.articleGet(postData,callback);
  },




 
 
})

  