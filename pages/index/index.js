var app = getApp();
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../services/user.js');
//获取应用实例


Page({
  data: {
    newGoods: [],
    hotGoods: [],
    topics: [],
    brands: [],
    floorGoods: [],
    banner: [],
    channel: [],
    showModal: false,
    coupon: []
  },
  onShareAppMessage: function () {
    return {
      title: 'NideShop',
      desc: '趁早',
      path: '/pages/index/index'
    }
  },
  // 禁止屏幕滚动
  preventTouchMove: function () {
  },

  // 弹出层里面的弹窗
  ok: function () {
    let that = this;
    var userinfo = app.getGlobalUserInfo();
    //添加用户优惠券 ----就不再领取
    util.request(api.ReceiveRedEnvelope, { userId: userinfo.id,couponId: 4}).then(function (res) {
      if (res.status === 200) {
        that.setData({
          showModal: false
        })
        wx.setStorageSync("showModal", that.data.showModal);
      }
    });
  },
  //关闭并且记录用户优惠卷
  close:function(){
    let that = this;
    this.ok();
  },
  getIndexData: function () {
    let that = this;
    util.request(api.IndexUrl).then(function (res) {
      if (res.status === 200) {
        that.setData({
          newGoods: res.data.newGoodsList,
          hotGoods: res.data.hotGoodsList,
          topics: res.data.topicList,
          brand: res.data.brandList,
          floorGoods: res.data.categoryList,
          channel: res.data.channel
        });
      }
    });
    //banner热更新
    util.request(api.BannerUpdate).then(function (res) {
      that.setData({
        banner: res
      });
    });
    //Coupon
    util.request(api.Coupon).then(function (res) {
      that.setData({
        coupon: res
      });
    });
  },
  onLoad: function (options) {
    this.getIndexData();
    let that = this;
    var modal = false;
    //查询优惠卷剩余数量
    util.request(api.QueryCouponNumber, { couponId: 4 }).then(function (res) {
      if (parseInt(res.data) > 0){
        modal = true;
      }
    });
    modal = wx.getStorageSync("showModal");
    if (modal === "" || modal == null || modal == undefined) {
      modal = true;
    }
    var userinfo = app.getGlobalUserInfo();
    if (userinfo === null || userinfo === undefined){
      modal = false;
    }
    this.setData({
      showModal: modal
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
})
