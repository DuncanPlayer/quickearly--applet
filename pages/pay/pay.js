var app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  data: {
    orderId: 0,
    actualPrice: 0.00
    // status: false
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      orderId: options.orderId,
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
    util.request(api.PayPrepayIdForJAVA, { orderId: that.data.orderId, payType: 1 }).then(function (res) {
      if (res.status === 200) {
        wx.redirectTo({
          url: '/pages/payResult/payResult?status=1' + '&orderId=' + that.data.orderId,
        })
      }else{
        wx.redirectTo({
          url: '/pages/payResult/payResult?status=0' + '&orderId=' + that.data.orderId,
        })
      }
    });
  },
  startPay() {
    this.requestPayParam();
  }
})