/*对话聊天的路由组件
*/
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavBar, List, InputItem, Grid, Icon } from 'antd-mobile'
import QueueAnim from 'rc-queue-anim'
import { sendMsg,readMsg } from '../../redux/actions'

const Item = List.Item

class Chat extends Component {

  state = {
    content: '',
    isShow: false, //是否显示表情列表
  }

  componentWillMount () {
    //初始化表情数据
    const aEmojis = [
      '😍',
      '😹',
      '😂',
      '🍰',
      '🌹',
      '😍',
      '😹',
      '😂',
      '🍰',
      '🌹',
      '😍',
      '😹',
      '😂',
      '🍰',
      '🌹',
      '😍',
      '😹',
      '😂',
      '🍰',
      '🌹',
      '😍',
      '😹',
      '😂',
      '🍰',
      '🌹',
      '😍',
      '😹',
      '😂',
      '🍰',
      '🌹',
      '😍',
      '😹',
      '😂',
      '🍰',
      '🌹',
      '😍',
      '😹',
      '😂',
      '🍰',
      '🌹',
      '😍',
      '😹',
      '😂',
      '🍰',
      '🌹']
    //要求数组里的每一项都是对象   {text:item}
    this.emojis = aEmojis.map((item, index) => ({text: item}))
  }

  componentDidMount () {
    window.scrollTo(0, document.body.scrollHeight)
    //发送请求更新消息的未读状态
    const from = this.props.match.params.userid
    const to = this.props.user._id

    this.props.readMsg(from,to)
  }

  componentDidUpdate () {
    window.scrollTo(0, document.body.scrollHeight)
  }

  componentWillUnmount () {
    //发送请求更新消息的未读状态
    const from = this.props.match.params.userid
    const to = this.props.user._id

    this.props.readMsg(from,to)
  }

  toggleShow = () => {
    const isShow = !this.state.isShow
    this.setState({isShow})
    if (isShow) {
      //解决插件的bug
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'))
      }, 0)
    }
  }

  handleSend = () => {
    const from = this.props.user._id
    //userid : 在main映射路由的时候起名叫userid
    const to = this.props.match.params.userid
    const content = this.state.content.trim()
    //发送请求
    if (content) {
      this.props.sendMsg({
        from, to, content,
      })
      //清除输入数据
      this.setState({content: '', isShow: false})
    }

  }

  render () {
    const {user} = this.props
    const {users, chatMsgs} = this.props.chat
    //对chatMsgs过滤
    const meId = user._id
    if (!users[meId]) {
      return null
    }
    const targetId = this.props.match.params.userid
    const chatId = [meId, targetId].sort().join('_')

    const msgs = chatMsgs.filter(item =>
      item.chat_id === chatId,
    )
    //得到目标用户的头像 header
    const targetIcon = require(
      `../../assets/images/${users[targetId].header}.png`)
    return (
      <div id='chat-page'>
        <NavBar
          icon={<Icon type={'left'}/>}
          className={'stick-header'}
          onLeftClick={() => this.props.history.goBack()}
        >
          {users[targetId].username}</NavBar>
        <List style={{marginBottom: 50, marginTop: 50}}>
          <QueueAnim type='left' delay={100}>
            {msgs ?
              msgs.map(item => {
                if (meId === item.to) {//对方发给我的
                  return (
                    <Item key={item._id}
                          thumb={targetIcon}>
                      {item.content}
                    </Item>
                  )
                } else {//我发给对方的
                  return (
                    <Item key={item._id} className='chat-me'
                          extra={user.username}>
                      {item.content}
                    </Item>
                  )
                }
              }) : null
            }
          </QueueAnim>

        </List>
        <div className='am-tab-bar'>
          <InputItem
            placeholder="请输入"
            onChange={val => this.setState({content: val})}
            value={this.state.content}
            onFocus={() => this.setState({isShow: false})}
            extra={
              <span>
                <span style={{marginRight: 10}}
                      onClick={this.toggleShow}>😃</span>
                <span onClick={this.handleSend}>发送</span>
              </span>
            }
          />
          {
            this.state.isShow ? (<Grid
              data={this.emojis}
              columnNum={8}
              carouselMaxRow={4}
              isCarousel={true}
              onClick={(item) => {
                this.setState({content: this.state.content + item.text})
              }}
            />) : null
          }
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({user: state.user, chat: state.chat}),
  {sendMsg,readMsg},
)(Chat)