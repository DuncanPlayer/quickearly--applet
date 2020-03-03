var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
Page({
  data:{
    orderList: []
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var userInfo = app.getGlobalUserInfo();
    this.getOrderList(userInfo.id);
  },
  getOrderList(id){
    let that = this;
    util.request(api.ReservationList,{userId: id}).then(function (res) {
      if (res.status === 200) {
        that.setData({
          orderList: res.data
        });
      }
    });
  },
  payOrder(){
    wx.redirectTo({
      url: '/pages/pay/pay',
    })
  },
  logistics(){
    wx.navigateTo({
      url: '../logistics/logistics'
    })
  },
  qrCode(e){
    //到店取单，用户可凭二维码到店取单
    var reservationId = e.currentTarget.dataset.orderIndex;
    wx.navigateTo({
      url: '../qrCodeResult/qrCodeResult?reservationId=' + reservationId
    })
  },
  btnDetail(e){
    var reservationId = e.currentTarget.dataset.orderIndex;
    wx.navigateTo({
      url: '../reservationDetail/reservationDetail?reservationId=' + reservationId
    })
  },
  onReady:function(){
    // 页面渲染完成
    // wx.setStorageSync("orderIcon", 0);
    // wx.setStorageSync("reservationIcon", 0);
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})