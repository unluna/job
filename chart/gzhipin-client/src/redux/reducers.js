/*
* 包含n个reducers函数：根据老的state和指定的action返回一个新的state
* */

import { combineReducers } from 'redux'

import {
  AUTH_SUCCESS,
  ERROR_MSG,
  RECEIVE_USER,
  RESET_USER,
  RECEIVE_USER_LIST,
  RECEIVE_MSG_LIST,
  RECEIVE_ONE_MSG,
  MSG_READ,
} from './action-types'

import { getRedirectTo } from '../utils'

//产生user状态的reducer
const initUser = {
  username: '',//用户名
  type: '',//用户类型: manong,laoban
  msg: '',//错误提示信息
  redirectTo: '',//需要自动重定向的路由路径
}
let user = (state = initUser, action) => {
  switch (action.type) {
    case AUTH_SUCCESS://data 是 user
      const {type, header} = action.data
      return {...action.data, redirectTo: getRedirectTo(type, header)}
    case ERROR_MSG://data 是 msg
      return {...state, msg: action.data}
    case RECEIVE_USER://data 是 user
      return action.data
    case RESET_USER://data 是 msg
      return {...initUser, msg: action.data}
    default :
      return state
  }
}

//产生userlist状态的reducer
const initUserList = []
let userList = (state = initUserList, action) => {
  switch (action.type) {
    case RECEIVE_USER_LIST:  //data为userList
      return action.data
    default:
      return state
  }
}

//产生聊天状态的reducer
const initChat = {
  users: {},          //所有用户信息的对象   userId:{username,header}
  chatMsgs: [],        //当前用户所有相关msg的数组
  unReadCount: 0,     //总的未读数量
}
let chat = (state = initChat, action) => {
  switch (action.type) {
    case RECEIVE_MSG_LIST:
      const {users, chatMsgs, userId} = action.data
      return {
        users,
        chatMsgs,
        unReadCount: chatMsgs.reduce((preTotal, msg) => preTotal +
          (!msg.read && msg.to === userId ? 1 : 0), 0),
      }
    case RECEIVE_ONE_MSG:
      const {chatMsg} = action.data
      return {
        users: state.users,
        chatMsgs: [...state.chatMsgs, chatMsg],
        unReadCount: state.unReadCount +
          (!chatMsg.read && chatMsg.to === action.data.userId ? 1 : 0),
      }
    case MSG_READ:
      const {from, to, count} = action.data
      return {
        users: state.users,
        chatMsgs: state.chatMsgs.map(item => {
          if (item.from === from && item.to === to && !item.read) {
            return {...item, read: true}
          } else {
            return item
          }
        }),
        unReadCount: state.unReadCount - count,
      }
    default:
      return state
  }
}

export default combineReducers({
  user,
  userList,
  chat,
})
//向外暴露的结构：{ user:{} , userList:[] , chat:{} }

