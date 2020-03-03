var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var app = getApp();

Page({
  data: {
    bannerInfo: {
      'img_url': '',
      'name': ''
    },
    categoryFilter: false,
    filterCategory: [],
    goodsList: [],
    categoryId: 0,
    currentSortType: 'default',
    currentSortOrder: 'desc',
    page: 1,
    size: 20
  },
  getData: function (id) {
    let that = this;
    util.request(api.NearShopCur, {shopId: id}).then(function (res) {
      if (res.status === 200) {
        that.setData({
          bannerInfo: res.data,
        });
        that.getGoodsList();
      }
    });
  },
  getGoodsList() {
    var that = this;
    util.request(api.NearShopList, {shopId: that.data.shopId, page: that.data.page, size: that.data.size, order: that.data.currentSortOrder, sort: that.data.currentSortType, categoryId: that.data.categoryId })
      .then(function (res) {
        if (res.status === 200) {
          that.setData({
            goodsList: res.data.goodsList,
            filterCategory: res.data.filterCategory
          });
        }
      });
  },
  onLoad: function (options) {
    this.setData({
      shopId: options.id
    });
    // 页面初始化 options为页面跳转所带来的参数
    this.getData(options.id);
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
  openSortFilter: function (event) {
    let currentId = event.currentTarget.id;
    let that = this;
    switch (currentId) {
      case 'categoryFilter':
        this.setData({
          'categoryFilter': !this.data.categoryFilter,
          'currentSortType': 'category',
          'currentSortOrder': 'asc'
        });
        break;
      case 'priceSort':
        let tmpSortOrder = 'asc';
        if (this.data.currentSortOrder == 'asc') {
          tmpSortOrder = 'desc';
        }
        this.setData({
          'currentSortType': 'price',
          'currentSortOrder': tmpSortOrder,
          'categoryFilter': false,
          'categoryId': 0
        });

        this.getData(that.data.shopId);
        break;
      default:
        //综合排序
        this.setData({
          'currentSortType': 'default',
          'currentSortOrder': 'desc',
          'categoryFilter': false,
          'categoryId': 0
        });
        this.getData(that.data.shopId);
    }
  },
  selectCategory: function (event) {
    let currentIndex = event.target.dataset.categoryIndex;
    let that = this;
    this.setData({
      'categoryFilter': false,
      'categoryId': this.data.filterCategory[currentIndex].categoryId
    });
    this.getData(that.data.shopId);
  }
})