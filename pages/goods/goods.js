var app = getApp();
var WxParse = require('../../lib/wxParse/wxParse.js');
var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  data: {
    id: 0,
    goods: {},
    feel: {},
    gallery: [],
    attribute: [],
    issueList: [],
    prictice:[],
    retailPrice: 0,
    comment: [],
    brand: {},
    brandId: 0,
    specificationList: [],
    relatedGoods: [],
    cartGoodsCount: 0,
    userHasCollect: 0,
    userInfo: {},
    number: 1,
    resPrice: 0,
    checkedSpecText: '请选择规格数量',
    openAttr: false,
    noCollectImage: "/static/images/icon_collect.png",
    hasCollectImage: "/static/images/icon_collect_checked.png",
    collectBackImage: "/static/images/icon_collect.png",
    appServer:''
  },
  getGoodsInfo: function () {
    let that = this;
    var InventoryCacheChangeURL = "http://192.168.43.129:8088/product?requestPath=product&productId=" + that.data.id;
    //api.GoodsDetail, { id: that.data.id }
    util.request(InventoryCacheChangeURL).then(function (res) {
      if (res.status === 200) {
        that.setData({
          goods: res.data.info,
          brandId: res.data.info.brandId,
          feel:res.data.feel,
          gallery: res.data.gallery,  //图片集合
          attribute: res.data.attribute,
          issueList: res.data.issue,  //常见问题
          comment: res.data.comment,
          brand: res.data.brand,  //店铺
          specificationList: res.data.specificationList,
          //productList: res.data.productList,
          prictice:res.data.prictice,
          userHasCollect: res.data.userHasCollect,
          retailPrice: res.data.info.retailPrice,
          id: res.data.info.goodsSn
        });

        //检查是否已经收藏
        util.request(api.GoodsisCollect, { id: res.data.info.goodsSn }).then(function (res) {
          if (res.status === 200) {
            console.log(res.data);
            if (res.data == "true") {
              that.setData({
                'collectBackImage': that.data.hasCollectImage
              });
            } else {
              that.setData({
                'collectBackImage': that.data.noCollectImage
              });
            }
          }
        });

        // if (res.data.userHasCollect == 1) {
        //   that.setData({
        //     'collectBackImage': that.data.hasCollectImage
        //   });
        // } else {
        //   that.setData({
        //     'collectBackImage': that.data.noCollectImage
        //   });
        // }

        that.getGoodsRelated();
      }
    });

    

  },
  reservation(){
    let that = this;
    
    if (this.data.openAttr === false) {
      //打开规格选择窗口
      this.setData({
        openAttr: !this.data.openAttr
      });
    }else{
      //验证库存
      if (that.data.goods.goodsNumber < this.data.number) {
        wx.showToast({
          image: '/static/images/icon_error.png',
          title: '库存不足',
          mask: true
        });
        return false;
      }
      var userInfo = app.getGlobalUserInfo();
      //1 添加到currentCart
      util.request(api.Reservation, {userId:userInfo.id, goodsSn: that.data.goods.goodsSn, retailPrice: that.data.retailPrice, number: that.data.number }).then(function (res) {
        if (res.status === 200) {
          console.log("预定成功");
        }
      });
      //立即预定
      wx.navigateTo({
        url: '../shopping/reservation/reservation'
      })
    }
  },
  getGoodsRelated: function () {
    let that = this;
    that.setData({
      userInfo: app.getGlobalUserInfo(),
    });
    util.request(api.GoodsRelated, { id: that.data.id,userId: that.data.userInfo.id}).then(function (res) {
      if (res.status === 200) {
        that.setData({
          relatedGoods: res.data,
        });
      }
    });

  },
  onLoad: function (options) {
    this.setData({
      appServer: app.fastdfsUrl
    })
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      id: parseInt(options.id)
    });
    var that = this;
    this.getGoodsInfo();
    var userinfo = app.getGlobalUserInfo();
    util.request(api.CartGoodsCount, { userId: userinfo.id}).then(function (res) {
      if (res.status === 200) {
        that.setData({
          cartGoodsCount: res.data
        });
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
  switchAttrPop: function () {
    if (this.data.openAttr == false) {
      this.setData({
        openAttr: !this.data.openAttr
      });
    }
  },
  closeAttr: function () {
    this.setData({
      openAttr: false,
    });
  },
  addCannelCollect: function () {
    let that = this;
    var userinfo = app.getGlobalUserInfo();
    //添加或是取消收藏
    util.request(api.CollectAddOrDelete, { typeId: 0, valueId: this.data.id,userId: userinfo.id })
      .then(function (res) {
        let _res = res;
        if (_res.status == 200) {
          if (_res.data == 'add') {
            that.setData({
              'collectBackImage': that.data.hasCollectImage
            });
          } else {
            that.setData({
              'collectBackImage': that.data.noCollectImage
            });
          }

        } else {
          wx.showToast({
            image: '/static/images/icon_error.png',
            title: _res.errmsg,
            mask: true
          });
        }
      });
  },
  openCartPage: function () {
    wx.switchTab({
      url: '/pages/cart/cart',
    });
  },
  addToCart: function () {
    var that = this;
    var userinfo = app.getGlobalUserInfo();
    if (this.data.openAttr === false) {
      //打开规格选择窗口
      this.setData({
        openAttr: !this.data.openAttr
      });
    } else {
      //验证库存
      if (that.data.goods.goodsNumber < this.data.number) {
        wx.showToast({
          image: '/static/images/icon_error.png',
          title: '库存不足',
          mask: true
        });
        return false;
      }

      //添加到购物车
      util.request(api.CartAdd, { userId: userinfo.id, goodsId: this.data.goods.goodsSn, number: this.data.number,resPrice: this.data.resPrice})
        .then(function (res) {
          let _res = res;
          if (_res.status === 200) {
            wx.showToast({
              title: '添加成功'
            });
            that.setData({
              openAttr: !that.data.openAttr,
              cartGoodsCount: _res.data
            });
          } else {
            wx.showToast({
              image: '/static/images/icon_error.png',
              title: _res.errmsg,
              mask: true
            });
          }
        });
    }

  },
  cutNumber: function () {
    this.setData({
      number: (this.data.number - 1 > 1) ? this.data.number - 1 : 1
    });
  },
  addNumber: function () {
    this.setData({
      number: this.data.number + 1
    });
  },
  clickSkuValue: function (event) {
    let that = this;
    let specNameId = event.currentTarget.dataset.nameId;
    let specValueId = event.currentTarget.dataset.valueId;
    let price = that.data.goods.retailPrice;
    //判断是否可以点击

    //TODO 性能优化，可在wx:for中添加index，可以直接获取点击的属性名和属性值，不用循环
    let _specificationList = this.data.specificationList;
    for (let i = 0; i < _specificationList.length; i++) {
      if (_specificationList[i].specificationId == specNameId) {
        for (let j = 0; j < _specificationList[i].valueList.length; j++) {
          if (_specificationList[i].valueList[j].id == specValueId) {
            //如果已经选中，则反选
            if (_specificationList[i].valueList[j].isChecked == 'true') {
              _specificationList[i].valueList[j].isChecked = 'false';
            } else {
              _specificationList[i].valueList[j].isChecked = 'true';
              if (_specificationList[i].valueList[j].value == '一两'){
                that.setData({
                  retailPrice: price,
                  resPrice: price
                })
              }else{
                that.setData({
                  retailPrice: price + parseInt(_specificationList[i].valueList[j].picUrl),
                  resPrice: price + parseInt(_specificationList[i].valueList[j].picUrl)
                })
              }
            }
          } else {
            _specificationList[i].valueList[j].isChecked = 'false';
          }
        }
      }
    }
    this.setData({
      'specificationList': _specificationList
    });
    //重新计算spec改变后的信息
    this.changeSpecInfo();

    //重新计算哪些值不可以点击
  },
  changeSpecInfo: function () {
    let checkedNameValue = this.getCheckedSpecValue();
    //设置选择的信息
    let checkedValue = checkedNameValue.filter(function (v) {
      if (v.valueId != 0) {
        return true;
      } else {
        return false;
      }
    }).map(function (v) {
      return v.valueText;
    });
    if (checkedValue.length > 0) {
      this.setData({
        'checkedSpecText': checkedValue.join('　')
      });
    } else {
      this.setData({
        'checkedSpecText': '请选择规格数量'
      });
    }
  },
  //获取选中的规格信息
  getCheckedSpecValue: function () {
    let checkedValues = [];
    let _specificationList = this.data.specificationList;
    for (let i = 0; i < _specificationList.length; i++) {
      let _checkedObj = {
        nameId: _specificationList[i].specificationId,
        valueId: 0,
        valueText: ''
      };
      for (let j = 0; j < _specificationList[i].valueList.length; j++) {
        if (_specificationList[i].valueList[j].isChecked == 'true') {
          _checkedObj.valueId = _specificationList[i].valueList[j].specificationId;
          _checkedObj.valueText = _specificationList[i].valueList[j].value;
        }
      }
      checkedValues.push(_checkedObj);
    }
    return checkedValues;
  }
})