var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const pay = require('../../../services/pay.js');
var app = getApp();

Page({
  data: {
    status: 1,
    reservationId: 0,
    qrCodeSrc: "",
    loadingTime: "",
    IPServer: ''
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    let that = this;
    this.setData({
      IPServer: app.serverUrl
    })
    this.setData({
      reservationId: options.reservationId
    })
    //userId
    var userinfo = app.getGlobalUserInfo();
    var id = this.data.reservationId;
    //生成qrCode 并返回路径  也许世界就是这样
    util.request(api.QrCode, { userId: userinfo.id,reservationId: this.data.reservationId }).then(function (res) {
      if (res.status === 200) {
        that.setData({
          qrCodeSrc: that.data.IPServer+"early"+res.data
        });
      }
    });

    //循环查询二维码状态  ----定时器实现方式
    that.setData({
      loadingTime: setInterval(function () {
        //userId
        //生成qrCode 并返回路径  也许世界就是这样
        util.request(api.SelectStatus, { userId: userinfo.id, reservationId: id }).then(function (res) {
          if (res.status === 200) {
            if (res.data == "true") {
              wx.redirectTo({
                url: '/pages/ucenter/reservationOrder/reservationOrder',
              })
            }
          }
        });
      }, 3000) //循环时间 这里是3秒  
    })
  },
  takeOrder(){
    let that = this;

    //userId
    var userinfo = app.getGlobalUserInfo();
    //生成qrCode 并返回路径  也许世界就是这样
    util.request(api.SetTakeOrder, { userId: userinfo.id, reservationId: this.data.reservationId}).then(function (res) {
      if (res.status === 200) {
        wx.showToast({
          title: '设置成功',
          duration: 2000,
        })
      }
    });
  },
  comeback(){
    wx.navigateBack({
      
    })
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭
    clearInterval(this.data.loadingTime);
  },
  payOrder() {

  }
})