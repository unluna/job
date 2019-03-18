/*
* 注册路由组件
* */

import React, { Component } from 'react'
import {
  NavBar,
  WingBlank,
  List,
  InputItem,
  WhiteSpace,
  Radio,
  Button,
} from 'antd-mobile'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { register } from '../../redux/actions'
import Logo from '../../components/logo/logo'

const ListItem = List.Item

class Register extends Component {

  state = {
    username: '',
    password: '',
    repeatPassword: '',
    type: 'maNong',//码农，老板
  }
  //点击注册调用
  register = () => {
    this.props.register(this.state)
  }
  //处理输入数据的改变：更新对应的状态
  handleChange = (type, val) => {
    //更新状态
    this.setState({
      [type]: val,//注意 [type]
    })
  }

  toLogin = () => {
    this.props.history.replace('/login')
  }

  render () {
    const {type} = this.state
    const {msg, redirectTo} = this.props.user
    //有只就跑路
    if (redirectTo) {
      return <Redirect to={redirectTo}/>
    } else {
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
              <InputItem placeholder={'请输入密码：'} type='password'
                         onChange={val => {
                           this.handleChange('password', val)
                         }}>密&nbsp;&nbsp;&nbsp;码：</InputItem>
              <WhiteSpace/>
              <InputItem placeholder={'请输入确认密码：'} type='password'
                         onChange={val => {
                           this.handleChange('repeatPassword', val)
                         }}>确认密码：</InputItem>
              <WhiteSpace/>
              <ListItem>
                <span>用户类型：</span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Radio checked={type === 'maNong'}
                       onChange={() => this.handleChange('type',
                         'maNong')}>&nbsp;码农</Radio>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Radio checked={type === 'laoBan'}
                       onChange={() => this.handleChange('type',
                         'laoBan')}>&nbsp;老板</Radio>
              </ListItem>
              <WhiteSpace/>
              <Button type={'primary'}
                      onClick={this.register}>注&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;册</Button>
              <WhiteSpace/>
              <Button onClick={this.toLogin}>已有账户</Button>
            </List>
          </WingBlank>
        </div>
      )
    }
  }
}

export default connect(
  state => ({user: state.user}),
  {register},
)(Register)