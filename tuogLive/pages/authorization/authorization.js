import {
  wxPhone,
  userInfo
} from '../../utils/http.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hides: true
  },
  bindGetUserInfo: function (e) { //授权
    let that = this;
    if (e.detail.iv && e.detail.encryptedData) {
      userInfo({
        method: 'POST',
        data: {
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        },
        success: function (res) {
          that.setData({
            hides: false
          });
        }
      });
    }
  },
  goSuperior: function () {
    wx.navigateBack({
      delta: 1,
    })
  },
  getPhoneNumber: function (e) {
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      wxPhone({
        method: 'POST',
        data: {
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        },
        success: function (res) {
          wx.navigateBack({
            delta: 1,
          })
        }
      })
    }
  }
})