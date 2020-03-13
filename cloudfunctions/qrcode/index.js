const cloud = require('wx-server-sdk')
exports.main = async (event, context) => {
  // 判断环境
  if (!event.env) return { errCode: -1, errMsg: '环境id为空' }
  cloud.init({
    env: event.env,
    traceUser: true
  })
  const db = cloud.database();
  try {
    const result = await cloud.openapi.wxacode.getUnlimited({
      scene: event.scene,
      page: 'pages/index/index',
      isHyaline: false
    })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}