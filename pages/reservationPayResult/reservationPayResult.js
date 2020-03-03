var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const pay = require('../../services/pay.js');

var app = getApp();
Page({
  data: {
    status: false,
    orderId: 0,
    orderIcon: 0
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    let that = this;
    this.setData({
      orderId: options.orderId || 24,
      status: options.status
    })
    // var marker = that.data.status;
    // if (marker == 1){
    //   util.request(api.IconNum).then(function (res) {
    //     if (res.status === 200) {
    //       wx.setStorageSync("reservationIcon", res.data.reservationNum);
    //     }
    //   });
    // }
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
  payOrder() {
    pay.payOrder(parseInt(this.data.orderId)).then(res => {
      this.setData({
        status: true
      });
    }).catch(res => {
      util.showErrorToast('支付失败');
    });
  }
})