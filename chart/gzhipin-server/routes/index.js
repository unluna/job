const express = require('express')
const router = express.Router()

const md5 = require('blueimp-md5')
const {UserModel, ChatModel} = require('../db/models')
const filter = {password: 0, __v: 0}

//注册的路由
router.post('/register', function (req, res) {
  //读取请求参数数据
  const {username, password, type} = req.body
  //处理
  UserModel.findOne({username}, function (err, userDoc) {
    if (!err) {
      if (userDoc) {//用户已存在
        res.send({code: 1, msg: '此用户已存在'})
      } else {//不存在则保存
        new UserModel({username, password: md5(password), type}).save(
          function (err, userDoc) {
            //生成一个cookie
            res.cookie('userId', userDoc._id, {maxAge: 1000 * 60 * 60 * 24})
            //响应数据中不要携带密码
            const data = {id: userDoc._id, username, type}
            res.send({code: 0, data: data})
          })
      }
    } else {
      console.log(err)
    }
  })
})

//登陆的路由
router.post('/login', function (req, res) {
  const {username, password} = req.body
  //根据username和password查询数据库
  UserModel.findOne({username, password: md5(password)},
    filter,
    function (err, userDoc) {
      if (!err) {
        if (userDoc) {//登陆成功
          res.cookie('userId', userDoc.id, {maxAge: 1000 * 60 * 60 * 24})
          res.send({code: 0, data: userDoc})
        } else {//登录失败
          res.send({code: 1, msg: '用户名或密码不正确'})
        }
      } else {
        console.log(err)
      }
    })
})

//更新用户信息的路由
router.post('/update', function (req, res) {

  //从请求里携带的的cookie中找出userId
  const userId = req.cookies.userId
  if (!userId) {//如果不存在，返回一个提示信息
    res.send({code: 1, msg: '请先登录！'})
  } else {//存在，根据userId更新对应的user文档数据
    //得到提交的用户数据
    const user = req.body
    UserModel.findByIdAndUpdate({_id: userId}, user, function (error, oldUser) {
      if (!oldUser) {
        //坏掉的cookie ^_^ 干掉他
        res.clearCookie('userId')
        //返回一个提示信息
        res.send({code: 1, msg: '你的cookie是坏掉的，请先登录！'})
      } else {
        //准备一个返回的user数据对象
        const {_id, username, type} = oldUser
        const data = Object.assign(user, {_id, username, type})
        res.send({code: 0, data: data})
      }
    })
  }
})

//获取用户信息的路由（根据cookie中的userId）
router.get('/user', function (req, res) {
  //从请求里携带的的cookie中找出userId
  const userId = req.cookies.userId
  if (!userId) {//如果不存在，返回一个提示信息
    res.send({code: 1, msg: '请先登录！'})
  } else {
    //根据userid查询对应的user
    UserModel.findOne({_id: userId}, filter, function (err, user) {
      res.send({code: 0, data: user})
    })
  }
})

//获取用户列表
router.get('/userlist', function (req, res) {
  const {type} = req.query
  UserModel.find({type}, filter, function (err, users) {
    res.send({code: 0, data: users})
  })
})

/*
* 获取当前用户所有相关聊天信息列表
*/
router.get('/msglist', function (req, res) {
  // 获取 cookie 中的 userid
  const userId = req.cookies.userId
  // 查询得到所有 user 文档数组
  UserModel.find(function (err, userDocs) {
    // 用对象存储所有 user 信息: key 为 user 的_id, val 为 name 和 header 组成的 user 对象
    //    - userDocs =>[ {user:{name:'jiaWei',header:'头像1'}},{user:{name:'jiaWei2',header:'头像2'}}, ...]
    // const users = {} // 对象容器
    // userDocs.forEach(doc => {
    //   users[doc._id] = {username: doc.username, header: doc.header}
    // })
    const users = userDocs.reduce((users, user) => {
      users[user._id] = {username: user.username, header: user.header}
      return users
    }, {})
    /*查询 userid 相关的所有聊天信息
    参数 1: 查询条件
    参数 2: 过滤条件
    参数 3: 回调函数
    */
    //{from: userId}发送用户的id, {to: userId}接收用户的id]}
    ChatModel.find({
      '$or': [{from: userId}, {to: userId}],
    }, filter, function (err, chatMsgs) {
      // 返回包含所有用户和当前用户相关的所有聊天消息的数据
      res.send({code: 0, data: {users, chatMsgs}})
    })
  })
})
/*
* 修改指定消息为已读
*/
router.post('/readmsg', function (req, res) {
  // 得到请求中的 from 和 to
  const from = req.body.from
  const to = req.cookies.userId
  /*更新数据库中的 chat 数据
  参数 1: 查询条件
  参数 2: 更新为指定的数据对象
  参数 3: 是否 1 次更新多条, 默认只更新一条
  参数 4: 更新完成的回调函数
  */
  ChatModel.update({from: from, to: to, read: false}, {read: true},
    {multi: true},
    function (
      err,
      doc) {
      console.log('/readmsg', doc)
      res.send({code: 0, data: doc.nModified}) // 更新的数量
    })
})

module.exports = router
