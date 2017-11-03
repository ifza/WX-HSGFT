const app = getApp();
const { addUrl } = require('../../utils/util.js');

Page({
  /**
   * wxdata 当前页使用到的数据
   * 
   * @data {Bollean} showTopTips 是否显示错误提示
   * 
   * @wxdata {} name 姓名
   * @wxdata {} phone 电话
   * @wxdata {} address 地区
   * @wxdata {} content 购房需求
   * @wxdata {} area 购房面积
   * 
   * @wxdata {Array} formData 表单每项内容构成的数组
   * @wxdata {Array} errInfo 表单每项如果校验不通过后的错误提示文字
   * 
   * @wxdata {} addressArr 所在的区域下拉列表选项
   * @wxdata {} addressIndex 下拉列表选项索引
   * 
   * @wxdata {} imgUrls swiper显示的图片
   * 
   * @wxdata {} starClassList 评分全星、空星的类名构成的数组
   */
  data: {
    showTopTips: false,

    name: '',
    phone: '',
    address: '黄石港区',
    content: '',
    area: '',

    formData: [],
    errInfo: ['请输入姓名', '请输入联系电话', '请输入选择地区', '请输入购房需求', '请输入预购面积'],

    addressArr: ["黄石港区", "西塞山区", "下陆区a", '铁山区'],
    addressIndex: 0,
    imgUrls: [],

    starClassList: []
  },
  /** 
   * 姓名内容改变后赋值data函数
   */
  userNameChange(e) {
    // console.log('姓名', e.detail.value);
    this.setData({
      name: e.detail.value
    });
  },
  /** 
   * 联系电话改变后赋值data函数
   */
  telChange(e) {
    // console.log('联系电话', e.detail.value);
    this.setData({
      phone: e.detail.value
    })
  },
  /**
   * 地区选择后的赋值data函数
   * @change {} addressIndex 获取选择的索引,显示address对应索引的值
   * 这就是 weui小程序picker实现效果的原理
   * @vars {} index 当前选择的索引给其赋值
   * @vars {} address 当前选择的address中的某一项
   * @explain 页面地区有个隐藏的输入框 value="{{address}}" 值绑定为当前address的值,
   * 达到提交表单时候这个表单有值效果
   */
  addressChange: function(e) {
    // console.log('picker country 发生选择改变，携带值为', e.detail.value);
    let index = e.detail.value;
    let address = this.data.addressArr[index];
    this.setData({
      addressIndex: index,
      address: address
    });
  },
  /**
   * 购房需求内容改变后赋值data函数
   */
  contentChange(e) {
    this.setData({
      content: e.detail.value
    });
  },
  /**
   * 预购面积内容改变赋值data函数
   */
  areaChange(e){
    // console.log('预购面积', e.detail.value);
    this.setData({
      area: e.detail.value
    });
  },
  /**
   * 跳转到成功页面-未使用
   */
  openSuccess: function () {
    wx.navigateTo({
      url: '/pages/ordersuccess/ordersuccess'
    });
  },
  /**
   * 跳转到失败页面-未使用
   */
  openFail: function () {
    wx.navigateTo({
      url: '/pages/orderfail/orderfail'
    });
  },
  /**
   * 点击了提交信息按钮自动会触发
   */
  formSubmit(e) {
    let _checkResult = '';
    let _errorText = '';
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    this.getFormData();
    if (this.data.formData.length > 0) { 
      let _typeof = typeof this._isEmpty(this.data.formData);
      let _index = this._isEmpty(this.data.formData);
      if (_typeof == 'number') {
        _errorText = this.data.errInfo[_index];
        this._handleToast(_errorText, 0);
      } else if (_typeof == 'boolean') {
        console.log('all pass');
        this._handleToast('提交中,请稍等', 2, 100000);
        this.orderFormSubmit( e.detail.value );
      }
    }
  },
  /**
   * 重置表单-功能未使用
   */
  formReset: function() {
    console.log('form发生了reset事件')
    this.getArea();
  },
  /**
   * 生命周期函数--监听页面加载
   * @execute {} initGetBanner 加载中执行请求后台获取轮播图片方法
   */
  onLoad() {
    this.initGetBanner();
    this.getArea();
  },
  /**
   * 房产轮播大图获取函数
   * @execute {Method} addUrl 全局图片加前缀方法，所在模块util
   * @API {Method} setData 微信小程序改变数据的方法
   */
  initGetBanner() {
    app.fetch(app.host.orderBanner, {id: 14})
      .then((res)=>{
        // console.log('res', res);
        let data = res.data;
        if (data.code === 1) {
          let imgArr = data.data;
          let forMatImgArr = addUrl(imgArr)
          this.setData({
            imgUrls: forMatImgArr
          });
        }
      })
      .catch((err)=>{
        console.log('err', err);
      })
  },
  /**
   * 获取表单内容构成的数组
   * @return {Array} arr 当前表单选项构成的数组
   * @explain 这个方法不仅返回表单内容构成的数组，而且给data formData赋值为表单内容构成的数组
   */
  getFormData() {
    let arr = [this.data.name, this.data.phone, this.data.address, this.data.content, this.data.area];
    this.setData({
      formData: arr
    });
    return arr;
    console.log(arr);
  },
  /**
   * 检查表单每项是否为空
   * @return 如果每项都不为空返回false, 如果至少有一项为空就返回数组从左到右第一个空的索引
   * @explain: 如果每项都不为空返回false, 如果至少有一项为空就返回数组从左到右第一个空的索引
   */
  _isEmpty(arr) {
    let index = 0;
    let isEmptyFlag = false;

    if (arr.length > 0) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].length == 0) { // 为空字符串
          index = i;
          isEmptyFlag = true;
          break;
        }
      }
    } else {
      console.log('Param TypeError');
    }
    let result = isEmptyFlag ? index : false;
    return result;
  },
  /** 
   * toast 封装
   * @explain: 
   * type=1 显示成功的toast，
   * type=0 显示验证失败的toast 
   * type=2 显示加载中的toast
   */
  _handleToast(infoText, type, duration=1500) {
    switch(type) {
      case 0:
        wx.showToast({
          title: infoText,
          image: '../../assets/images/error.png'
        });
        break;
      case 1:
        wx.showToast({
          title: infoText,
          icon: 'success'
        });
        break;
      case 2:
        wx.showToast({
          title: infoText,
          icon: 'loading',
          duration: duration
        });
    }
  },
  /**
   * 提交购房需求表单数据到后台
   */
  orderFormSubmit(data) {
    app.fetch(app.host.orderForm, data, "POST")
      .then((res)=>{
        // console.log(res);
        let resData = res.data;
        if(resData.code === 1) {
          wx.hideToast();
          this._handleToast('提交成功', 1);
        } else if(resData.code === 0) {
          wx.hideToast();
          this._handleToast(resData.msg, 0);
        }
      })
      .catch((err)=>{
        console.log(err);
      })
  },
  /**
   * 购房地区获取
   */
  getArea() {
    app.fetch(app.host.indexArea)
      .then((res)=>{
        let resData = res.data;
        if(resData.code === 1) {
          let forMatArr = this.getAreaArr(resData.data);
          this.setData({
            addressArr: forMatArr,
            address: forMatArr[0]
          });
        }
      })
      .catch((err)=>{
        console.log(err);
      })
  },
  /**
   * 返回地区名字字符串构成的数组
   */
  getAreaArr(arr) {
    let result = [];
    if(arr.length > 0) {
      arr.forEach((item)=>{
        result.push(item.menuname);
      });
    }
    return result;
  }
});