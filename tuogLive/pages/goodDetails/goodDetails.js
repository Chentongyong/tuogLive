// pages/goodDetails/goodDetails.js
import {
  shop_detail
} from '../../utils/http.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listImg: [],
    index: 1,
    html: ''
  },
  onLoad: function(option) {
    let that = this
    wx.showLoading({
      title: "加载中",
      mask: true
    });
    shop_detail({
      data: {
        id: option.id
      },
      success: function (res) {
        that.setData({
          html: res.data.content,
          datas: res.data,
          listImg: res.data.image
        })
      }
    })
  },
  onIndex: function (e) {
    this.setData({
      index: e.detail.current + 1
    })
  },
  robBuy: function () {
    wx.navigateTo({
      url: '../submitOrder/submitOrder?id=' + this.data.datas.id
    })
  },
  onShareAppMessage: function(res) {
    let id = this.data.datas.id;
    let title = this.data.datas.title;
    return {
      title: title,
      path: `pages/goodDetails/goodDetails?id=` + id // 分享后打开的页面
    }
  }
})