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
    content: "",
    endTime: "",
    date: '',
    datePickerValue: ['', '', ''],
    datePickerIsShow: false,
    touch_start: 0,
    touch_end: 0
  },
  showDatePicker: function (e) {
    // this.data.datePicker.show(this);
    this.setData({
      datePickerIsShow: true,
    });
  },
  datePickerOnSureClick: function (e) {
    console.log('datePickerOnSureClick');
    console.log(e);
    this.setData({
      date: `${e.detail.value[0]}年${e.detail.value[1]}月${e.detail.value[2]}日${e.detail.value[3]}时${e.detail.value[4]}分`,
      datePickerValue: e.detail.value,
      datePickerIsShow: false,
    });
  },

  datePickerOnCancelClick: function (event) {
    console.log('datePickerOnCancelClick');
    console.log(event);
    this.setData({
      datePickerIsShow: false,
    });
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
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


  },
  choiceCoupon() {
    wx.navigateTo({
      url: '/pages/ucenter/coupon/coupon?type=1',
    })
  },
  openGoods(event) {
    let that = this;
    let goodsId = this.data.checkedGoodsList[event.currentTarget.dataset.index].id;
    let goodsSn = this.data.checkedGoodsList[event.currentTarget.dataset.index].goodsSn;
    var userinfo = app.getGlobalUserInfo();
    //触摸时间距离页面打开的毫秒数  
    var touchTime = that.data.touch_end - that.data.touch_start;
    console.log(touchTime);
    //如果按下时间大于350为长按  
    if (touchTime > 350) {
      wx.showModal({
        title: '',
        content: '确定删除吗？',
        success: function (res) {
          if (res.confirm) {
            util.request(api.DeleteReservation, { typeId: 1, valueId: goodsSn, userId: userinfo.id }).then(function (res) {
              if (res.status === 200) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000
                });
                that.getCheckoutInfo();
              }
            });
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/goods/goods?id=' + goodsId,
      });
    }
  },
  //按下事件开始  
  touchStart: function (e) {
    let that = this;
    that.setData({
      touch_start: e.timeStamp
    })
    console.log(e.timeStamp + '- touch-start')
  },
  //按下事件结束  
  touchEnd: function (e) {
    let that = this;
    that.setData({
      touch_end: e.timeStamp
    })
    console.log(e.timeStamp + '- touch-end')
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
    util.request(api.MaterialReservationCheckout, { addressId: that.data.addressId, couponId: that.data.couponId,userId: that.data.userInfo.id}).then(function (res) {
      if (res.status === 200) {
        that.setData({
          checkedGoodsList: res.data.materials,
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
  onShow: function () {
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
  endTime(event){
    let that = this;
    that.setData({
      endTime: event.detail.value
    })
  },
  //记录订单得部分信息
  submitReservation: function () {
    let that = this;
    if (this.data.addressId <= 0) {
      util.showErrorToast('请选择收货地址');
      return false;
    }
    var userInfo = app.getGlobalUserInfo();
    util.request(api.MaterialReservationSubmit, { addressId: this.data.addressId, couponId: this.data.couponId, actualPrice: this.data.actualPrice, content: this.data.content, endTime: that.data.endTime}).then(res => {
      if (res.status === 200) {
        const reservationId = res.data;
        wx.redirectTo({
          url: '/pages/reservationPay/reservationPay?reservationId=' + reservationId + '&' + 'actualPrice=' + this.data.actualPrice
        });
      }
  });
  }
})