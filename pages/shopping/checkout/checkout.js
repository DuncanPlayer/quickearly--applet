var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const pay = require('../../../services/pay.js');

var app = getApp();

Page({
  data: {
    checkedGoodsList: [],
    checkedAddress: {},
    checkedCoupon: [],
    couponList: [],
    goodsTotalPrice: 0.00, //商品总价
    freightPrice: 0.00,    //配送费
    couponPrice: 0.00,     //优惠券的价格
    orderTotalPrice: 0.00,  //订单总价
    actualPrice: 0.00,     //实际需要支付的总价
    addressId: 0,
    couponId: 0,
    userInfo: {},
    content: ""
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    


  },
  bindInpuntValue(event){
    let value = event.detail.value;

    //判断是否超过140个字符
    if (value && value.length > 140) {
      return false;
    }

    this.setData({
      content: event.detail.value,
    })
  },
  getCheckoutInfo: function () {
    let that = this;
    that.setData({
      userInfo: app.getGlobalUserInfo(),
    });
    util.request(api.CartCheckout, { addressId: that.data.addressId, couponId: that.data.couponId,userId: that.data.userInfo.id}).then(function (res) {
      if (res.status === 200) {
        that.setData({
          checkedGoodsList: res.data.checkedGoodsList,
          checkedAddress: res.data.checkedAddress,
          actualPrice: res.data.actualPrice,
          checkedCoupon: res.data.checkedCoupon,
          couponList: res.data.couponList,
          couponPrice: res.data.couponPrice,
          freightPrice: res.data.freightPrice,
          goodsTotalPrice: res.data.goodsTotalPrice,
          orderTotalPrice: res.data.orderTotalPrice
        });
      }
      wx.hideLoading();
    });
  },
  selectAddress() {
    wx.navigateTo({
      url: '/pages/shopping/address/address',
    })
  },
  addAddress() {
    wx.navigateTo({
      url: '/pages/shopping/addressAdd/addressAdd',
    })
  },
  onReady: function () {
    // 页面渲染完成

  },
  choiceCoupon(){
    wx.navigateTo({
      url: '/pages/ucenter/coupon/coupon?type=0',
    })
  },
  onShow: function () {
    try {
      var addressId = wx.getStorageSync('addressId');
      if (addressId) {
        this.setData({
          'addressId': addressId
        });
      }
      //couponId优惠券ID
      var couponId = wx.getStorageSync('couponId');
      if (couponId) {
        this.setData({
          'couponId': couponId
        });
      }
    } catch (e) {
      // Do something when catch error
    }
    // 页面显示
    wx.showLoading({
      title: '加载中...',
    })
    this.getCheckoutInfo();
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  //记录订单得部分信息
  submitOrder: function () {
    if (this.data.addressId <= 0) {
      util.showErrorToast('请选择收货地址');
      return false;
    }
    var userInfo = app.getGlobalUserInfo();
    util.request(api.OrderSubmit, { addressId: this.data.addressId, couponId: this.data.couponId, actualPrice: this.data.actualPrice, content: this.data.content, userId: userInfo.id}).then(res => {
      if (res.status === 200) {
        const orderId = res.data;
        wx.redirectTo({
          url: '/pages/pay/pay?orderId=' + orderId + '&' + 'actualPrice=' + this.data.actualPrice
        });
      }
  });
  }
})