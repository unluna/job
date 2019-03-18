/*
* 包含n个action creator
* 异步的action
* 同步的action
* */
import {
  AUTH_SUCCESS,
  ERROR_MSG,
  RECEIVE_USER,
  RESET_USER,
  RECEIVE_USER_LIST,
  RECEIVE_MSG_LIST,
  RECEIVE_ONE_MSG,
  MSG_READ
} from './action-types'

import {
  reqRegister,
  reqLogin,
  reqUpdateUser,
  reqUser,
  reqUserList,
  reqChatMsgList,
  reqReadMsg,
} from '../api'

import io from 'socket.io-client'

/*
* 单例对象
* 1.创建对象之前：判断对象是否存在，只有不存在=>才去创建
* 2.创建对象之后：保存对象
* */
function initIO (userId, dispatch) {
  if (!io.socket) {
    //连接服务器,得到与服务器连接的对象
    io.socket = io('ws://www.unluna.com:8080')
    //监听服务器发来的消息
    io.socket.on('serverToClient', function (chatMsg) {
      if (userId === chatMsg.from || userId === chatMsg.to) {
        dispatch(receiveOneMsg(chatMsg, userId))
      }
    })
  }
}
const msgRead=({count,from,to})=>({type:MSG_READ,data:{count,from,to}})
//读取消息的异步action
export const readMsg = (from,to) => {
  return async dispatch => {
    const response =await reqReadMsg(from)
    const result = response.data
    if(result.code===0){
      const count = result.data
      dispatch(msgRead({count,from,to}))
    }
  }
}

//异步获取消息列表数据
async function getMsgList (userId, dispatch) {
  initIO(userId, dispatch)
  const response = await reqChatMsgList()//ajax=>消息列表
  const result = response.data
  if (result.code === 0) {
    const {users, chatMsgs} = result.data
    //分发同步actions
    dispatch(receiveMsgList({users, chatMsgs, userId}))
  }
}

//发送消息的异步action
export const sendMsg = ({from, to, content}) => {
  return dispatch => {
    console.log('发送消息', {from, to, content})
    // 发消息
    io.socket.emit('clientToServer', {from, to, content})
  }
}
//接受一个消息的同步action
const receiveOneMsg = (chatMsg, userId) => ({
  type: RECEIVE_ONE_MSG,
  data: {chatMsg, userId},
})

//接收消息列表的同步action
const receiveMsgList = ({users, chatMsgs, userId}) => ({
  type: RECEIVE_MSG_LIST,
  data: {users, chatMsgs, userId},
})

//授权成功的同步action
const authSuccess = (user) => ({type: AUTH_SUCCESS, data: user})

//错误提示信息的同步action
const errorMsg = (msg) => ({type: ERROR_MSG, data: msg})

//接收用户完善信息的同步action
const receiveUser = (user) => ({type: RECEIVE_USER, data: user})

//接受用户列表的同步action
const receiveUserList = (userList) => ({
  type: RECEIVE_USER_LIST,
  data: userList,
})

//重置用户的同步action
export const resetUser = (msg) => ({type: RESET_USER, data: msg})

//注册异步action
export const register = (user) => {
  const {username, password, repeatPassword, type} = user
  //表单的前台验证 =>密码和重复密码 ， 如果不通过，分发一个errorMsg的同步actuon
  if (!username) {
    return errorMsg('需要输入用户名!')
  } else if (!password) {
    return errorMsg('需要输入密码!')
  } else if (password !== repeatPassword) {
    return errorMsg('2次密码要一致！')
  }

  return async dispatch => {
    //发送注册的异步ajax请求
    //async、await => 直接把response拿过来了    reqRegister({username, password, type})是发送请求的函数
    const response = await reqRegister({username, password, type})
    const result = response.data
    if (result.code === 0) {
      getMsgList(result.data._id, dispatch)
      //分发授权成功的action
      dispatch(authSuccess(
        result.data,
      ))
    } else {
      //分发错误的action
      dispatch(errorMsg(
        result.msg,
      ))
    }
  }
}

//登录异步action
export const login = (user) => {
  const {username, password} = user
  //表单的前台验证 =>密码和重复密码 ， 如果不通过，分发一个errorMsg的同步actuon
  if (!username) {
    return errorMsg('需要输入用户名!')
  } else if (!password) {
    return errorMsg('需要输入密码!')
  }

  return async dispatch => {
    //发送登录的异步ajax请求
    const response = await reqLogin(user)
    const result = response.data
    if (result.code === 0) {
      getMsgList(result.data._id, dispatch)
      //分发授权成功的action
      dispatch(authSuccess(
        result.data,
      ))
    } else {
      //分发错误的action
      dispatch(errorMsg(
        result.msg,
      ))
    }
  }
}

//更新用户详细信息异步action
export const updateUser = (user) => {

  return async dispatch => {
    const response = await reqUpdateUser(user)
    const result = response.data
    if (result.code === 0) {//更新成功
      dispatch(receiveUser(result.data))
    } else {//更新失败
      dispatch(resetUser(result.msg))
    }
  }
}

//自动登录获取“用户自己的信息”的异步action
export const getMe = () => {
  return async dispatch => {
    const response = await reqUser()
    const result = response.data
    if (result.code === 0) {
      getMsgList(result.data._id, dispatch)
      dispatch(receiveUser(result.data))
    } else {
      dispatch(resetUser(result.msg))
    }
  }
}

//获取用户列表的异步action
export const getUserList = (type) => {
  return async dispatch => {
    //执行异步ajax请求
    const response = await reqUserList(type)
    const result = response.data
    //得到结果后分发一个同步action
    if (result.code === 0) {
      dispatch(receiveUserList(result.data))
    }
  }
}

