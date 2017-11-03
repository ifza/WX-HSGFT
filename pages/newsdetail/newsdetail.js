const app = getApp();
const LOADING_CLOSE = 0;
const LOADING_OPEN = 1;
let that;
const WxParse = require('../../lib/wxParse/wxParse.js');

Page({
  detail: null,
  detailInfo: '',
  /** 
   * 初始获取数据
   */
  initGetData(id) {
    app.remote.newsDetail(app.host.newsDetail, {id: id})
      .then((res)=>{
        console.log('res', res);
        if (res.data.code === 1) {
          
          WxParse.wxParse('detailInfo', 'html', res.data.data.content, this, 45);

          this.setData({
            detail: res.data.data,
          });
          this.handleLoding({}, LOADING_CLOSE);
        }
      })
      .catch((err)=>{
        console.log('err', err);
      })
  },
  /** 
   *  wxParse
   */
  wxParse() {

  },
  /** 
   * 页面初加载
   */
  onLoad(ops) {
    const queryId = ops.id;
    this.initGetData(queryId);
    this.handleLoding({title: '数据加载中...', mask: true}, LOADING_OPEN);
  },
  // 加载进度条控制
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
});