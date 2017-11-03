
const host = require('./host')
const fetch = require('./fetch')

/** 
 * 请求后台地址函数集合--函数内部说明
 * @param {String} url： 必需，服务端请求的地址
 * @param {JSON} params: 必需，地址后面加的参数
 * @param {String} method: 选择, 请求类型，如果不填默认为 'GET'
 * @return 调用fetch方法(./fetch.js )
 * 
 * 请求后台地址函数集合--函数功能说明
 * 
 */

// 资讯相关
const newsList = (url, params, method) => fetch(url, params, method);
const newsDetail = (url, params, method) => fetch(url, params, method);
const GetArea = (url, params, method) => fetch(url, params, method);
const GetMasks = (url, params, method) => fetch(url, params, method);
module.exports = { newsList, newsDetail, GetArea, GetMasks }
