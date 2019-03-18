/*
* 选择用户头像的UI组件
* */

import React, { Component } from 'react'
import { List, Grid } from 'antd-mobile'
import PropTypes from 'prop-types'

export default class HeaderSelector extends Component {

  static propTypes = {
    setHeader: PropTypes.func.isRequired,
  }

  state = {
    icon: null,//图片对象，默认没有值
  }

  constructor (props) {
    super(props)
    //需要准备显示的列表数据
    this.headerList = []
    for (let i = 0; i < 20; i++) {
      this.headerList.push({
        text: `头像${i + 1}`,//自己声明的文本 => 就是图片叫啥名
        icon: require(`../../assets/images/头像${i+1}.png`),//引入的图片路径
      })

    }
  }
  //点击的时候会把你数组里 对应的那个对象  返回回来
  handleClick = ({text, icon}) => {
    //更新当前组件状态
    this.setState({icon})
    //调用函数更新父组件状态
    this.props.setHeader(text)
  }

  render () {
    const {icon} = this.state
    const ListHeader = !icon ? '请选择头像：' : (
      <div>
        已选择头像：<img src={icon}/>
      </div>
    )

    return (
      <List renderHeader={() => ListHeader}>
        <Grid data={this.headerList}
              columnNum={5}
              onClick={this.handleClick}/>
      </List>
    )
  }
}
