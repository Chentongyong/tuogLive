// pages/shopCar/shopCar.js
import {
  textWindows
} from '../../utils/public.js'
import {
  shop_car,
  remove_car,
  add_car
} from '../../utils/http.js'
let page = 1,
  size = 10,
  list = [],
  qx = []
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    status: false,
    select: 1,
    money: 0.00
  },
  onLoad: function() {
    wx.showLoading({
      title: "加载中",
      mask: true
    });
  },
  onShow: function() {
    let that = this
    page = 1
    list = []
    this.datas()
  },
  datas: function() {
    let that = this
    shop_car({
      data: {
        page: page,
        size: size
      },
      success: function(res) {
        if (res.data.length > 0) {
          res.data.forEach(item => {
            list.push(item)
          });
        }
        that.setData({
          list: list
        });
      }
    })
  },
  select: function(e) { //单选
    let index = e.currentTarget.dataset.index
    let that = this;
    let list = this.data.list
    if (list[index].status == true) {
      list[index].status = false
      qx.splice(0, 1);
      this.setData({
        status: false
      })
    } else {
      list[index].status = true
      qx.push(1)
      if (qx.length == list.length) {
        this.setData({
          status: true
        })
      }
    }
    this.sum(list);
    this.setData({
      list
    })
  },
  selectAll: function() { //全选
    let list = this.data.list
    if (this.data.status == true) {
      list.forEach(item => {
        item.status = false
      });
      this.setData({
        status: false
      });
    } else {
      list.forEach(item => {
        item.status = true
      });
      this.setData({
        status: true
      });
    }
    this.sum(list);
    this.setData({
      list: list
    });
  },
  addNum: function(e) { //加
    let index = e.currentTarget.dataset.index
    let that = this;
    let list = that.data.list
    list[index].num = list[index].num + 1
    this.sum(list)
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
  },
  subtract: function(e) { //减
    let index = e.currentTarget.dataset.index
    let that = this;
    let list = that.data.list
    if (list[index].num > 1) {
      list[index].num = list[index].num - 1
      this.sum(list)
      this.setData({
        list
      })
      add_car({
        method: "put",
        data: {
          cart_id: that.data.list[index].id,
          num: that.data.list[index].num
        },
        success: function(res) {
          console.log(res)
        }
      })
    }
  },
  sum: function(list) {
    let that = this;
    // let list = this.data.list
    let money = this.data.money;
    let sum = 0,
      sums = 0;
    list.forEach(item => {
      if (item.status == true) {
        sum = sum + item.price * item.num
        sums = sums + item.num
      }
      this.setData({
        money: sum.toFixed(2)
      })
    })
  },
  touchS: function(e) {
    // 获得起始坐标
    this.startX = e.touches[0].clientX;
    this.startY = e.touches[0].clientY;
  },
  touchM: function(e) {
    // 获得当前坐标
    let index = e.currentTarget.dataset.index
    this.currentX = e.touches[0].clientX;
    this.currentY = e.touches[0].clientY;
    const x = this.startX - this.currentX; //横向移动距离
    let list = this.data.list
    const y = Math.abs(this.startY - this.currentY); //纵向移动距离，若向左移动有点倾斜也可以接受
    if (x < -35 && y < 110) {
      list[index].delect = false
      //向左滑是显示删除
      this.setData({
        list
      })
    } else if (x > 35 && y < 110) {
      //向右滑
      list[index].delect = true
      this.setData({
        list
      })
    }
  },
  remove: function(e) { //删除
    let index = e.currentTarget.dataset.index
    let that = this
    remove_car({
      method: "delete",
      data: {
        cart_id: that.data.list[index].id
      },
      success: function(res) {
        page = 1
        list = []
        that.datas()
      }
    })
  },
  car_details: function() { //确认订单car_ids type=1
    let that = this
    let listId = []
    let list = that.data.list
    list.forEach(item => {
      if (item.status == true) {
        listId.push(item.id)
      }
    })
    if (listId.length > 0) {
      wx.navigateTo({
        url: "../carDetails/carDetails?listId=" + listId
      })
    } else {
      textWindows('请先选择商品')
    }
  },
  goodDetails: function(e) { //详情

  }
})