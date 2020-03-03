//app.js
App({
  onLaunch: function () {
    try {
      this.globalData.userInfo = JSON.parse(wx.getStorageSync('userInfo'));
      this.globalData.token = wx.getStorageSync('token');
    } catch (e) {
      console.log(e);
    }
  },
  serverUrl: "http://192.168.43.12:8080/",
  IPAddress: "192.168.43.12:8080",
  fastdfsUrl: "http://192.168.43.2:88/",
  hdfsServerUrl: "http://192.168.43.42:8080",
  userInfo: null,

  setGlobalUserInfo: function (user) {
    wx.setStorageSync("userInfo", user);
  },
  getGlobalUserInfo: function () {
    return wx.getStorageSync("userInfo");
  },
  globalData: {
    userInfo: {
      nickname: '点击登录',
      avatar: 'http://yanxuan.nosdn.127.net/8945ae63d940cc42406c3f67019c5cb6.png'
    },
    token: '',
  }
})