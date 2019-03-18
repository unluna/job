const {ChatModel} = require('../db/models')
module.exports = (server) => {
  const io = require('socket.io')(server)

  //监视客户端与服务器的连接
  io.on('connection', function (socket) {
    console.log('有一个浏览器连接上了服务器')
    //绑定监听，接收客户端发送的消息
    socket.on('clientToServer', function ({from, to, content}) {
      console.log({from, to, content})
      //处理数据（保存消息）
      //准备chatMsg对象的相关数据
      const chat_id = [from, to].sort().join('_')//from_to   to_from  排序
      const create_time = Date.now()
      //把收到的这条数据保存到数据库里
      new ChatModel({from, to, content, chat_id, create_time}).save(
        function (err, chatMsg) {
          //向客户端发消息
          // socket.emit('serverToClient',chatMsg)
          io.emit('serverToClient',chatMsg)
        })
    })
  })
}