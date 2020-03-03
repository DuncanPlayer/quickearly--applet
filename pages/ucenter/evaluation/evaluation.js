const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const user = require('../../../services/user.js');
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    starDesc: '非常满意，无可挑剔',
    IPServer: '',
    stars: [{
      lightImg: 'http://192.168.43.12:8080/early/qrCode/face/star_light.png',
      blackImg: 'http://192.168.43.12:8080/early/qrCode/face/star_black.png',
      flag: 1,
      message: '非常不满意，各方面都很差'
    }, {
        lightImg: 'http://192.168.43.12:8080/early/qrCode/face/star_light.png',
        blackImg: 'http://192.168.43.12:8080/early/qrCode/face/star_black.png',
      flag: 1,
      message: '不满意，比较差'
    }, {
        lightImg: 'http://192.168.43.12:8080/early/qrCode/face/star_light.png',
        blackImg: 'http://192.168.43.12:8080/early/qrCode/face/star_black.png',
      flag: 1,
      message: '一般，还要改善'
    }, {
        lightImg: 'http://192.168.43.12:8080/early/qrCode/face/star_light.png',
        blackImg: 'http://192.168.43.12:8080/early/qrCode/face/star_black.png',
      flag: 1,
      message: '比较满意，仍要改善'
    }, {
        lightImg: 'http://192.168.43.12:8080/early/qrCode/face/star_light.png',
        blackImg: 'http://192.168.43.12:8080/early/qrCode/face/star_black.png',
      flag: 1,
      message: '非常满意，无可挑剔'
    }],
    assessLists: [{ name: '口碑很好', isChecked: false, index: 0 }, { name: '态度非常好', isChecked: false, index: 1 }, { name: '店家很敬业', isChecked: false, index: 2 }, { name: '耐心细致', isChecked: false, index: 3 }, { name: '配送速度快', isChecked: false, index: 4 }, { name: '回复很及时', isChecked: false, index: 5 }],
    imgs: [],
    list: '',
    upload_picture_list: [],
    goods: {},
    descrip: [],
    goodsSn: 0,
    content: "",
    orderId: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      IPServer: app.serverUrl
    })
    that.setData({
      goodsSn: options.goodsSn,
      orderId: options.orderId
    })

    util.request(api.FindGoods, { goodsSn: that.data.goodsSn }).then(function (res) {
      if (res.status === 200) {
        that.setData({
          goods: res.data
        });
      }
    });
  },
  choice:function(event){
    var index = event.currentTarget.dataset.index;
    var indexInt = parseInt(index);
    let that = this;
    if (that.data.assessLists[indexInt].isChecked == true){
      that.data.assessLists[indexInt].isChecked = false;
      var arrayCopy = [];
      for (var i = 0;i < that.data.descrip.length;i++){
        if (that.data.assessLists[indexInt].name != that.data.assessLists[i].name){
          arrayCopy.push(that.data.assessLists[i].name);
        }
      }
      that.setData({
        descrip: arrayCopy
      })
    }else{
      that.data.assessLists[indexInt].isChecked = true;
      that.data.descrip.push(that.data.assessLists[indexInt].name);
      that.setData({
        descrip: that.data.descrip
      })
    }
    that.setData({
      assessLists: that.data.assessLists
    })

    console.log(that.data.descrip);
  },

  // 选择评价星星
  starClick: function (e) {
    var that = this;
    for (var i = 0; i < that.data.stars.length; i++) {
      var allItem = 'stars[' + i + '].flag';
      that.setData({
        [allItem]: 2
      })
    }
    var index = e.currentTarget.dataset.index;
    for (var i = 0; i <= index; i++) {
      var item = 'stars[' + i + '].flag';
      that.setData({
        [item]: 1
      })
    }
    this.setData({
      starDesc: this.data.stars[index].message
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //选择图片方法
  uploadpic: function (e) {
    let that = this //获取上下文
    let upload_picture_list = that.data.upload_picture_list
    //选择图片
    wx.chooseImage({
      count: 8, // 默认9，这里显示一次选择相册的图片数量 
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) { // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片 
        let tempFiles = res.tempFiles
        //把选择的图片 添加到集合里
        for (let i in tempFiles) {
          tempFiles[i]['upload_percent'] = 0
          tempFiles[i]['path_server'] = ''
          upload_picture_list.push(tempFiles[i])
        }
        //显示
        that.setData({
          upload_picture_list: upload_picture_list,
        });
        console.log(upload_picture_list);
      }
    })
  },
  //点击上传图片
  uploadimage(commentId) {
    let page = this
    let upload_picture_list = page.data.upload_picture_list
    //循环把图片上传到服务器 并显示进度       
    for (let j in upload_picture_list) {
      if (upload_picture_list[j]['upload_percent'] == 0) {
        //上传图片后端地址
        upload_file_server(page.data.IPServer+'comment/uploadImage.do?commentId='+commentId, page, upload_picture_list, j)
      }
    }
    let imgs = wx.setStorageSync('imgs', upload_picture_list);
  },
  // 点击删除图片
  deleteImg(e) {
    let upload_picture_list = this.data.upload_picture_list;
    let index = e.currentTarget.dataset.index;
    upload_picture_list.splice(index, 1);
    this.setData({
      upload_picture_list: upload_picture_list
    });
  },
  // 预览图片
  previewImg(e) {
    //获取当前图片的下标
    let index = e.currentTarget.dataset.index;
    //所有图片
    let imgs = this.data.imgs;
    wx.previewImage({
      //当前显示图片
      current: imgs[index],
      //所有图片
      urls: imgs
    })
  },
  bindValueInput: function(e){
    this.setData({
      content: e.detail.value
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  },
  submintEvaluation: function(){
    let that = this;
    let userinfo = app.getGlobalUserInfo();
    util.request(api.CommentEval, { goodsSn: that.data.goodsSn,userId: userinfo.id,content: that.data.content,orderId: that.data.orderId}).then(function (res) {
      if (res.status === 200) {
        that.uploadimage(res.data);
      }
    });
    setTimeout(function(){
      wx.redirectTo({
        url: '/pages/ucenter/evaluationList/evaluationList',
      })
    },2000)
  }
})



/**
 * 上传图片方法
 */
function upload_file_server(url, that, upload_picture_list, j) {
  //上传返回值
  const upload_task = wx.uploadFile({
    // 模拟https
    url: url, //需要用HTTPS，同时在微信公众平台后台添加服务器地址  
    filePath: upload_picture_list[j]['path'], //上传的文件本地地址    
    name: 'file',
    header: {
      'content-type': 'application/json' //, 默认值
    },
    //附近数据，这里为路径     
    success: function (res) {
      var data = JSON.parse(res.data);
      var filename = data.data //存储地址 显示
      wx.showToast({
        title: '评价成功!~~',
        icon: "success"
      });
      // //字符串转化为JSON  
      if (res.status == 200) {
        upload_picture_list[j]['path_server'] = "http://192.168.43.12:8080/early" + filename
      } else {
        upload_picture_list[j]['path_server'] = "http://192.168.43.12:8080/early" + filename
      }
      that.setData({
        upload_picture_list: upload_picture_list
      });
      wx.setStorageSync('imgs', upload_picture_list);
    }
  })
  //上传 进度方法
  upload_task.onProgressUpdate((res) => {
    upload_picture_list[j]['upload_percent'] = res.progress
    that.setData({
      upload_picture_list: upload_picture_list
    });
  });
}