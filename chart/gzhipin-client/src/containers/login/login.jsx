/*
* 登录路由组件
* */

import React, { Component } from 'react'
import {
  NavBar,
  WingBlank,
  List,
  InputItem,
  WhiteSpace,
  Button,
} from 'antd-mobile'

import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { login, register } from '../../redux/actions'

import Logo from '../../components/logo/logo'

const ListItem = List.Item

class Login extends Component {

  state = {
    username: '',
    password: '',
  }

  login = () => {
    this.props.login(this.state)
  }

  //处理输入数据的改变：更新对应的状态
  handleChange = (type, val) => {
    //更新状态
    this.setState({
      [type]: val,//注意 [type]
    })
  }

  toRegister = () => {
    this.props.history.replace('/register')
  }

  render () {
    const {type} = this.state
    const {msg, redirectTo} = this.props.user
    //有只就跑路
    if (redirectTo) {
      return <Redirect to={redirectTo}/>
    }

    return (
      <div>
        <NavBar>大&nbsp;型&nbsp;招&nbsp;聘</NavBar>
        <Logo/>
        <WingBlank>
          <List>
            {msg ? <div className='error-msg'>{msg}</div> : null}
            <WhiteSpace/>
            <InputItem placeholder={'请输入用户名：'} onChange={val => {
              this.handleChange('username', val)
            }}>用户名：</InputItem>
            <WhiteSpace/>
            <InputItem placeholder={'请输入密码：'} type='password' onChange={val => {
              this.handleChange('password', val)
            }}>密&nbsp;&nbsp;&nbsp;码：</InputItem>
            <WhiteSpace/>
            <Button type={'primary'}
                    onClick={this.login}>登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录</Button>
            <WhiteSpace/>
            <Button onClick={this.toRegister}>还没有账户</Button>
          </List>
        </WingBlank>
      </div>
    )
  }
}
export default connect(
  state => ({user: state.user}),
  {login},
)(Login)