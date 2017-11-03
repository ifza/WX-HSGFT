/** 
 * 请求地址汇总
 * 此host对象会作为根app的属性即app.host
 * 
 * @vars {String} domain 访问的域
 * @attr {String} host.domain 指向访问的域
 * @attr {String} host.imgBefore 图片地址前面需要添加的地址
 * @attr {String} host.indexArea 首页区域(index)--顶部tab标题名字
 * @attr {String} host.indexLocation 首页(index)坐标点--地图内容呈现
 * @attr {String} host.houstBanner 房产页banner(house)图片请求地址
 * @attr {String} host.houseArea 房产页(house)房产区域分类
 * @attr {String} host.houseList 房产页(house)房产列表
 * @attr {String} host.houseDetail 房产页(houselist)房产详情
 * @attr {String} host.newsBanner 资讯页banner图片请求地址
 * @attr {String} host.news 资讯页列表请求地址
 * @attr {String} host.newsDetail 资讯文章详情页请求地址
 * @attr {String} host.orderBanner 购房页banner图片请求地址
 * @attr {String} host.orderForm 购房需求订单提交
 */

const ProDomain = 'https://weixin.shinycg.com/';
const domain = ProDomain;

const host = {
  domain: domain,
  imgBefore: `${domain}/sites/hshouse`,
  // 首页(index)
  indexArea: `${domain}/sites/hshouse/public/index.php/index/Map/area`,
  indexLocation: `${domain}/sites/hshouse/public/index.php/index/Map/location`,

  // 房产(house)
  houstBanner: `${domain}/sites/hshouse/public/index.php/index/Advertise/getPic`,
  houseArea: `${domain}/sites/hshouse/public/index.php/index/Product/area`,
  houseList: `${domain}/sites/hshouse/public/index.php/index/Product`,
  // 房产详情(houselist)
  houseListPage: `${domain}/sites/hshouse/public/index.php/index/Product/detail`,

  // 资讯
  newsBanner: `${domain}/sites/hshouse/public/index.php/index/Advertise/getPic`,
  news: `${domain}/sites/hshouse/public/index.php/index/News/index`,
  newsDetail: `${domain}/sites/hshouse/public/index.php/index/News/detail`,

  // 购房列表
  orderBanner: `${domain}/sites/hshouse/public/index.php/index/Advertise/getPic`,
  orderForm: `${domain}/sites/hshouse/public/index.php/index/Need/getForm`

}

module.exports = host;