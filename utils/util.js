/** 
 * @module {JSON} 导出方法构成的对象
 * @attr {Fn} addUrl 图片地址补全
 */

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
};

/** 
 * 图片添加完整地址
 * 
 * @param {Array} arr 必填 一个数组，有多个对象构成
 * @param {String} attr 选填  对象的默认属性['picurl']，如果添加这个属性，给这个属性添加完整的地址
 */
const addUrl = (arr, attr = 'picurl') => {
  if (arr.length > 0) {
    const url = 'https://weixin.shinycg.com/sites/hshouse';
    arr.forEach((item) => {
      item[attr] = `${url}${item[attr]}`
    });
  }
  return arr;
}

/**
 * 评分星星，满星空星类名构成的数组实现函数,
 * 由于通过分数循环生成星星，此方法未使用
 * 
 * @vars {Number} LENGTH 评分星星的总长度
 * @vars {String} CLS_FULL 保存全星类名字符串'full'
 * @vars {String} CLS_EMPTY 保存空星类名字符串'empty'
 * @stat {Statement} for 循环功能为添加全星
 * @stat {Statement} while 功能为添加空星
 * @return {Array} _classList 星星样式构成的数组
 * @explain: 全星类名.full, 空星类名.empty,返回类似['full', ..., 'empty']
 * 的数组，星星组件通过循环数组，生成view.full view.empty来达到全星半星效果
 */
const forMatStarClassList = (score) => {
  let _classList = [];
  const LENGTH = 5;
  const CLS_FULL = 'full';
  const CLS_EMPTY = 'empty';

  for (let i = 0; i < score; i++) {
    _classList.push(CLS_FULL);
  }
  while (_classList.length < LENGTH) {
    _classList.push(CLS_EMPTY);
  }
  return _classList;
}

module.exports = {
  formatTime: formatTime,
  forMatStarClassList: forMatStarClassList,
  addUrl: addUrl
}
