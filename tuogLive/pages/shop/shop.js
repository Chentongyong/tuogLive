//logs.js
import {
  shop_banner,
  shop_list,
  affirm_order,
  userInfo
} from '../../utils/http.js';
let arrer = [],
  page = 1,
  size = 10
Page({
  data: {
    userInfo: {},
    banner: '',
    shopList: [],
    to_load: true
  },
  onLoad: function (res) {
    wx.showLoading({
      title: "加载中",
      mask: true
    });
  },
  onShow: function() {
    let that = this;
    shop_banner({
      success: function(res) {
        that.setData({
          banner: res.data
        })
      }
    })
    arrer = [];
    page = 1
    that.datas();
    userInfo({
      success: function(res) {
        that.setData({
          userInfo: res.data
        });
      }
    });
  },
  datas: function() { //获取列表数据
    let that = this;
    if (!this.data.to_load) {
      return false;
    }
    let loading = false;
    if (page == 1) {
      loading = true;
    }
    shop_list({
      data: {
        page: page,
        size: size
      },
      isLoading: loading,
      method: "post",
      success: function(res) {
        res.data.forEach(item => {
          arrer.push(item)
        });
        if (res.data.length == 10) {
          page++;
          that.setData({
            to_load: true
          });
        } else {
          that.setData({
            to_load: false
          });
        }
        that.setData({
          shopList: arrer
        })
      },
      fail: function(res) {
        that.setData({
          to_load: false
        });
      }
    })
  },
  goodDetails: function(e) { //跳转商品详情
    if (this.data.userInfo.headimg && this.data.userInfo.nickname && this.data.userInfo.phone) {
      let id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '../goodDetails/goodDetails?id=' + id
      })
    } else {
      wx.navigateTo({
        url: '../authorization/authorization'
      })
    }
  },
  purchase: function(e) { //跳转确认订单
    if (this.data.userInfo.headimg && this.data.userInfo.nickname && this.data.userInfo.phone) {
      let id = e.currentTarget.dataset.id
      affirm_order({
        method: "post",
        data: {
          type: 2,
          goods_id: id
        },
        success: function(res) {
          console.log(res)
          wx.navigateTo({
            url: '../submitOrder/submitOrder?id=' + id
          })
        }
      })
    } else {
      wx.navigateTo({
        url: '../authorization/authorization'
      })
    }
  },
  onReachBottom: function() {
    this.datas();
  }
})