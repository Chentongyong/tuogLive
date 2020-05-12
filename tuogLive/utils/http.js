const app = getApp();
// 发起带token的请求
const wxTokenRequest = (params, url) => {
    app.globalData.checkToken.then(function () {
        if (params.isLoading) {
            let str = params.isLoading
            if (str == true) {
                str = '加载中'
            }
            wx.showLoading({
                title: str,
                mask: true
            })
        }
        let method = params.method || 'get';
        method = method.toLocaleUpperCase();
        let data = params.data || {};
        wx.request({
            url: app.globalData.host + url,
            method: method,
            data: data,
            header: {
                'Content-Type': 'application/json',
                "Authorization": app.globalData.token || ''
            },
            dataType: params.dataType || 'json',
            responseType: params.responseType || 'text',
            success: function(res) {
                wx.hideLoading();
                if (res.data.code == 200) {
                    params.success && params.success(res.data);
                }else if (res.data.code == 4000 || res.data.code == 4001) {
                    // token过期重新登录
                    reLogin(function () {
                        wxTokenRequest(params, url);
                    });
                }else if (res.data.code == 4003) {
                    wx.reLaunch({
                        url: '/pages/forbidden/forbidden'
                    });
                    return false;
                } else {
                    params.fail && params.fail(res.data);
                }
            },
            fail: function(res) {
                wx.hideLoading();
                wx.showToast({
                    title: '网络错误或接口错误',
                    icon: 'none'
                })
                params.fail && params.fail(res);
            },
            complete: function(res) {
                params.complete && params.complete(res);
            }
        })
    })
};
// 小程序重新登录
const reLogin = callback => {
    wx.showLoading({
        title: '重新登录中',
    });
    wx.login({
        success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            if (res.code) {
                //发起网络请求
                wx.request({
                    url: app.globalData.host + 'common/login',
                    method: 'POST',
                    data: {
                        code: res.code
                    },
                    header: {
                        'content-type': 'application/json', // 默认值
                    },
                    success: function (res) {
                        if (res.data.code == 200) {
                            app.globalData.token = res.data.data.token;
                            callback && typeof callback === 'function' && callback()
                        }
                    },
                    fail: function(res) {
                        wx.showToast({
                            title: '登录失败',
                            icon: 'none'
                        })
                    },
                    complete: function(res) {
                        wx.hideLoading();
                    }
                })
            } else {
                wx.hideLoading()
                console.log('登录失败！' + res.data.msg)
            }
        }
    })
};

//获取openId
const info = params => wxTokenRequest(params, 'user/info')

//微信绑定手机号码
const wxPhone = params => wxTokenRequest(params, 'user/wxPhone')

//获取验证码
const codes = params => wxTokenRequest(params, 'user/sms')

// 登录
const denglu = params => wxTokenRequest(params, 'user/login')

// 首页数据
const mainData = params => wxTokenRequest(params, 'shop/index/index') //get 轮播图

const live = params => wxTokenRequest(params, 'shop/index/liveList') //直播列表
const collect = params => wxTokenRequest(params, 'shop/collect/info') //订阅

// 好物
const shop_banner = params => wxTokenRequest(params, "shop/goods/banner") //好物轮播图 
const shop_list = params => wxTokenRequest(params, 'shop/goods/list') //好物列表 
const shop_detail = params => wxTokenRequest(params, 'shop/goods/detail') //好物详情

// 地址列表
const mapList = params => wxTokenRequest(params, 'shop/address/info') //地址列表get
const addSite = params => wxTokenRequest(params, 'shop/address/info') //添加地址post，编辑地址put
const address_detail = params => wxTokenRequest(params, "shop/address/detail") //获取单条地址信息

// 我的
const userInfo = params => wxTokenRequest(params, 'user/info')

// 订单
const orderList = params => wxTokenRequest(params, 'shop/order/info') //列表get
const order_detail = params => wxTokenRequest(params, 'shop/order/detail') //订单详情get
const express = params => wxTokenRequest(params, 'shop/order/express') //查看物流

const order_status1 = params => wxTokenRequest(params, 'shop/order/cancel') //put取消订单
const order_status = params => wxTokenRequest(params, 'shop/order/confirm') //put 确认收货
const remove_order = params => wxTokenRequest(params, 'shop/order/order') //del 删除订单
const remind_order = params => wxTokenRequest(params, 'shop/order/remind') //订单提醒发货

const affirm_order = params => wxTokenRequest(params, 'shop/order/confim') //确认订单post
const below_order = params => wxTokenRequest(params, 'shop/order/info') //下单post
const pay = params => wxTokenRequest(params, 'shop/order/pay') //支付

const shop_car = params => wxTokenRequest(params, 'shop/cart/info') //购物车列表
const remove_car = params => wxTokenRequest(params, 'shop/cart/info') //删除
const add_car = params => wxTokenRequest(params, 'shop/cart/info') //编辑购物车



module.exports = {
  remind_order,
    express,
    add_car,
    remove_car,
    shop_car,
    remove_order,
    order_status1,
    order_status,
    pay,
    below_order,
    affirm_order,
    order_detail,
    address_detail,
    orderList,
    userInfo,
    addSite,
    mapList,
    shop_detail,
    collect,
    live,
    mainData,
    shop_banner,
    shop_list,
    info,
    wxPhone,
    denglu,
    codes
}