var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');



var app = getApp();

Page({
  data: {
    userCoupon: [],
    type: 0
  },
  onLoad: function (options) {
    let that = this;
    this.setData({
      type: options.type
    });
    var userinfo = app.getGlobalUserInfo();
    //获取用户的优惠券 卡卷 。。。
    util.request(api.UserCouponList, { userId: userinfo.id}).then(function (res) {
      if (res.status === 200) {
        that.setData({
          userCoupon: res.data
        })
      }
    });
  },
  goUse(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  itemClick(e){
    let that = this;
    var couponId = e.currentTarget.dataset.index;
    console.log(couponId);
    wx.setStorageSync("couponId", couponId);

    var type = that.data.type;
    if (type == 0){
      wx.redirectTo({
        url: '/pages/shopping/checkout/checkout'
      })
    }else if(type == 1){
      wx.redirectTo({
        url: '/pages/shopping/reservation/reservation'
      })
    }
    
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
  }
})