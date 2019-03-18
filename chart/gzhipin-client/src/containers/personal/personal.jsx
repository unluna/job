/*用户个人中心路由组件
*/
import React from 'react'
import { Result, List, WhiteSpace, Button } from 'antd-mobile'
import { connect } from 'react-redux'
import { Modal } from 'antd-mobile'
import Cookies from 'js-cookie'
import { resetUser } from '../../redux/actions'

const Item = List.Item
const Brief = Item.Brief

class Personal extends React.Component {

  logOut = () => {
    Modal.alert('退出', '确认退出登录么？', [
      {text: '取消'},
      {
        text: '确定', onPress: () => {
          //干掉cookie里面的userId
          Cookies.remove('userId')
          //干掉redux管理的user
          this.props.resetUser()
        },
      },
    ])
  }

  render () {
    const {username, header, company, post, salary, info} = this.props.user
    return (
      <div  style={{marginTop:50, marginBottom:60}}>
        <Result
          img={<img src={require(`../../assets/images/${header}.png`)}
                    style={{width: 50}}
                    alt="header"/>}
          title={username}
          message={company}
        />
        <List renderHeader={() => '相关信息'}>
          <Item multipleLine={true}>
            {post ? <Brief>职位: {post}</Brief> : null}
            {info ? <Brief>简介: {info}</Brief> : null}
            {salary ? <Brief>薪资: {salary}</Brief> : null}
          </Item>
        </List>
        <WhiteSpace/>
        <List>
          <Button type='warning' onClick={this.logOut}>退出登录</Button>
        </List>
      </div>
    )
  }
}

export default connect(
  state => ({user: state.user}),
  {resetUser},
)(Personal)