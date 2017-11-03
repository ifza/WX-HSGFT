/** 
 * @module fetch 微信小程序 wx.request 抽象函数
 * @param  {String} url     请求地址
 * @param  {Objece} params  请求中需要的参数
 * @param {string} method   请求的类型,不填默认'GET'
 * @return {Promise} new Promise() 返回一个Promise对象
 */

module.exports = (url, params, method) => {
  // console.log('fetch', url, params, method);
  method  = method || 'GET';
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${url}`,
      data: Object.assign({}, params),
      header: { 'Content-Type': 'json' },
      method: method,
      success: resolve,
      fail: reject
    });
  })
}