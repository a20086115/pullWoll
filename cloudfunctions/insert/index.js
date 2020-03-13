// 云函数入口文件
const cloud = require('wx-server-sdk')
// 云函数入口函数
// 向某表中插入一条数据
exports.main = async (event, context) => {
  // 判断环境
  console.log(event)
  if (!event.env) return { errCode: -1, errMsg: '环境id为空' }
  cloud.init({
    env: event.env,
    traceUser: true
  })
  const db = cloud.database();

  let openId = event.userInfo.openId;
  let tbName = event.tbName; // 要插入的表名
  let data = event.data;  // 要插入的对象
  data.openId = openId;

  // 基于base62编码生成14位的ID字符串
  // 优点：短/按时间序/双击可全选/唯一性足够安全
  function getId() {
    var ret = ''
    var ms = (new Date()).getTime()
    ret += base62encode(ms, 8) // 6923年循环一次
    ret += base62encode(Math.ceil(Math.random() * (62 ** 6)), 6) // 冲突概率为每毫秒568亿分之一
    return ret
  }
  let codeStr = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
  function base62encode(v, n) {
    var ret = ""
    for (var i = 0; i < n; i++) {
      ret = codeStr[v % codeStr.length] + ret
      v = Math.floor(v / codeStr.length)
    }
    return ret
  }

  data.id = getId()
  try {
    return await db.collection(tbName).add({
      data: data
    })
  } catch (e) {
    console.error(e)
  }
}