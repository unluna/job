/*
* 包含n个action type名称常量
* */

export const AUTH_SUCCESS = 'auth_success'    //注册/登录成功
export const ERROR_MSG = 'error_msg'          //错误提示信息   请求前/请求后
export const RECEIVE_USER = 'receive_user'    //接收用户信息
export const RESET_USER = 'reset_user'        //重置用户信息
export const RECEIVE_USER_LIST = 'receive_user_list'          //接收用户列表数据
export const RECEIVE_MSG_LIST = 'receive_msg_list'          //接收用户所有消息列表
export const RECEIVE_ONE_MSG = 'receive_one_msg'          //接收用户收到一条消息
export const MSG_READ = 'MSG_READ'          //查看过了某个聊天消息