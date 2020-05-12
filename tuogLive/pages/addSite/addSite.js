// pages/addSite/addSite.js
import {
  textWindows
} from '../../utils/public.js'
import {
  addSite,
  address_detail
} from '../../utils/http.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: [],
    name: '',
    phone: '',
    mapDetail: '',
    id: '',
    win:true
  },
  onLoad: function(options) {
    let that = this
    if (options.id) { //编辑地址
      wx.showLoading({
        title: "加载中",
        mask: true
      });
      this.setData({
        id: options.id
      })
      address_detail({
        data: {
          address_id: options.id
        },
        success: function (res) {
          let sum = []
          sum.push(res.data.province)
          sum.push(res.data.city)
          sum.push(res.data.area)
          that.setData({
            name: res.data.name,
            phone: res.data.phone,
            mapDetail: res.data.address,
            region: sum
          })
        }
      })
    } else {
      console.log(options)
    }
  },
  name: function (e) { //收货人
    this.setData({
      name: e.detail.value
    })
  },
  phone: function (e) { //联系方式
    this.setData({
      phone: e.detail.value
    })
  },
  bindRegionChange: function (e) { //选择区域
    this.setData({
      region: e.detail.value
    })
  },
  mapDetail: function (e) { //详细地址
    this.setData({
      mapDetail: e.detail.value
    })
  },
  conserve: function (e) { //保存
    let that = this;
    if (!that.data.win){
      textWindows('操作频繁')
      return false;
    }
    that.setData({
      win:false
    })
    let name = this.data.name;
    let phone = this.data.phone;
    let mapDetail = this.data.mapDetail;
    let region = this.data.region;
    if (name == '') {
      textWindows('收货人不能为空')
      return false
    }
    if (phone == '') {
      textWindows('联系方式不能为空')
      return false
    }
    if (mapDetail == '') {
      textWindows('详细地址不能为空')
      return false
    }
    if (region == '') {
      textWindows('收货地址不能为空')
      return false
    }
    if (!(/^1[3456789]\d{9}$/.test(phone))) {
      textWindows("手机号码有误，请重填");
      return false;
    } else {
      if (that.data.id != '') { //判断是保存的是编辑还是修改
        addSite({
          method: "put",
          data: {
            name: name,
            phone: phone,
            province: region[0],
            city: region[1],
            area: region[2],
            address: mapDetail,
            is_default: 1,
            id: that.data.id
          },
          success: function (res) {
            textWindows('修改地址成功');
            setTimeout(function () {
              that.setData({
                win: true
              })
              wx.navigateBack({
                delta: 1
              });
            }, 1200)
          }
        })
      } else {
        addSite({
          method: "post",
          data: {
            name: name,
            phone: phone,
            province: region[0],
            city: region[1],
            area: region[2],
            address: mapDetail,
            is_default: 1
          },
          success: function (res) {
            textWindows('添加地址成功')
            setTimeout(function () {
              that.setData({
                win: true
              })
              wx.navigateBack({
                delta: 1
              });
            }, 1200)
          }
        })
      }
    }
  }
})