const { forMatStarClassList, addUrl } = require('../../utils/util.js');
const app = getApp();
const PHOTO_ID = 7;
// pages/housedetail/housedetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: null,
    // 列表-panel图文
    panelList: [],
    starClassList: [],
    isMore: false
  },

  /**
   * 生命周期函数--监听页面加载
   * 
   * _initGetData 获取次级详情页面
   * _initRecommendList 获取推荐楼盘
   */
  onLoad(options) {
    const _pagePramId = options.id;
    this._initGetData(_pagePramId);
    this._initRecommendList();

    this.setData({
    });
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
   * 通过传递过来的参数获取数据
   * 
   * @explan: 获取当前文章详情，调用方法格式化数据
   * (图片地址补充)
   */
  _initGetData(id){
    app.fetch(app.host.houseListPage, {id: id})
      .then((res)=>{
        let resData = res.data;
        if (resData.code === 1) {
          // console.log(resData.data);

          // 数据格式化
          resData.data.smallpic = `${app.host.imgBefore}${resData.data.smallpic}`;
          resData.data.people = addUrl(resData.data.people, 'pic');
          
          this.setData({
            detail: resData.data
          });
        }
      })
      .catch((err)=>{
        console.log(err);
      });
  },
  /**
   * 获取推荐楼盘列表数据
   */
  _initRecommendList(){
    app.fetch(app.host.houseList, {page: 1})
      .then((res)=>{
        const resData = res.data;
        let _list = addUrl(resData.data.list, 'smallpic');
        if (resData.code === 1) {
          this.setData({
            panelList: _list
          });
        }
      })
      .catch((err)=>{
        console.log(err);
      })
  },
  /**
   * 点击相册跳转到相册
   * 
   * @explan 判断当前点击对象的 data-id值，
   * 只有经过判断当前点击的是相册才跳转
   */
  naviToPhoto(e) {
    let photoId = e.currentTarget.dataset.pid;
    const id = e.currentTarget.dataset.id;

    if (photoId == PHOTO_ID) {
      console.log('navigator to photo');
      wx.redirectTo({
        url: `/pages/housephoto/housephoto?id=${id}`,
      })
    }
  },
  /**
   * 点击推荐列表跳转到详情页
   */
  naviToDetail(e) {
    const _paramId = e.currentTarget.dataset.id;
    wx.redirectTo({
      url: `/pages/houselist/houselist?id=${_paramId}`
    })
  },
  /**
   * 点击展开图标显示更多内容
   */
  showMore() {
    this.setData({
      isMore: !this.data.isMore
    });
  }
})