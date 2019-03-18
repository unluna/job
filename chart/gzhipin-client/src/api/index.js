/*
* 包含了n个接口请求的模块
* */

import ajax from './ajax'

//注册接口
export const reqRegister = (user) => ajax('/apis/register', user, 'POST')

//登录接口
export const reqLogin = ({username, password}) => ajax('/apis/login',
  {username, password}, 'POST')

//更新用户信息接口
export const reqUpdateUser = (user) => ajax('/apis/update', user, 'POST')

//获取用户信息
export const reqUser = () => ajax('/apis/user')

//获取用户列表
export const reqUserList = (type) => ajax('/apis/userlist', {type})

//获取当前用户的聊天列表
export const reqChatMsgList = () => ajax('/apis/msglist')

//修改指定消息为已读
export const reqReadMsg = (from) => ajax('/apis/readmsg', {from}, 'POST')
