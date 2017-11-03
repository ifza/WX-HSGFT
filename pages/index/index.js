//index.js
import { ConvasMAP } from '../../components/index'

const { addUrl } = require('../../utils/util.js');
//获取应用实例
const app = getApp()

//创建组件实例
const map = new ConvasMAP({
  debug: false,
  callback: function (res) {
    console.log('回调数据',res)
    // wx.navigateTo({ url: `/pages/houselist/houselist?id=${r.id}` })
  }
})
Page({
  /**
   * 小程序当前页数据模型对象data
   * 
   * @attr {Array} tabs tab每项内容对象构成的数组
   * @arrt {Number} activeIndex 加载时默认激活的tab索引(0,1,2,3)
   * @attr {} sliderLeft
   * @attr {Number} defaultLocationIndex 加载时默认显示的tab内容
   * @attr {Object} tab1Content tab1的内容对象
   * @attr {Object} tab2Content tab2的内容对象
   * @attr {Object} tab3Content tab3的内容对象
   * @attr {Object} tab4Content tab4的内容对象
   */
  data: {
    tabData: {},
    areaData: [],
    tabs: [],
    activeIndex: 0,
    sliderLeft: 0,
    defaultLocationIndex: 0
  },
  // 加载生命周期
  onLoad: function () {

    wx.showLoading({ title: '数据加载中', mask: true })
    this._getTabTitle().then(() => {
      this._getLocation(this.data.defaultLocationIndex).then(() => {
        //获取屏幕显示区域宽高
        wx.getSystemInfo({
          success: function (res) {
            map.height = res.windowHeight
            map.width = res.windowWidth
            //初始化数据
            map.Load().then(() => {
              console.log('加载完成')
              wx.hideLoading()
            })
          },
          fail() { wx.hideLoading()}
        })
      }).catch(e=>{
        console.log(e)
        wx.hideLoading()
      })
    }).catch(e => {
      console.log(e)
      wx.hideLoading()
    })
  },
  start: (e) => map.State(e),
  end: (e) => map.End(e),
  move: (e) => map.Move(e),
  /**
   * tab栏切换
   * 
   * @vars {String} e.currentTarget.id 当前点击对象的id值，js元素方.
   * @vars {String} e.currentTarget.dataset.id 当前点击对象的data-id值
   * 小程序内置API.
   * @explain
   */
  tabClick(e) {
    wx.showLoading({ title: '数据加载中', mask: true })
    const dataId = e.currentTarget.dataset.id;
    this.setData({ activeIndex: e.currentTarget.id });
    this._getLocation(dataId).then(() => {
      map.Load().then(() => {
        wx.hideLoading()
      })
    }).catch(e => {
      console.log(e)
    })
  },
  /**
   * request获取tab title
   * @attr {Fn} app.fetch().then() 返回一个 Promise对象
   * @explain: request后台获取tab标题的名字字符串，然后给data赋值
   * 设置默认内容的id,
   */
  _getTabTitle() {
    return new Promise((res, rej) => {
      app.fetch(app.host.indexArea)
        .then(r => {
          const result = r.data
          if (result.code === 1) {
            this.setData({
              tabs: result.data,
              defaultLocationIndex: result.data[0].id
            })
            res()
          } else { rej(r.data.msg) }
        })
        .catch(e => { rej(err) })
    })
  },
  /**
   * request 获取坐标点
   * 
   * @explain 
   */
  _getLocation(id) {
    return new Promise((res, rej) => {
      app.fetch(app.host.indexLocation, { id, id })
        .then(result => {
          if (result.data.code === 1) {
            map.map.remote = result.data.bg.url
            map.masks = []
            result.data.data.forEach(o => {
              map.masks.push({ 
                x: o.nodex,
                y: o.nodey,
                title: { text: '地标', color: 'black', size: 20, align:'right',show:true},
                icon:{src: '/image/map-1.png',w: 32,h: 32,show:true},
                //img:{src:'',w:65,h:64,show:true},
                link: `/pages/houselist/houselist?id=${o.id}` ,
                data:o
              })
            })
            res()
          } else {
            rej(result.data.msg)
          }
        })
        .catch(e => {
          console.log(e)
        })
    })
  }
})