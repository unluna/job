/*用户列表的 UI 组件
*/
import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import PropTypes from 'prop-types'
import { Card, WingBlank, WhiteSpace } from 'antd-mobile'
import QueueAnim from 'rc-queue-anim'

const Header = Card.Header
const Body = Card.Body

class UserList extends Component {
  static = {
    userList: PropTypes.array.isRequired,
  }

  render () {
    const {userList} = this.props
    return (
      <WingBlank style={{marginTop:50, marginBottom:60}}>
        <QueueAnim type='scale'>
          {
            userList.map((item) => {
              return (
                <div key={item._id}>
                  <WhiteSpace/>
                  <Card onClick={()=>this.props.history.push(`/chat/${item._id}`)}>
                    <Header
                      thumb={require(`../../assets/images/${item.header}.png`)}
                      extra={item.username}
                    />
                    <Body>
                    {item.post?<div>职位: {item.post}</div>:null}
                    {item.company?<div>公司: {item.company}</div>:null}
                    {item.salary?<div>月薪: {item.salary}</div>:null}
                    {item.info?<div>描述: {item.info}</div>:null}
                    </Body>
                  </Card>
                </div>
              )
            })
          }
        </QueueAnim>

      </WingBlank>
    )
  }
}

export default withRouter(UserList) 