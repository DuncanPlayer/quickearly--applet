var app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  data: {
    reservationId: 0,
    actualPrice: 0.00
    // status: false
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      reservationId: options.reservationId,
      actualPrice: options.actualPrice
    })
  },
  onReady: function () {

  },
  onShow: function () {
    // 页面显示

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  //向服务请求支付参数
  requestPayParam() {
    let that = this;
    util.request(api.ReservationPay, { reservationId: that.data.reservationId, payType: 1 }).then(function (res) {
      if (res.status === 200) {
        wx.redirectTo({
          url: '/pages/reservationPayResult/reservationPayResult?status=1' + '&orderId=' + that.data.reservationId,
        })
      }else{
        wx.redirectTo({
          url: '/pages/reservationPayResult/reservationPayResult?status=0' + '&orderId=' + that.data.reservationId,
        })
      }
    });
  },
  startPay() {
    this.requestPayParam();
  }
})