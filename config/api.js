const ApiRootUrl = 'http://192.168.43.42:8080/';
//const BACKHAM = 'http://192.168.43.12:80/'
const EARLYCHAT = "http://192.168.43.42:8080/";
const EarlySearch = "http://192.168.43.42:8099/";
const EarlyCart = "http://192.168.43.42:8080/";

module.exports = {
  QueryCouponNumber: ApiRootUrl + 'package/queryCouponNumber.do',
  Coupon: ApiRootUrl + 'json/coupon.json',
  BannerUpdate: ApiRootUrl + 'json/banner.json',
  ChatHistoryMsg: EARLYCHAT + 'getHistoryMsg',
  GETALLSHOPMSG:   + 'getAllShopInfo',
  IndexUrl: ApiRootUrl + 'index/index.do', //首页数据接口
  CatalogList: ApiRootUrl + 'catalog/index.do',  //分类目录全部分类数据接口
  CatalogCurrent: ApiRootUrl + 'catalog/current.do',  //分类目录当前分类数据接口

  AuthLoginByWeixin: ApiRootUrl + 'auth/loginByWeixin.do', //微信登录
  RedEnvelope: ApiRootUrl + 'package/getRedEnvelope.do', //弹窗红包,
  ReceiveRedEnvelope: ApiRootUrl + 'package/addRedEnvelope.do', //领取弹窗红包,

  NearShopCur: ApiRootUrl + 'nearshop/shop.do',
  NearShopList: ApiRootUrl + 'nearshop/list.do',
  UserCouponList: ApiRootUrl + 'coupon/list.do', //userCoupon

  FindGoods: ApiRootUrl + 'goods/findone.do',
  GoodsCount: ApiRootUrl + 'goods/count.do',  //统计商品总数
  GoodsList: ApiRootUrl + 'goods/list.do',  //获得商品列表
  GoodsList1: ApiRootUrl + 'goods/listnew.do',  //获得新品列表
  GoodsList2: ApiRootUrl + 'goods/listhot.do',  //获得hot列表
  GoodsCategory: ApiRootUrl + 'goods/category.do',  //获得分类数据
  GoodsDetail: ApiRootUrl + 'goods/detail.do',  //获得商品的详情
  GoodsNew: ApiRootUrl + 'goods/new.do',  //新品
  GoodsHot: ApiRootUrl + 'goods/hot.do',  //热门
  GoodsRelated: ApiRootUrl + 'goods/related.do',  //商品详情页的关联商品（大家都在看）
  GoodsisCollect: ApiRootUrl + 'collect/isCollect.do',  //检查是否已经收藏

  MaterialList: ApiRootUrl + 'material/listMaterial.do', //食材展示
  MaterialDetail: ApiRootUrl + 'material/MaterialDetail.do', //食材详情
  MaterialReservation: ApiRootUrl + 'material/materialReservation.do', //食材预定
  MaterialReservationCheckout: ApiRootUrl + 'material/materialReservationCheckout.do',
  MaterialReservationSubmit: ApiRootUrl + 'material/materialReservationSubmit.do',

  SearchList: EarlySearch + 'search/list',  //获得搜索商品列表
  BrandList: ApiRootUrl + 'brand/list',  //品牌列表
  BrandDetail: ApiRootUrl + 'brand/detail',  //品牌详情

  IconNum: ApiRootUrl + 'material/iconNum.do',

  CartList: ApiRootUrl + 'cart/index.do', //获取购物车的数据 	EarlyCart
  CartAdd: ApiRootUrl + 'cart/add.do', // 添加商品到购物车
  CartUpdate: ApiRootUrl + 'cart/update.do', // 更新购物车的商品
  CartDelete: ApiRootUrl + 'cart/delete.do', // 删除购物车的商品
  CartChecked: ApiRootUrl + 'cart/checked.do', // 选择或取消选择商品
  CartGoodsCount: ApiRootUrl + 'cart/goodscount.do', // 获取购物车商品件数
  CartCheckout: ApiRootUrl + 'cart/checkout.do', // 下单前信息确认
  ReservationCartCheckout: ApiRootUrl + 'cart/reservationCartCheckout.do', // 预定前信息确认
  Reservation: ApiRootUrl + 'cart/reservation.do', // 立即预定
  DeleteReservation: ApiRootUrl + 'cart/deteleReservation.do', //删除预定的早餐

  OrderSubmit: ApiRootUrl + 'order/submit.do', // 提交订单
  ReservationSubmit: ApiRootUrl + 'order/reservationSubmit.do', // 提交预定
  PayPrepayId: ApiRootUrl + 'pay/prepay.do', //获取微信统一下单prepay_id
  PayPrepayIdForJAVA: ApiRootUrl + 'pay/prepayforJava.do', //获取微信统一下单prepay_id

  CollectList: ApiRootUrl + 'collect/list.do',  //收藏列表
  CollectAddOrDelete: ApiRootUrl + 'collect/addordelete.do',  //添加或取消收藏

  CommentList: ApiRootUrl + 'comment/list.do',  //评论列表
  CommentList2: ApiRootUrl + 'comment/list2.do',  //评论列表
  CommentCount: ApiRootUrl + 'comment/count.do',  //评论总数
  CommentPost: ApiRootUrl + 'comment/post.do',   //发表评论
  CommentEval: ApiRootUrl + 'comment/evaluation.do',   //评价

  NearShop: ApiRootUrl + 'topic/shop.do',
  TopicList: ApiRootUrl + 'topic/list.do',  //专题列表
  TopicDetail: ApiRootUrl + 'topic/detail.do',  //专题详情
  TopicRelated: ApiRootUrl + 'topic/related.do',  //相关专题

  SearchIndex: ApiRootUrl + 'search/index.do',  //搜索页面数据
  SearchResult: ApiRootUrl + 'search/result.do',  //搜索数据
  SearchHelper: ApiRootUrl + 'search/helper.do',  //搜索帮助
  SearchClearHistory: ApiRootUrl + 'search/clearhistory.do',  //搜索帮助

  AddressList: ApiRootUrl + 'address/list.do',  //收货地址列表
  AddressDetail: ApiRootUrl + 'address/detail.do',  //收货地址详情
  AddressSave: ApiRootUrl + 'address/save.do',  //保存收货地址
  AddressDelete: ApiRootUrl + 'address/delete.do',  //保存收货地址

  RegionList: ApiRootUrl + 'region/list.do',  //获取区域列表

  OrderList: ApiRootUrl + 'order/list.do',  //订单列表
  ReservationList: ApiRootUrl + 'order/reservationlist.do',  //预定列表
  OrderDetail: ApiRootUrl + 'order/detail.do',  //订单详情
  RservationDetail: ApiRootUrl + 'order/reservationdetail.do', //预定详情
  OrderCancel: ApiRootUrl + 'order/cancel.do',  //取消订单
  OrderExpress: ApiRootUrl + 'order/express.do', //物流详情

  FootprintList: ApiRootUrl + 'footprint/list.do',  //足迹列表
  FootprintDelete: ApiRootUrl + 'footprint/delete.do',  //删除足迹
  ReservationPay: ApiRootUrl + 'pay/reservationPay.do',
  QrCode: ApiRootUrl + 'qrCode/enCode.do',              //生成二维码
  SetTakeOrder: ApiRootUrl + 'qrCode/setTakeOrder.do',  //设置为到店取单
  SelectStatus: ApiRootUrl + 'qrCode/selectStatus.do'  //循环查询二维码状态
};