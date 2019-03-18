import React, { Component } from 'react'
import { TabBar } from 'antd-mobile'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

const Item = TabBar.Item

//希望在非路由组件中使用路由组件的api？
//    使用路由组件库提供的函数 withRouter()
class NavFooter extends Component {

  static propTypes = {
    navList: PropTypes.array.isRequired,
    unReadCount:PropTypes.number.isRequired
  }

  render () {
    let {navList,unReadCount} = this.props
    //过滤掉hide为true的nav
    navList = navList.filter(item => !item.hide)
    const path = this.props.location.pathname//请求的path
    return (
      <TabBar>
        {
          navList.map((item) => {
            return (
              <Item key={item.path}
                    badge={item.path==='/message'?unReadCount:0}
                    title={item.text}
                    icon={{uri: require(`./images/${item.icon}.png`)}}
                    selectedIcon={{
                      uri: require(`./images/${item.icon}-selected.png`),
                    }}
                    selected={path === item.path}
                    onPress={() => this.props.history.replace(item.path)}
              />
            )
          })
        }
      </TabBar>
    )
  }
}

//向外暴露withRouter()包装后产生的NavFooter
//内部会向组件传入一些路由组件特有的属性：history/location/math
export default withRouter(NavFooter)