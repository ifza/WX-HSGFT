// pages/house/house.js
const app = getApp();
const { addUrl, forMatStarClassList } = require('../../utils/util.js');
const ONE_PAGE_FULLNUMER = 3;
Page({

  /**
   * 页面的初始数据
   * 
   * @attr {} tabs 可以进行筛选的选项
   * @attr {} areaActiveIndex 点击了picker并确定后当前选中的地区Id 
   * [obj1，obj2, obj3, obj4] 四个区域对应的id
   * @attr {Number} starActiveIndex 星级推荐当前筛选的选项的索引 星星升序 ==1 降序==2
   * @attr {} houseArea 房产区域分类
   * @attr {Boolean} isStarTap 是否点击了星级推荐标记，点击就为true
   * @attr {Boolean} isAreaOrder 是否并选择了地区筛选标记，点击就为true
   * @attr {Boolean} isHasMore 标记是否显示'查看更多' true显示
   * @attr {Number} page 请求的参数页码
   */
  data: {
    // tab相关
    tabs: ["区域排序", "星级推荐"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    // swiper相关
    imgUrls: [],
    // 列表-panel图文
    houseArea: [],
    areaArr: [],
    houseAreaIndex: 0,
    placeholderText: '区域推荐',
    panelList: [],
    isAreaOrder: false,
    isStarTap: false,
    isStarDesc: false,
    isHasMore: true,
    page: 1,
    areaActiveIndex: 9999,
    starActiveIndex: 9999
  },
  /**
   * 房产轮播大图获取
   */
  initGetBanner() {
    app.fetch(app.host.houstBanner, {id: 13})
      .then((res)=>{
        // console.log('res', res);
        let data = res.data;
        if (data.code === 1) {
          let resArr = data.data
          let forMatArr = addUrl(resArr);
          this.setData({
            imgUrls: forMatArr
          });
        }
      })
      .catch((err)=>{
        console.log(err);
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initGetBanner();
    this.initGetArea();
    this._getDefaultList();
    this.setData({
      starClassList: forMatStarClassList(3)
    });
  },
  /**
   * 区域排序(倒序)
   * 
   * @explain 点击区域排序下图标后触发该方法
   */
  // bottom0(e) {
  //   console.log('area bottom');
  //   this.setData({
  //     areaActiveIndex: e.currentTarget.dataset.id
  //   });
  // },
  /**
   * 地区选择Picker处理
   * 
   * @vars {Number} 保存当前picker选中的对应地区houseArea的id
   * @oper {操作} 获取筛选条件的数据并赋值更新data
   * @explain: 默认picker需要没值就不会显示内容并且需要显示"区域推荐"，
   * 于是显示的内容区域内
   * 添加了一个变量placeholderText，对应字符串'区域推荐'，
   * 当选中picker中的某项，areaArray中的每项将placeholderText
   * 赋值为一个空字符串。以此达到默认显示区域推荐，选中一个区域，
   * 显示对应区域的效果
   */
  areaFilter(e) {
    // console.log('picker选择', e.detail.value);
    const index = e.detail.value;
    const _isAddStarParam = this._isAddStarParam();
    let _paramId = this.data.houseArea[index].id;
    this.setData({
      placeholderText: this.data.areaArr[index],
      areaActiveIndex: _paramId,
      isAreaOrder: true
    });

    // request 请求获取筛选结果
    if (!_isAddStarParam) { // 不添加星星排序参数
      app.fetch(app.host.houseList, {id: _paramId, page: 1})
        .then((res)=>{
          let _resData = res.data;
          let _forMatList = addUrl(_resData.data.list, 'smallpic');
          if (_resData.code === 1) {
            this.setData({
              panelList: _forMatList,
              page: 1,
              isHasMore: true
            });
          }
        })
        .catch((err)=>{
          console.log(err);
        });
    } else { // 添加星级推荐排序
      const _starActiveIndex = this.data.starActiveIndex;
      app.fetch(app.host.houseList, {id: _paramId, page: 1, star: _starActiveIndex})
        .then((res)=>{
          let _resData = res.data;
          let _forMatList = addUrl(_resData.data.list, 'smallpic');
          if (_resData.code === 1) {
            this.setData({
              panelList: _forMatList,
              page: 1,
              isHasMore: true
            });
          }
        })
        .catch((err)=>{
          console.log(err);
        });
    }
  },
  /**
   * 星级推荐(正序)点击效果处理
   * 
   * @explain 点击星级推荐上图标后触发该方法
   * 标记点击过按星星排序 data.isStarTap为true
   */
  top1(e) {
    // console.log('star top');
    const starIndex = e;
    const _isAddAreaParam = this._isAddAreaParam();
    this.setData({
      starActiveIndex: starIndex,
      isStarTap: true
    });

    // request get list
    if(!_isAddAreaParam){ // 没有选择过地区排序
      app.fetch(app.host.houseList, {star: starIndex, page: 1})
        .then((res)=>{
          let _resData = res.data;
          let _forMatList = addUrl(_resData.data.list, 'smallpic');
          if (_resData.code === 1) {
            this.setData({
              panelList: _forMatList
            });
          }
        })
        .catch((err)=>{
          console.log(err);
        });
    } else {
      const _areaActiveIndex = this.data.areaActiveIndex;
      app.fetch(app.host.houseList, {star: starIndex, page: 1, id: _areaActiveIndex})
        .then((res)=>{
          let _resData = res.data;
          let _forMatList = addUrl(_resData.data.list, 'smallpic');
          if (_resData.code === 1) {
            this.setData({
              panelList: _forMatList
            });
          }
        })
        .catch((err)=>{
          console.log(err);
        });
    }
  },
  /**
   * 星级推荐(降序)点击效果处理
   * 
   * @explain 点击星级推荐下图标后触发该方法
   * 标记点击过按星星排序 data.isStarTap为true
   */
  bottom1(e) {
    // console.log('star bottom');
    const starIndex = e;
    const _isAddAreaParam = this._isAddAreaParam();
    this.setData({
      starActiveIndex: starIndex,
      isStarTap: true
    });
    
    // request get list
    if(!_isAddAreaParam){ // 没有选择过地区排序
      app.fetch(app.host.houseList, {star: starIndex, page: 1})
        .then((res)=>{
          let _resData = res.data;
          let _forMatList = addUrl(_resData.data.list, 'smallpic');
          if (_resData.code === 1) {
            this.setData({
              panelList: _forMatList
            });
          }
        })
        .catch((err)=>{
          console.log(err);
        });
    } else {
      const _areaActiveIndex = this.data.areaActiveIndex;
      app.fetch(app.host.houseList, {star: starIndex, page: 1, id: _areaActiveIndex})
        .then((res)=>{
          let _resData = res.data;
          let _forMatList = addUrl(_resData.data.list, 'smallpic');
          if (_resData.code === 1) {
            this.setData({
              panelList: _forMatList
            });
          }
        })
        .catch((err)=>{
          console.log(err);
        });
    }
  },
  /**
   * 点击星星排序取反
   * dataIsStarDesc 为真
   */
  starOrder() {
    let dataIsStarDesc = this.data.isStarDesc;
    this.setData({
      isStarDesc: !dataIsStarDesc,
      isStarTap: true,
      page: 1,
      isHasMore: true
    });
    dataIsStarDesc = this.data.isStarDesc;
    if (dataIsStarDesc) {
      this.top1(2);
    } else {
      this.top1(1);
    }
  },
  /**
   * request 获取房产区域分类
   * 
   * @explain 获取房产区域分类数据并赋值给data.houseArea
   * data.areaArr 赋值为 data.houseArea.menuname
   * (通过调用_setAreaArr)实现
   */
  initGetArea() {
    app.fetch(app.host.houseArea)
      .then((res) => {
        const resData = res.data;
        const _areaArr = this._setAreaArr(resData.data);
        if (resData.code === 1) {
          this.setData({
            houseArea: resData.data,
            areaArr: _areaArr
          });
        }
      })
      .catch((err)=>{
        console.log(err);
      });
  },
  /**
   * data.areaArr 赋值功能函数
   * 
   * @return {Array} result 返回一个数组 有arr[x].menuname构成
   */
  _setAreaArr(arr) {
    let result = [];
    if (arr.length > 0) {
      arr.forEach((item)=>{
        result.push(item.menuname)
      });
    }
    return result;
  },
  /** 
   * 获取加载进来即默认的list内容
   * 
   * @explain 改变 data.panelList的值
   */
  _getDefaultList() {
    app.fetch(app.host.houseList, {page: 1})
      .then((res) => {
        let _resData = res.data;
        let _forMatList = addUrl(_resData.data.list, 'smallpic');
        if (_resData.code === 1) {
          this.setData({
            panelList: _forMatList
          });
        }
      })
      .catch((err)=>{
        console.log(err);
      });
  },
  /**
   * 判断是否添加星级推荐排序参数
   * 
   * @return {Bollean} 需要添加为true,否则为false
   */
  _isAddStarParam() {
    let _isClickStarOrder;
    _isClickStarOrder = this.data.isStarTap;
    return _isClickStarOrder ? true : false;
  },
  /**
   * 判断是否添加地区筛选条件
   * 
   * @return {Boolean} 需要添加为true,否则为false
   */
  _isAddAreaParam() {
    let _isClickAreaOrder;
    _isClickAreaOrder = this.data.isAreaOrder;
    return _isClickAreaOrder ? true : false;
  },
  /**
   * 点击列表跳转到详情页
   */
  naviToDetail(e) {
    const _paramId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/houselist/houselist?id=${_paramId}`
    })
  },
  /**
   * 点击加载更多
   * @explain 1 没有点击星级推荐 param: {page: page}
   * @explain 2 点击了星级推荐，且现在为正序排 param: {page: page, star: 1}
   * @explain 3 点击了星级推荐，且现在为降序排 param: {page: page, star: 2}
   * @explain 4 点击“加载更多”，page++，
   * @explain 4.1 如果此时返回的数据为空，隐藏“加载更多”
   * @explain 4.2 如果此时返回的数据不为空，但是返回数据少于ONE_PAGE_FULLNUMER个，隐藏“加载更多”
   * @explain 4.3 如果此时返回的数据不为空，但是返回数据为ONE_PAGE_FULLNUMER个,不对“加载更多”进行操作
   * (让其继续显示)
   */
  loadMore() {
    let prevPanelList = this.data.panelList;
    if (!this.data.isHasMore) return;
    let page = this.data.page;
    let param = {};
    const _isStarTap = this.data.isStarTap;
    const _isStarDesc = this.data.isStarDesc;
    page++;
    if( _isStarTap && _isStarDesc) {
      param = {
        page: page,
        star: 2
      }
    } else if( _isStarTap && !_isStarDesc ) {
      param = {
        page: page,
        star: 1
      }
    } else if( !_isStarTap ) {
      param = {
        page: page
      }
    }
    app.fetch(app.host.houseList, param)
      .then((res) => {
        let _resData = res.data;
        let _forMatList = addUrl(_resData.data.list, 'smallpic');
        if (_resData.code === 1) {
          let resDataLen = _resData.data.list.length;
          if (resDataLen > 0) { // 存在数据
            const _concatList = this.concatList(_forMatList);
            if(resDataLen < ONE_PAGE_FULLNUMER) {
              this.setData({
                isHasMore: false,
                panelList: _concatList
              });
            } else {
              this.setData({
                panelList: _concatList
              });
            }
            
          } else { // 数据显示完
            this.setData({
              isHasMore: false
            });
          }
        }
      })
      .catch((err)=>{
        console.log(err);
      });
  },
  /**
   * 拼接当前数据后的数据
   * 
   * @return {Array} _panelList 返回数据拼接在一起后的数组
   * @explain 1不用前端排序，后端已经根据参数排好序了，每页内容是动态变化的
   */
  concatList(nowList) {
    let _panelList = this.data.panelList;
    _panelList = _panelList.concat(nowList);
    return _panelList;
  }
})