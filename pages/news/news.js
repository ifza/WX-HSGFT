// pages/news/news.js

// 获取小程序根实例
const app = getApp()
const { addUrl } = require('../../utils/util.js')
const LOADING_CLOSE = 0;
const LOADING_OPEN = 1;
let that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    banner: null
  },

  // 初始获取数据
  initGetData(that) {
    let params = {
      page: 1
    };
    let bannerParams = {
      id: 15
    }

    app.fetch(app.host.news, params, 'POST')
      .then((res) =>{
        // console.log('res', res);
        let data = res.data
        if (data.code == 1) {
          let resList = data.data.list;
          let forMatList = addUrl(resList, 'smallpic');
          that.setData({
            list: forMatList
          })
          that.handleLoding({}, LOADING_CLOSE);
        }
      })
      .catch((err)=> {
        console.log('newsList', err);
      });
    
    /**
     * 获取banner大图
     */
    app.fetch(app.host.newsBanner, bannerParams)
      .then((res) => {
        let resData = res.data;
        if (resData.code === 1) {
          let resList = resData.data
          let forMatList = addUrl(resList, 'picurl');
          this.setData({
            banner: forMatList[0]
          });
        }
      })
      .catch((err)=>{
        console.log(err);
      })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this.handleLoding({title: '数据加载中...', mask: true}, LOADING_OPEN);
    this.initGetData(this);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  /**
   * 加载进度条控制
   */
  handleLoding(config, type) {
    switch (type) {
      case 0:
       wx.hideLoading();
        break;
      case 1:
        config = config || {title: '数据加载中...', mask: true};
        wx.showLoading(config);   
    }
  },
  /**
   * 点击列表跳转到详情
   */
  onListTodetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/newsdetail/newsdetail?id=' + id
    });
  }
})