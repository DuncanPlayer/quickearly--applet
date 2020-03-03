var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
var QQMapWX = require('../../../lib/qqmap-wx-jssdk.js');
var qqmapsdk;

Page({
  data: {
    longitude: 0.0,
    latitude: 0.0,
    polyline: "",
    latAndlong: "",
    startLat: 0.0,
    startLong: 0.0,
    endLat: 0.0,
    endLong: 0.0,
    makers: [],
    covers: []
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    qqmapsdk = new QQMapWX({
      key: 'GOJBZ-KTMH6-EG4SB-MB6PR-JNXSZ-MEFM2' // 必填
    });
    var lat = wx.getStorageSync("lat");
    var long = wx.getStorageSync("long");

    that.setData({
      latAndlong: lat+","+long,
      startLat: lat,
      startLong: long
    })
    that.formSubmit();
  },
  formSubmit() {
    var _this = this;
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        var startPoint = latitude+","+longitude;
        
        //调用距离计算接口
        qqmapsdk.direction({
          mode: 'walking',//可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
          //from参数不填默认当前地址
          from: startPoint,
          to: _this.data.latAndlong,
          success: function (res) {
            console.log(res);
            var ret = res;
            //距离
            var distance = ret.result.routes[0].distance;
            //time
            var time = ret.result.routes[0].duration;

            var coors = ret.result.routes[0].polyline, pl = [];
            //坐标解压（返回的点串坐标，通过前向差分进行压缩）
            var kr = 1000000;
            for (var i = 2; i < coors.length; i++) {
              coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
            }
            //将解压后的坐标放入点串数组pl中
            for (var i = 0; i < coors.length; i += 2) {
              pl.push({ latitude: coors[i], longitude: coors[i + 1] })
            }
            //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
            _this.setData({
              latitude: pl[0].latitude,
              longitude: pl[0].longitude,
              polyline: [{
                points: pl,
                color: '#00C957DD',
                width: 12
              }]
            });

            _this.setData({
              endLat: latitude,
              endLong: longitude,
              makers: [{
                id: 0,
                latitude: latitude,
                longitude: longitude,
                iconPath: '/static/images/wm.png',
                width: 50,
                height: 50,
                callout: {
                  content: "全程" + distance + "m,预计" + time + "分钟" + ",师傅正准备中...",
                  padding: 10,
                  display: 'ALWAYS',
                  textAlign: 'center',
                  borderRadius: 10,
                  borderColor: '#00C957',
                  borderWidth: 2,
                }
              },{
                id: 1,
                latitude: _this.data.startLat,
                longitude: _this.data.startLong,
                iconPath: '/static/images/person.png',
                width: 50,
                height: 50,
              }]
            })
            
          },
          fail: function (error) {
            console.error(error);
          },
          complete: function (res) {
            console.log(res);
          }
        });
      },
    })


  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    let that = this;
    // 页面显示



  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})