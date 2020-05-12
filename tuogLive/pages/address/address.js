// pages/addressAdd/addressAdd.js
import {
    textWindows
} from '../../utils/public.js'
import {
    mapList
} from '../../utils/http.js'
let list = [],
    page = 1,
    size = 10
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pay: '',
        selected: true,
        noAddress: true,
        addressLists: [],
        items: 1,
        to_load: true
    },
    onLoad: function (options) {
      wx.showLoading({
        title: "加载中",
        mask: true
      });
        this.setData({
            pay: options.pay || false
        })
        list = []
    },
    onShow: function () {
        list = []
        page = 1
        this.datas();
    },
    clickAddress: function (e) {
      console.log(e)
        let index = e.currentTarget.dataset.index;
        if (this.data.pay) {
            let address = this.data.addressLists[index];
            //获取页面栈
            var pages = getCurrentPages();
            if (pages.length > 1) {
                //上一个页面实例对象
                var prePage = pages[pages.length - 2];
                prePage.setData({
                    mapList: address
                });
                wx.navigateBack({
                    delta: 1
                });
            }
        }
    },
    datas: function () {
        let that = this
        mapList({
            data: {
                page: page,
                size: size
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data != '') {
                    that.setData({
                        noAddress: true
                    })
                    res.data.forEach((item, index, arr) => {
                        list.push(item)
                    })
                    if (res.data.length == 10) {
                        page++
                        that.setData({
                            to_load: true
                        })
                    } else {
                        that.setData({
                            to_load: false
                        })
                    }
                    that.setData({
                        addressLists: list
                    })
                } else {
                    that.setData({
                        noAddress: false
                    })
                }
            },
            fail: function (res) {
                wx.hideLoading();
            }
        })
    },
    touchS: function (e) {
        // 获得起始坐标
        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;
    },
    touchM: function (e) {
        // 获得当前坐标
        let index = e.currentTarget.dataset.index
        this.currentX = e.touches[0].clientX;
        this.currentY = e.touches[0].clientY;
        const x = this.startX - this.currentX; //横向移动距离
        let addressLists = this.data.addressLists
        const y = Math.abs(this.startY - this.currentY); //纵向移动距离，若向左移动有点倾斜也可以接受
        if (x < -35 && y < 110) {
            addressLists[index].status = false
            //向左滑是显示删除
            this.setData({
                addressLists
            })
        } else if (x > 35 && y < 110) {
            //向右滑
            addressLists[index].status = true
            this.setData({
                addressLists
            })
        }
    },
    addSite: function () {
        wx.navigateTo({
            url: '../addSite/addSite'
        })
    },
    amend: function (e) { //修改地址
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../addSite/addSite?id=' + id
        })
    },
    deleteFun: function (e) { //删除地址
        let that = this;
        let id = e.currentTarget.dataset.id;
        mapList({
            method: "delete",
            data: {
                ids: id
            },
            success: function (res) {
                list = []
                textWindows('删除成功')
                that.datas()
            }
        })
    },
    onReachBottom: function (e) {
        let that = this
        if (that.data.to_load == true) {
            wx.showLoading({
                title: '加载中',
            })
            that.datas();
        } else {
            textWindows('没有更多信息了')
        }
    }
})