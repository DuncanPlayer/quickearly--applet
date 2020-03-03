var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var app = getApp();
var bmap = require('../../lib/bmap-wx.min.js');
var wxMarkerData = [];
Page({
    data: {
        // text:"这是一个页面"
        topicList: [],
        page: 1,
        size: 5,
        count: 30,
        scrollTop: 0,
        showPage: false
    },
    onLoad: function (options) {
      var that = this;
        // 页面初始化 options为页面跳转所带来的参数
        this.getTopic();
      //获取附近的提供早餐的店铺--
      var BMap = new bmap.BMapWX({
        ak: '6g8LoPkLqfHGk1Df4742ZobBbtPoXXrq'
      });
      var fail = function (data) {
        console.log(data)
      };
      var success = function (data) {
        wxMarkerData = data.wxMarkerData;
        console.log(wxMarkerData);
        that.getNearShop(wxMarkerData);
      }
      BMap.search({
        "query": '早餐店',
        fail: fail,
        success: success
      });
    },
    getNearShop: function(data){
      util.request(api.NearShop, { content: data}).then(function (res) {
        if (res.status == 200) {
          console.log(res.data);
        }
      });
    },
    onReady: function () {
        // 页面渲染完成
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
    nextPage: function (event) {
        console.log();
        var that = this;
        if (this.data.page+1 > that.data.count / that.data.size) {
            return true;
        }
        that.setData({
            "page": parseInt(that.data.page) + 1
        });

        this.getTopic();
        
    },
    getTopic: function(){
       
        let that = this;
         that.setData({
            scrollTop: 0,
            showPage: false,
            topicList: []
        });
        // 页面渲染完成
        wx.showToast({
            title: '加载中...',
            icon: 'loading',
            duration: 2000
        });

        util.request(api.TopicList, { page: that.data.page, size: that.data.size }).then(function (res) {
          if (res.status == 200) {
            that.setData({
              scrollTop: 0,
              topicList: res.data,
              showPage: true
              // count: res.data.count
            });
          }
          wx.hideToast();
        });
    },
    prevPage: function (event) {
        if (this.data.page <= 1) {
            return false;
        }

        var that = this;
        that.setData({
            "page": parseInt(that.data.page) - 1
        });
        this.getTopic();
    }
})