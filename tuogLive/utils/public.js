const textWindows = function (text) { //文本弹窗
  wx.showToast({
    title: text,
    icon: "none"
  })
}
const showLoading = function (e) { //正在加载中弹窗
  wx.showLoading({
    title: e,
  })
}

const phones = function (e) { //拨打电话
  wx.makePhoneCall({
    phoneNumber: e.currentTarget.dataset.replyPhone,
    success: function () {
      console.log("成功拨打电话")
    },
  })
}
//查看授权状况
const authorization = function (e) {
  wx.getSetting({
    success: function (res) {
      if (res.authSetting['scope.userInfo']) {
        wx.switchTab({
          url: '../index/index'
        })
      } else {
        wx.navigateTo({
          url: '../authorization/authorization'
        })
      }
    }
  })

}

function doWxPay(param) {
  //小程序发起微信支付
  wx.requestPayment({
    timeStamp: param.timeStamp,
    nonceStr: param.nonceStr,
    package: param.package,
    signType: 'MD5',
    paySign: param.paySign,
    success: function (event) {
      wx.showToast({
        title: '支付成功',
        icon: 'success',
        duration: 2000
      });
      setTimeout(function () {
        wx.redirectTo({
          url: '../order/order',
        })
      }, 2000)
    },
    fail: function (error) {
      // fail   
      wx.showToast({
        title: '支付失败',
        icon: 'success',
        duration: 2000
      });
      console.log(error)
    },
    complete: function () {
      // complete   
      console.log("pay complete")
    }
  });
}


module.exports = {
  doWxPay,
  textWindows,
  phones,
  authorization,
  showLoading
}