/*对话消息列表组件
*/
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { List, Badge } from 'antd-mobile'

const Item = List.Item
const Brief = Item.Brief

class Message extends Component {

  // 对chatMsgs按照chat_id进行分组，并得到每个组的lastMsg组成的数组

  getLastMsgs = (chatMsgs, userId) => {
    //   - 1.找出每个组的lastMsg，并用一个对象去保存{chat_id:{lastMsg}}
    const oLastMsgs = {}
    if(!chatMsgs){
      return
    }
    chatMsgs.forEach(item => {
      //对item进行个体的统计
      if (item.to === userId && !item.read) {
        item.unReadCount = 1
      } else {
        item.unReadCount = 0
      }
      //得到msg的聊天标识id
      const chatId = item.chat_id
      //获取已保存的当前组件的lastMsg
      let lastMsg = oLastMsgs[chatId]
      if (!lastMsg) {//没有
        oLastMsgs[chatId] = item
      } else {//有
        let unReadCount = lastMsg.unReadCount
        if (item.create_time > lastMsg.create_time) {
          oLastMsgs[chatId] = item
        }
        //把统计的结果加到 lastMsgs[chatId]的unReadCount里
        oLastMsgs[chatId].unReadCount = unReadCount + item.unReadCount
      }
    })
    //   - 2.得到所有lastMsg的数组 obj.value=>arr
    const aLastMsgs = Object.values(oLastMsgs)
    //   - 3.对数组进行排序(按照create_time降序)
    aLastMsgs.sort((m1, m2) => {//如果结果<0，将m1放前面 => 升序
      return (
        m2.create_time - m1.create_time
      )
    })
    return aLastMsgs
  }

  render () {
    const {user} = this.props
    const {users, chatMsgs} = this.props.chat

    //对chatMsgs进行分组  chat_id
    const aLastMsgs = this.getLastMsgs(chatMsgs, user._id)


    return (
      <List style={{marginTop: 50, marginBottom: 50}}>

        {aLastMsgs?
          aLastMsgs.map((item) => {
            const tartgetUserId = item.to === user._id ? item.from : item.to
            const tartgetUser = users[tartgetUserId]
            return (
              <Item
                key={item._id}
                extra={<Badge text={item.unReadCount}/>}
                thumb={require(`../../assets/images/${tartgetUser.header}.png`)}
                arrow='horizontal'
                onClick={() => this.props.history.push(
                  `/chat/${tartgetUserId}`)}
              >
                {item.content}
                <Brief>{tartgetUser.username}</Brief>
              </Item>
            )
          }):null
        }
      </List>
    )
  }
}

export default connect(
  state => ({user: state.user, chat: state.chat}),
  {},
)(Message)