module.exports=(server)=>{
  const io = require('socket.io')(server)
  
  //监视客户端与服务器的连接
  io.on('connection',function (socket) {
    console.log('有一个浏览器连接上了服务器')
    //绑定监听，接收客户端发送的消息
    socket.on('clientToServer',function (data) {
      console.log(data)

      //向浏览器发送消息
      socket.emit('serverToClient','浏览器你好~~')
      // io.emit('serverToClient','浏览器你好~~')//全都发
    })
  })
}