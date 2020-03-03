var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
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
    categoryName: '',
    currentSortType: 'default',
    currentSortOrder: 'desc',
    page: 1,
    size: 50
  },
  getData: function () {
    let that = this;
    util.request(api.GoodsHot).then(function (res) {
      if (res.status === 200) {
        that.setData({
          bannerInfo: res.data,
        });
        that.getGoodsList();
      }
    });
  },
  getGoodsList (){
    var that = this;
    util.request(api.MaterialList, { isMaterial: 1, page: that.data.page, size: that.data.size, order: that.data.currentSortOrder, sort: that.data.currentSortType, categoryName: that.data.categoryName})
      .then(function (res) {
        if (res.status === 200) {
          that.setData({
            goodsList: res.data.materials,
            filterCategory: res.data.filterCategory
          });
        }
      });
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.getData();
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
          'categoryName': ''
        });

        this.getData();
        break;
      default:
        //综合排序
        this.setData({
          'currentSortType': 'default',
          'currentSortOrder': 'desc',
          'categoryFilter': false,
          'categoryName': ''
        });
        this.getData();
    }
  },
  selectCategory: function(event){
    let currentIndex = event.target.dataset.categoryIndex;
    this.setData({
      'categoryFilter': false,
      'categoryName': this.data.filterCategory[currentIndex].name
    });
    this.getData();

  }
})