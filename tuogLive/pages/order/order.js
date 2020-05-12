// pages/order/order.js
import {
  orderList,
  pay
} from '../../utils/http.js'
import {
  doWxPay
} from '../../utils/public.js'
let page = 1,
  size = 10;
let sumList = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuList: [{
        name: "全部订单"
      },
      {
        name: "待付款"
      },
      {
        name: "待发货"
      },
      {
        name: "待收货"
      },
      {
        name: "已完成"
      }
    ],
    order: [],
    windowHeight: '',
    windowWidth: '',
    currentTab: 0,
    tabScroll: 0, //向左滑动宽度
    shopList: [],
    to_load: true
  },
  onLoad: function(options) {
    const that = this;
    if (options.type) {
      this.setData({
        currentTab: options.type || 0
      });
    } else {
      page = 1
      sumList = []
      this.orderList();
    }
    wx.getSystemInfo({ // 获取当前设备的宽高
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        });
      },
    });

  },
  onShow:function(){

  },
  orderList: function(e) {
    let that = this;
    if (!this.data.to_load) {
      return false;
    }
    let inds = this.data.currentTab || 0;
    if (inds == 0) {
      inds = "";
    } else if (inds >= 3) {
      inds++;
    }
    wx.showLoading({
      title: '加载中',
    });
    orderList({
      data: {
        status: inds,
        page: page,
        size: size
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.length < size) {
          that.setData({
            to_load: false
          });
        }
        res.data.forEach((item, index, arr) => {
          sumList.push(item)
        });
        page++;
        that.setData({
          order: sumList
        });
      },
      fail: function(res) {
        wx.hideLoading();
      }
    })
  },
  clickMenu: function(e) { //点击切换tab
    var current = e.currentTarget.dataset.current; //获取当前tab的index
    if (this.data.currentTab != current) {
      this.setData({
        currentTab: current,
      });
    }
  },
  changeContent: function(e) {
    var current = e.detail.current; // 获取当前内容所在index(下标)
    var tabWidth = this.data.windowWidth / 5;
    page = 1;
    sumList = [];
    this.setData({
      to_load: true,
      currentTab: current,
      tabScroll: (current - 2) * tabWidth,
      order: []
    });
    this.orderList();
  },
  orderDetails: function(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../orderDetails/orderDetails?id=' + id
    })
  },
  shopCar: function(e) {
    let id = e.currentTarget.dataset.id;
    pay({
      method: "post",
      data: {
        order_id: id
      },
      success: function(res) {
        doWxPay(res.data)
      }
    })
  },
  scrollend: function() { //触底加载
    this.orderList();
  }
})