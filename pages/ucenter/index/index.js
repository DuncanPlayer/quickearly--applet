const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const user = require('../../../services/user.js');
const app = getApp();

Page({
  data: {
    faceUrl: "../../../static/images/noneface.png",
    userInfo: {},
    hasUserInfo: false,
    showLoginDialog: false,
    orderIcon: 0,
    reservationIcon: 0
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    if (wx.getStorageSync("userInfo") != ""){
      util.request(api.IconNum).then(function (res) {
        if (res.status === 200) {
          wx.setStorageSync("reservationIcon", res.data.reservationNum);
          wx.setStorageSync("orderIcon", res.data.orderNum);
        }
      });
    }
  },
  onReady: function() {
    if (wx.getStorageSync("userInfo") != "") {
      util.request(api.IconNum).then(function (res) {
        if (res.status === 200) {
          wx.setStorageSync("reservationIcon", res.data.reservationNum);
          wx.setStorageSync("orderIcon", res.data.orderNum);
        }
      });
    }
  },
  onShow: function() {
    var that = this;
    this.setData({
      userInfo: app.getGlobalUserInfo(),
    });
    if (that.data.userInfo.avatar != undefined) {
      this.setData({
        faceUrl: app.fastdfsUrl + that.data.userInfo.avatar
      })
    }

    if (wx.getStorageSync("userInfo") != "") {
      util.request(api.IconNum).then(function (res) {
        if (res.status === 200) {
          wx.setStorageSync("reservationIcon", res.data.reservationNum);
          wx.setStorageSync("orderIcon", res.data.orderNum);
        }
      });
    }

    var iconNumGet = wx.getStorageSync("orderIcon");
    that.setData({
      orderIcon: iconNumGet == "" ? 0 : iconNumGet
    })

    var reservationIcon = wx.getStorageSync("reservationIcon");
    that.setData({
      reservationIcon: reservationIcon == "" ? 0 : reservationIcon
    })
  },
  onHide: function() {
    // 页面隐藏
    if (wx.getStorageSync("userInfo") != "") {
      util.request(api.IconNum).then(function (res) {
        if (res.status === 200) {
          wx.setStorageSync("reservationIcon", res.data.reservationNum);
          wx.setStorageSync("orderIcon", res.data.orderNum);
        }
      });
    }
  },
  onUnload: function() {
    //页面关闭
    if (wx.getStorageSync("userInfo") != "") {
      util.request(api.IconNum).then(function (res) {
        if (res.status === 200) {
          wx.setStorageSync("reservationIcon", res.data.reservationNum);
          wx.setStorageSync("orderIcon", res.data.orderNum);
        }
      });
    }
  },

  changeFace: function () {
    var me = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths[0]);

        wx.showLoading({
          title: '上传中...',
        })
        //var serverUrl = app.serverUrl;
        var userInfo = app.getGlobalUserInfo();

        wx.uploadFile({
          url: app.hdfsServerUrl + '/auth/uploadFace?userId=' + userInfo.id,
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            'content-type': 'application/json' //, 默认值
          },
          success: function (res) {
            var data = JSON.parse(res.data);
            wx.hideLoading();
            if (data.status == 200) {
              wx.showToast({
                title: '上传成功!~~',
                icon: "success"
              });
              var imageUrl = data.data;
              me.setData({
                faceUrl: app.fastdfsUrl + data.data.fastdfsPath
              });
              //更新用户缓存
              app.setGlobalUserInfo(data.data.userInfo);
            } else if (data.status == 500) {
              wx.showToast({
                title: data.msg
              });
            } else if (res.data.status == 502) {
              wx.showToast({
                title: res.data.msg,
                duration: 2000,
                icon: "none",
                success: function () {
                  wx.redirectTo({
                    url: '../userLogin/login',
                  })
                }
              });
            }
          }
        })
      }
    })
  },

  onUserInfoClick: function() {
    if (wx.getStorageSync('userInfo') != '') {
      //用户已经登录
    } else {
      this.showLoginDialog();
    }
  },

  showLoginDialog() {
    wx.navigateTo({
      url: '../../auth/login/login',
    })
  },

  onCloseLoginDialog () {
    this.setData({
      showLoginDialog: false
    })
  },

  onDialogBody () {
    // 阻止冒泡
  },

  // onWechatLogin(e) {
  //   if (e.detail.errMsg !== 'getUserInfo:ok') {
  //     if (e.detail.errMsg === 'getUserInfo:fail auth deny') {
  //       return false
  //     }
  //     wx.showToast({
  //       title: '微信登录失败',
  //     })
  //     return false
  //   }
  //   util.login().then((res) => {
  //     return util.request(api.AuthLoginByWeixin, {
  //       code: res,
  //       userInfo: e.detail
  //     }, 'POST');
  //   }).then((res) => {
  //     console.log(res)
  //     if (res.errno !== 0) {
  //       wx.showToast({
  //         title: '微信登录失败',
  //       })
  //       return false;
  //     }
  //     // 设置用户信息
  //     this.setData({
  //       userInfo: res.data.userInfo,
  //       showLoginDialog: false
  //     });
  //     app.globalData.userInfo = res.data.userInfo;
  //     app.globalData.token = res.data.token;
  //     wx.setStorageSync('userInfo', JSON.stringify(res.data.userInfo));
  //     wx.setStorageSync('token', res.data.token);
  //   }).catch((err) => {
  //     console.log(err)
  //   })
  // },

  onOrderInfoClick: function(event) {
    wx.navigateTo({
      url: '/pages/ucenter/order/order',
    })
  },

  onSectionItemClick: function(event) {

  },

  // TODO 移到个人信息页面
  exitLogin: function() {
    var that = this;
    wx.showModal({
      title: '',
      confirmColor: '#b4282d',
      content: '退出登录？',
      success: function(res) {
        if (res.confirm) {
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          wx.removeStorageSync('reservationIcon');
          wx.removeStorageSync('orderIcon');
          wx.switchTab({
            url: '/pages/index/index'
          });
        }
      }
    });
    that.setData({
      faceUrl: '../../../static/images/noneface.png'
    });
  }
})