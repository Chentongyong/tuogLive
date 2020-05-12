// pages/submitOrder/submitOrder.js
import {
  shop_detail,
  mapList,
  below_order,
  pay,
  affirm_order,
  add_car
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
    num: 1,
    money: 0,
    price: 123.00,
    hides: true,
    mapList: {},
    id: '',
    datas: {},
    list: [],
    listId: [],
    desc: ''
  },
  onLoad: function(option) {
    let that = this
    let listId = option.listId.split(",");
    this.setData({
      listId
    })
    affirm_order({
      method: "post",
      data: {
        type: 1,
        car_ids: listId
      },
      success: function(res) {
        console.log(res)
        that.sum(res.data)
        that.setData({
          list: res.data
        })
      }
    })
  },
  onShow: function() {
    let that = this
    mapList({ //默认获取第一个地址
      data: {
        page: 1,
        size: 10
      },
      success: function(res) {
        // console.log(res.data)
        if (res.data != '') {
          that.setData({
            mapList: res.data[0]
          })
        }
      }
    })
  },
  addNum: function(e) { //加
    let that = this
    let index = e.currentTarget.dataset.index
    let list = this.data.list
    list[index].num = list[index].num + 1

    this.setData({
      list
    })
    this.sum(list)
    // console.log(this.data.list)
    add_car({
      method: "post",
      data: {
        cart_id: that.data.list[index].id,
        num: that.data.list[index].num
      },
      success: function(res) {
        console.log(res)
      }
    })
  },
  subtract: function(e) { //减
    let that = this;
    let index = e.currentTarget.dataset.index
    let list = that.data.list
    if (list[index].num > 1) {
      list[index].num = list[index].num - 1
    } else {
      textWindows('已经是最小值了')
    }
    this.setData({
      list
    })
    add_car({
      method: "post",
      data: {
        cart_id: that.data.list[index].id,
        num: that.data.list[index].num
      },
      success: function(res) {
        console.log(res)
      }
    })
    this.sum(list)
  },
  sum: function(list) {
    let that = this;
    // let list = this.data.list
    let money = that.data.money;
    let sum = 0,
      sums = 0;
    list.forEach((item, index, arr) => {
      sum = sum + item.price * item.num
      sums = sums + item.num
      that.setData({
        money: sum.toFixed(2)
      })
    })
  },
  address: function() { //选择地址
    wx.navigateTo({
      url: '../address/address'
    })
  },
  desc: function(e) {//备注
    this.setData({
      desc: e.detail.value
    })
  },
  sum: function(list) {
    let that = this;
    let money = this.data.money;
    let sum = 0,
      sums = 0;
    list.forEach((item, index, arr) => {
      sum = sum + item.price * item.num
      sums = sums + item.num
      this.setData({
        money: sum.toFixed(2)
      })
    })
  },
  button: function() {
    let that = this
    if (that.data.mapList.id != '') {
      below_order({
        method: "post",
        data: {
          express_type: 1,
          type: 1,
          car_ids: that.data.listId,
          num: that.data.num,
          address_id: that.data.mapList.id,
          pay_type: 1,
          desc: that.data.desc
        },
        success: function(res) {
          console.log(res)
          pay({
            method: "post",
            data: {
              order_id: res.data.id
            },
            success: function(res) {
              doWxPay(res.data)
            }
          })
        },
        fail: function (res) {
          textWindows(res.msg)
        }
      })
    } else {
      textWindows('收货地址不能为空')
    }
  }
})