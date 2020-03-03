var app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  data: {
    comments: [],
    allCommentList: [],
    picCommentList: [],
    highCommentList: [],
    middleCommentList: [],
    badCommentList: [],
    typeId: 0,
    valueId: 0,
    showType: 0,
    allCount: 0,
    hasPicCount: 0,
    highPraise: 0,
    middlePraise: 0,
    badPraise: 0,
    allPage: 1,
    picPage: 1,
    highPage: 1,
    middlePage: 1,
    badPage: 1,
    size: 20,
    IPServer: '',
    userServer: ""
  },
  getCommentCount: function () {
    let that = this;
    util.request(api.CommentCount, { valueId: that.data.valueId, typeId: that.data.typeId}).then(function (res) {
      if (res.status === 200) {
        that.setData({
          allCount: res.data.allCount,
          hasPicCount: res.data.hasPicCount,
          highPraise: res.data.highPraise,
          middlePraise: res.data.middlePraise,
          badPraise: res.data.badPraise
        });
      }
    });
  },
  getCommentList: function(){
    let that = this;
    util.request(api.CommentList2, { 
      valueId: that.data.valueId, 
      typeId: that.data.typeId, 
      size: that.data.size,
      page: (that.data.showType == 0 ? that.data.allPage : that.data.picPage),
      showType: that.data.showType 
      }).then(function (res) {
      if (res.status === 200) {
        if (that.data.showType == 0) {
          that.setData({
            allCommentList: that.data.allCommentList.concat(res.data.commentList),
            allPage: res.data.currentPage,
            comments: res.data.commentList
          });
        } else if (that.data.showType == 1){
          that.setData({
            picCommentList: that.data.picCommentList.concat(res.data.commentList),
            picPage: res.data.currentPage,
            comments: res.data.commentList
          });
        } else if (that.data.showType == 2){
          that.setData({
            highCommentList: that.data.picCommentList.concat(res.data.commentList),
            highPage: res.data.currentPage,
            comments: res.data.commentList
          });
        } else if (that.data.showType == 3) {
          that.setData({
            middleCommentList: that.data.picCommentList.concat(res.data.commentList),
            middlePage: res.data.currentPage,
            comments: res.data.commentList
          });
        } else if (that.data.showType == 4) {
          that.setData({
            badCommentList: that.data.picCommentList.concat(res.data.commentList),
            badPage: res.data.currentPage,
            comments: res.data.commentList
          });
        }
      }
    });
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      typeId: options.typeId,
      valueId: options.valueId
    });
    this.getCommentCount();
    this.getCommentList();
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示
    var that = this;
    that.setData({
      IPServer: app.serverUrl,
      userServer: app.fastdfsUrl
    })
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  switchTab: function (event) {
    var type = event.currentTarget.dataset.itemType;
    switch(type){
      case '0':
        this.setData({
          showType: 0
        });
        break;
      case '1':
        this.setData({
          showType: 1
        });
        break;
      case '2':
        this.setData({
          showType: 2
        });
        break;
      case '3':
        this.setData({
          showType: 3
        });
        break;
      case '4':
        this.setData({
          showType: 4
        });
        break;
    }
    

    this.getCommentList();
  },
  onReachBottom: function(){
    console.log('onPullDownRefresh');
    if ( this.data.showType == 0) {

      if (this.data.allCount / this.data.size < this.data.allPage) {
        return false;
      }

      this.setData({
        'allPage' : this.data.allPage + 1
      });
    } else {
      if (this.data.hasPicCount / this.data.size < this.data.picPage) {
        return false;
      }

      this.setData({
        'picPage': this.data.picPage + 1
      });
    }



    this.getCommentList();
  }
})