import {
  userInfo
} from '../../utils/http.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
  },
  onLoad:function(){
    wx.showLoading({
      title: "加载中",
      mask: true
    });
  },
  onShow: function () {
    let that = this
    userInfo({
      success: function (res) {
        that.setData({
          userInfo: res.data
        });
      }
    });
  },
  order: function (e) {
    if (this.data.userInfo.headimg && this.data.userInfo.nickname && this.data.userInfo.phone) {
      let type = e.currentTarget.dataset.type
      wx.navigateTo({
        url: '../order/order?type=' + type
      });
    } else {
      wx.navigateTo({
        url: '../authorization/authorization'
      });
    }
  },
  address: function () {
    if (this.data.userInfo.headimg && this.data.userInfo.nickname && this.data.userInfo.phone) {
      wx.navigateTo({
        url: '../address/address'
      });
    } else {
      wx.navigateTo({
        url: '../authorization/authorization'
      });
    }
  }
})