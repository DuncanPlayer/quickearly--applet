var util = require('../../utils/util.js');
var api = require('../../config/api.js');

var app = getApp();

Page({
  data: {
    cartGoods: [],
    cartTotal: {
      "goodsCount": 0,
      "goodsAmount": 0.00,
      "checkedGoodsCount": 0,
      "checkedGoodsAmount": 0.00
    },
    isEditCart: false,
    checkedAllStatus: true,
    editCartList: [],
    avtivity: {}
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示
    var userinfo = app.getGlobalUserInfo();
    if (userinfo.id != undefined){
      this.getCartList();
    }else{
      this.setData({
        cartGoods: [],
        cartTotal: {
          "goodsCount": 0,
          "goodsAmount": 0.00,
          "checkedGoodsCount": 0,
          "checkedGoodsAmount": 0.00
        },
        avtivity: {}
      });
    }
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭
    
  },
  getCartList: function () {
    let that = this;
    var userinfo = app.getGlobalUserInfo();
    util.request(api.CartList, { userId: userinfo.id }).then(function (res) {
      if (res.status === 200) {
        that.setData({
          cartGoods: res.data.cartList,
          cartTotal: res.data.cartTotal,
          avtivity: res.data.goodsActicity
        });
      }
      that.setData({
        checkedAllStatus: that.isCheckedAll()
      });
    });
  },
  isCheckedAll: function () {
    //判断购物车商品已全选
    return this.data.cartGoods.every(function (element, index, array) {
      if (element.isChecked == 'true') {
        return true;
      } else {
        return false;
      }
    });
  },
  checkedItem: function (event) {
    let itemIndex = event.target.dataset.itemIndex;
    let that = this;
    var userinfo = app.getGlobalUserInfo();
    if (!this.data.isEditCart) {
      util.request(api.CartChecked, {userId: userinfo.id, productIds: that.data.cartGoods[itemIndex].goodsSn, isChecked: that.data.cartGoods[itemIndex].isChecked == 'false' ? 0 : 1, allChecked:0}).then(function (res) {
        if (res.status === 200) {
          that.setData({
            cartGoods: res.data.cartList,
            cartTotal: res.data.cartTotal
          });
        }

        that.setData({
          checkedAllStatus: that.isCheckedAll()
        });
      });
    } else {
      //编辑状态
      let tmpCartData = this.data.cartGoods.map(function (element, index, array) {
        if (index == itemIndex){
          if (element.isChecked == 'true'){
            element.isChecked = 'false';
          }else{
            element.isChecked = 'true';
          }
        }
        
        return element;
      });
      that.setData({
        cartGoods: tmpCartData,
        checkedAllStatus: that.isCheckedAll(),
        'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
      });
      var priceTotal = that.getCheckedGoodsAmount();
      if (priceTotal > 1.00){
        that.setData({
          'cartTotal.checkedGoodsAmount': that.getCheckedGoodsAmount()
        });
      }
    }
  },
  getCheckedGoodsCount: function(){
    let checkedGoodsCount = 0;
    this.data.cartGoods.forEach(function (v) {
      if (v.isChecked === 'true') {
        checkedGoodsCount += v.sellNum;
      }
    });
    return checkedGoodsCount;
  },

  getCheckedGoodsAmount: function () {
    let checkedGoodsAmount = 0.00;
    this.data.cartGoods.forEach(function (v) {
      if (v.isChecked === 'true') {
        checkedGoodsAmount += v.retailPrice*v.sellNum;
      }
    });
    return checkedGoodsAmount.toFixed(2);
  },


  checkedAll: function () {
    let that = this;

    if (!this.data.isEditCart) {
      var productIds = this.data.cartGoods.map(function (v) {
        return v.product_id;
      });
      var userinfo = app.getGlobalUserInfo();
      util.request(api.CartChecked, {userId: userinfo.id, productIds: 0,isChecked: 0, allChecked: that.isCheckedAll() ? 0 : 1 }).then(function (res) {
        if (res.status === 200) {
          that.setData({
            cartGoods: res.data.cartList,
            cartTotal: res.data.cartTotal
          });
        }
        that.setData({
          checkedAllStatus: that.isCheckedAll()
        });
      });
    } else {
      //编辑状态
      let checkedAllStatus = that.isCheckedAll();
      let tmpCartData = this.data.cartGoods.map(function (v) {
        if (v.isChecked == 'true') {
          v.isChecked = 'false';
        } else {
          v.isChecked = 'true';
        }
        return v;
      });
      that.setData({
        cartGoods: tmpCartData,
        checkedAllStatus: that.isCheckedAll(),
        'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
      });
      console.log("checkedAllStatus:" + checkedAllStatus);
      if (checkedAllStatus == false){
        that.setData({
          'cartTotal.checkedGoodsAmount': that.getCheckedGoodsAmount()
        });
      }
    }

  },

  editCart: function () {
    var that = this;
    if (this.data.isEditCart) {
      this.getCartList();
      this.setData({
        isEditCart: !this.data.isEditCart
      });
    } else {
      //编辑状态
      let tmpCartList = this.data.cartGoods.map(function (v) {
        v.isChecked = false;
        return v;
      });
      this.setData({
        editCartList: this.data.cartGoods,
        cartGoods: tmpCartList,
        isEditCart: !this.data.isEditCart,
        checkedAllStatus: that.isCheckedAll(),
        'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount(),
        'cartTotal.checkedGoodsAmount': 0
      });
    }

  },


  updateCart: function (productId, goodsId, number, id) {
    let that = this;
    var userinfo = app.getGlobalUserInfo();
    util.request(api.CartUpdate, {
      userId: userinfo.id,
      productId: productId,
      goodsId: goodsId,
      number: number,
      id: id
    }).then(function (res) {
      if (res.status === 200) {
        that.setData({
          cartGoods: res.data.cartList,
          cartTotal: res.data.cartTotal
        });
      }
      that.setData({
        checkedAllStatus: that.isCheckedAll()
      });
    });

  },


  cutNumber: function (event) {
    let itemIndex = event.target.dataset.itemIndex;
    let cartItem = this.data.cartGoods[itemIndex];
    let number = (cartItem.sellNum - 1 > 1) ? cartItem.sellNum - 1 : 1;
    cartItem.sellNum = number;
    this.setData({
      cartGoods: this.data.cartGoods
    });
    this.updateCart(cartItem.goodsSn, cartItem.goodsSn, number, cartItem.id);
  },
  addNumber: function (event) {
    let itemIndex = event.target.dataset.itemIndex;
    let cartItem = this.data.cartGoods[itemIndex];
    let number = cartItem.sellNum + 1;
    cartItem.sellNum = number;
    this.setData({
      cartGoods: this.data.cartGoods
    });
    this.updateCart(cartItem.goodsSn, cartItem.goodsSn, number, cartItem.id);

  },
  checkoutOrder: function () {
    //获取已选择的商品
    let that = this;
    var userinfo = app.getGlobalUserInfo();
    if (userinfo.id != undefined){
      this.setData({
        cartTotal: {
          "goodsCount": 0,
          "goodsAmount": 0.00,
          "checkedGoodsCount": 0,
          "checkedGoodsAmount": 0.00
        }
      })
      var checkedGoods = this.data.cartGoods.filter(function (element, index, array) {
        if (element.isChecked == 'true') {
          return true;
        } else {
          return false;
        }
      });
      if (checkedGoods.length <= 0) {
        return false;
      }
      wx.navigateTo({
        url: '../shopping/checkout/checkout'
      })
    }else{
      //未登录状态下下单

    }
  },

  deleteCart: function () {
    //获取已选择的商品
    let that = this;

    let productIds = this.data.cartGoods.filter(function (element, index, array) {
      if (element.isChecked == 'true') {
        return true;
      } else {
        return false;
      }
    });

    if (productIds.length <= 0) {
      return false;
    }

    productIds = this.data.cartGoods.map(function (element, index, array) {
      if (element.isChecked == 'true') {
        console.log(element.goodsSn);
        return element.goodsSn;
      }
    });


    util.request(api.CartDelete, {
      productIds: productIds.join(',')
    }).then(function (res) {
      if (res.status === 200) {
        let cartList = res.data.cartList.map(v => {
          v.isChecked = 'false';
          return v;
        });

        that.setData({
          cartGoods: cartList,
          cartTotal: res.data.cartTotal
        });
      }

      that.setData({
        checkedAllStatus: that.isCheckedAll()
      });
    });
  }
})