//app.js
App({
    onLaunch: function () {
        let that = this;
        // 登录获取token
        let checkToken = new Promise(function (resolve, reject) {
            wx.login({
                success: function (res) {
                    if (res.code) {
                        wx.request({
                            url: that.globalData.host + 'common/login',
                            method: 'POST',
                            data: {
                                code: res.code
                            },
                            success: function (res) {
                                if (res.data.code == 200) {
                                    that.globalData.token = res.data.data.token;
                                    resolve();
                                }
                                that.globalData.token = res.data.data.token;
                            },
                            fail: function (err) {
                                wx.showToast({
                                    title: '网络无响应,请稍后再试',
                                    icon: 'none'
                                });
                            }
                        });
                    } else {
                        reject();
                    }
                }
            });
        });
        this.globalData.checkToken = checkToken;
    },
    globalData: {
        host: 'https://cunsi.togy.com.cn/api/',
        checkToken: '',
        token: ''
    }
})