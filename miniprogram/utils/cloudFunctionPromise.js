// 云函数 增删改查封装
const app = getApp();
import dayjs from './day.min.js'

var ajax = function (obj, cb, errcb) {
  return new Promise(function (resolve, reject) {
    obj.data.env = app.globalData.CLOUD_ENV;
    wx.showLoading({ title: '加载中...' })
    wx.cloud.callFunction(obj).then(function (e) {
      wx.hideLoading();
      resolve(e);
    }).catch((e) => {
      wx.hideLoading();
      wx.showToast({
        icon: 'none',
        title: '网络出小差了,请稍后再试...'
      })
      reject(e)
    })
  });
}

var cloud = {
  // 增
  insert: function (tbName, data, cb, errcb) {
    data.createon = dayjs().format("YYYY-MM-DD HH:mm:ss");
    return ajax({
      name: 'insert',
      data: {
        "tbName": tbName, // 数据库表名
        "data": data // 要存储的内容
      }
    }, cb, errcb)
  },
  // 删
  delete: function (tbName, query, cb, errcb) {
    ajax({
      name: 'delete',
      data: {
        tbName: tbName, // 数据库表名
        query: query // 查询条件
      }
    }, cb, errcb)
  },
  update: function (tbName, query, data, cb, errcb) {
    ajax({
      name: 'update',
      data: {
        tbName: tbName, // 数据库表名
        query: query, // 查询条件
        data: data
      }
    }, cb, errcb)
  },
  get: function (tbName, query, cb, errcb) {
    ajax({
      name: 'get',
      data: {
        tbName: tbName, // 数据库表名
        query: query // 查询条件
      }
    }, cb, errcb)
  },
  list: function (tbName, query, page, size, field, order, cb, errcb) {
    ajax({
      name: 'list',
      data: {
        tbName: tbName, // 数据库表名
        query: query, // 查询条件
        page: page,
        size: size,
        field: field,
        order: order
      }
    }, cb, errcb)
  },
  ajax: ajax
}
export { cloud };