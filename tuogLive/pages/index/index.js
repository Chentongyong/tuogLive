//index.js
import api from '../../utils/http';
Page({
  data: {
    userInfo: {},
    list: [],
    banner: [],
  },
  onLoad: function(res) {
    wx.showLoading({
      title: "加载中",
      mask: true
    });
  },
  onShow: function() {
    const that = this;
    api.mainData({
      success: function(res) {
        that.setData({
          banner: res.data.banner
        });
      }
    });
    api.live({
      success: function(res) {
        that.setData({
          list: res.data.room_info
        });
      }
    });
    api.userInfo({
      success: function(res) {
        that.setData({
          userInfo: res.data
        });
      }
    });
  },
  toTow: function(e) { //进入直播间
    if (this.data.userInfo.headimg && this.data.userInfo.nickname && this.data.userInfo.phone) {
      let id = e.currentTarget.dataset.id
      let roomId = id // 房间号
      let customParams = {
        path: 'pages/home/home'
      }
      console.log(customParams)
      wx.navigateTo({
        url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}&custom_params=${encodeURIComponent(JSON.stringify(customParams))}`
      })
    } else {
      wx.navigateTo({
        url: '../authorization/authorization'
      })
    }
  },
  subscription: function(e) { //订阅
    let that = this;
    let index = e.currentTarget.dataset.index
    if (this.data.userInfo.headimg && this.data.userInfo.nickname && this.data.userInfo.phone) {
      api.collect({
        method: "put",
        data: {
          room_id: this.data.list[index].roomid
        },
        success: function(res) {
          console.log("订阅成功")
          api.live({
            success: function(res) {
              that.setData({
                list: res.data.room_info
              });
            }
          });
          api.userInfo({
            success: function(res) {
              that.setData({
                userInfo: res.data
              });
            }
          })
        }
      })
    } else {
      wx.navigateTo({
        url: '../authorization/authorization'
      })
    }
  },
  shopCar: function() {
    if (this.data.userInfo.headimg && this.data.userInfo.nickname && this.data.userInfo.phone) {
      wx.navigateTo({
        url: '../shopCar/shopCar'
      })
    } else {
      wx.navigateTo({
        url: '../authorization/authorization'
      })
    }
  }
})