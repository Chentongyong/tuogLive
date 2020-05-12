// pages/logistics/logistics.js
import { express } from '../../utils/http.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    state:0,
    datas:{}
  },
  onLoad: function(options){
    let that = this
    express({
      data:{
        express_id:options.id
      },
      success: function (res) {
        that.setData({
          datas:res.data
        })
      }
    })
  }
})