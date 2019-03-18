/*
* 包含n个工具函数的模块
* */
/*
* 用户主界面路由
*   maNong:/manong
*   laoBan:/laoban
*
* 用户信息完善界面路由
*   maNong:/manonginfo
*   laoBan:/laobaninfo
* 判断是否已经完善了信息？user.header是否有值？
* 判断用户类型：user.type
* */

//返回对应的路由路径
export function getRedirectTo (type, header) {
  let path
  if (type === 'laoBan') {
    path = '/laoban'
  } else {
    path = '/manong'
  }
  //没有值的话直接加info  =>  让他去完善信息
  if (!header) {
    path += 'info'
  }
  return path
}