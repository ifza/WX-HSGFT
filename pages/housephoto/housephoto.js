// pages/housephoto/housephoto.js
const app = getApp();
const { addUrl } = require('../../utils/util.js');
const PHOTO_ID = 7;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    panelList: [],
    photoDetail: null,
    info: '',
    isMore: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this._initGetData(options.id);
  },
  /**
   * 通过传递过来的参数获取数据
   * 
   * @explan: 获取当前房产详情，调用方法格式化数据
   * (图片地址补充)
   */
  _initGetData(id){
    app.fetch(app.host.houseListPage, {id: id})
      .then((res)=>{
        let resData = res.data;
        if (resData.code === 1) {
          // console.log(resData.data);
          let photoDetail = null;
          photoDetail = this._getPhotoData(resData.data.param);

          // 数据格式化
          photoDetail[0].photo = addUrl(photoDetail[0].photo, 'pic');
          
          this.setData({
            photoDetail: photoDetail[0],
            info: resData.data.info
          });
        }
      })
      .catch((err)=>{
        console.log(err);
      });
  },
  /**
   * 筛选出楼盘相册数据
   */
  _getPhotoData(arr) {
    let result;
    if (arr.length > 0 ) {
      result = arr.filter((item)=>{
        return item.id == PHOTO_ID;
      });
    }
    // console.log(result);
    return result;
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