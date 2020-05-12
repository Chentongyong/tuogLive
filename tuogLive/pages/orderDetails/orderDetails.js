// pages/orderDetails/orderDetails.js
import {
  order_detail,
  order_status1,
  order_status,
  remove_order,
  pay,
  remind_order
} from '../../utils/http.js'
import {
  doWxPay,
  textWindows
} from '../../utils/public.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeList: ['', '待付款', '待发货', '待收货', '已完成', '顺风快递'],
    typeIndex: 2,
    id: '',
    datas: {}
  },
  onLoad: function(options) {
    let that = this
    this.setData({
      id: options.id
    });
    this.getDetails();
  },
  getDetails: function() {
    const that = this;
    order_detail({
      data: {
        order_id: this.data.id
      },
      success: function(res) {
        that.setData({
          datas: res.data
        });
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  address: function() { //选择地址
    wx.navigateTo({
      url: '../address/address'
    })
  },
  logistics: function(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../logistics/logistics?id=' + id
    })
  },
  cancel: function() { //取消订单
    let that = this
    order_status1({
      method: "put",
      data: {
        order_id: that.data.datas.id
      },
      success: function(res) {
        textWindows('成功取消订单');
        setTimeout(function() {
          wx.navigateBack({
            delta: 1,
          })
        }, 1200)
      },
      fail: res => {
        textWindows('取消订单失败')
      }
    })
  },
  remind: function() { //提醒发货
    let that = this;
    remind_order({
      method: "put",
      data: {
        order_id: that.data.datas.id
      },
      success: function(res) {
        textWindows("已提醒")
      },
      fail: res => {
        textWindows('提醒失败')
      }
    })
  },
  collect_order: function() { //确认收货
    let that = this
    order_status({
      method: "put",
      data: {
        order_id: that.data.datas.id
      },
      success: function(res) {
        textWindows('收货成功');
        setTimeout(function() {
          wx.navigateBack({
            delta: 1,
          })
        }, 1200)
      },
      fail: res => {
        textWindows('确认收货失败')
      }
    })
  },
  pay: function() { //付款
    let that = this
    pay({
      method: "post",
      data: {
        order_id: that.data.datas.id
      },
      success: function(res) {
        doWxPay(res.data)
      }
    })
  },
  deletes: function() { //删除
    let that = this
    remove_order({
      method: "delete",
      data: {
        order_id: that.data.datas.id
      },
      success: function(res) {
        textWindows('成功删除订单')
        setTimeout(function() {
          wx.navigateBack({
            delta: 1,
          })
        }, 1200)
      },
      fail: res => {
        textWindows('删除订单失败')
      }
    })
  }
})