import io from 'socket.io-client'

//连接服务器,得到与服务器连接的对象
const socket = io('ws://www.unluna.com:8080')

//发送消息
socket.emit('clientToServer',{hello:'服务器你好~~'})

socket.on('serverToClient',function (data) {
  console.log(data)
})
