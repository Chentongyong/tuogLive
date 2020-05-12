// pages/submitOrder/submitOrder.js
import {
  shop_detail,
  mapList,
  below_order,
  pay
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
    desc: ''
  },
  onLoad: function(option) {
    let that = this
    this.setData({
      id: option.id
    });
    shop_detail({ //订单详情
      data: {
        id: that.data.id
      },
      isLoading: true,
      success: function (res) {
        console.log(res)
        that.setData({
          datas: res.data,
          price: res.data.sell_price,
          money: that.data.num * res.data.sell_price,
        });
      }
    });
    mapList({ //默认获取第一个地址
      data: {
        page: 1,
        size: 10
      },
      success: function (res) {
        if (res.data.length > 0) {
          that.setData({
            mapList: res.data[0]
          })
        }
      }
    });
  },
  addNum: function () { //加
    let num = this.data.num + 1;
    let money = (num * this.data.price).toFixed(2)
    this.setData({
      money,
      num
    })
  },
  subtract: function () { //减
    let num = this.data.num
    if (num > 1) {
      num -= 1
    }
    let money = (num * this.data.price).toFixed(2)
    this.setData({
      money,
      num
    })
  },
  address: function () { //选择地址
    wx.navigateTo({
      url: '../address/address?pay=1'
    });
  },
  desc: function (e) {
    this.setData({
      desc: e.detail.value
    })
  },
  button: function () {
    let that = this
    if (that.data.mapList.id != '') {
      below_order({
        method: "post",
        data: {
          express_type: 1,
          type: 2,
          goods_id: that.data.datas.id,
          num: that.data.num,
          address_id: that.data.mapList.id,
          pay_type: 1,
          desc: that.data.desc
        },
        success: function (res) {
          pay({
            method: "post",
            data: {
              order_id: res.data.id
            },
            success: function (res) {
              doWxPay(res.data);
            },
            fail: function (res) {
              textWindows('支付失败')
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