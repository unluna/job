/*
* 老板信息完善的容器组件
* */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Redirect} from 'react-router-dom'
import { NavBar, InputItem, TextareaItem, Button } from 'antd-mobile'
import HeaderSelector from '../../components/header-selector/header-selector'

import { updateUser } from '../../redux/actions'

class LaoBanInfo extends Component {

  state = {
    header: '',
    post: '',
    info: '',
    company: '',
    salary: '',
  }

  //更新header状态
  setHeader = (header) => {
    this.setState({
      header,
    })
  }

  handleChange = (name, value) => {
    this.setState({
      [name]: value,
    })
  }

  save = () => {
    this.props.updateUser(this.state)
  }

  render () {
    //如果信息已经完善，自动重定向到主界面
    const {header, type} = this.props.user
    if (header) {
      const path = type === 'maNong' ? '/manong' : '/laoban'
      return <Redirect to={path}/>
    } else {
      return (
        <div>
          <NavBar>老板信息完善</NavBar>
          <HeaderSelector setHeader={this.setHeader}/>
          <InputItem placeholder={'请输入招聘职位：'} onChange={val => {
            this.handleChange('post', val)
          }}>职位招聘：</InputItem>
          <InputItem placeholder={'请输入公司名称：'} onChange={val => {
            this.handleChange('company', val)
          }}>公司名称：</InputItem>
          <InputItem placeholder={'请输入职位薪资：'} onChange={val => {
            this.handleChange('salary', val)
          }}>职位薪资：</InputItem>
          <TextareaItem title={'职位要求:'} rows={3} onChange={val => {
            this.handleChange('info', val)
          }}/>
          <Button type={'primary'}
                  onClick={this.save}>保&nbsp;&nbsp;&nbsp;&nbsp;存</Button>
        </div>
      )
    }
  }
}

export default connect(
  state => ({user: state.user}),
  {updateUser},
)(LaoBanInfo)