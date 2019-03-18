/*
* 注册路由组件
* */

import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import Cookies from 'js-cookie' //可以从操作前端cookie的对象 set()/remove()/get()
import { NavBar } from 'antd-mobile'

import LaoBanInfo from '../laoBan-info/laoban-info'
import MaNongInfo from '../maNong-info/maNong-info'
import MaNong from '../maNong/maNong'
import LaoBan from '../laoBan/laoBan'
import Message from '../message/message'
import Personal from '../personal/personal'
import Chat from '../chat/chat'
import NotFound from '../../components/not-found/not-found'

import { getMe } from '../../redux/actions'
import { getRedirectTo } from '../../utils'
import NavFooter from '../../components/nav-footer/nav-footer'

import Logo from '../../components/logo/logo'

class Main extends Component {
  // 组件类和组件对象
  // 给组件对象添加属性
  navList = [//包含所有导航组件的信息数据

    {
      path: '/laoban', // 路由路径
      component: LaoBan,
      title: '码农列表',//顶部的标题
      icon: 'maNong',//底部的图标
      text: '码农',//底部图标上的文字
    },
    {
      path: '/manong', // 路由路径
      component: MaNong,
      title: '老板列表',
      icon: 'laoBan',
      text: '老板',
    },
    {
      path: '/message', // 路由路径
      component: Message,
      title: '消息列表',
      icon: 'message',
      text: '消息',
    },
    {
      path: '/personal', // 路由路径
      component: Personal,
      title: '用户中心',
      icon: 'personal',
      text: '个人',
    },
  ]

  componentDidMount () {
    //如果cookie中有user_id，但redux里面没有user_id,发请求获取对应的user
    const userId = Cookies.get('userId')
    const {_id} = this.props.user
    if (userId && !_id) {
      //发送异步请求获取user信息
      this.props.getMe()
    }
  }

  render () {
    //读取cookie中的user_id
    const userId = Cookies.get('userId')
    //如果没有，自动重定向到登录界面
    if (!userId) {
      return <Redirect to={'/login'}/>
    } else {
      //如果有，再去读取redux中的user状态
      const {user,unReadCount} = this.props
      //如果user没有_id,返回null（不作任何显示）
      if (!user._id) {
        return null
      } else {
        //若果有_id，显示对应的界面
        //根据user的type和header来计算出一个重定向的路由路径，并自动重定向
        let path = this.props.location.pathname
        if (path === '/') {
          //也就是说 => 只有经过了getRedirectTo()这个函数处理过后才能访问下面的else路线
          path = getRedirectTo(user.type, user.header)
          return <Redirect to={path}/>
        } else {

          const {navList} = this
          const currentNav = navList.find(item => item.path === path)//为真的时候返回第一个

          if (currentNav) {
            //决定哪个路由需要隐藏
            if (user.type === 'laoBan') {
              //隐藏数组的第二个
              navList[1].hide = true
            } else {
              //隐藏数组的第一个
              navList[0].hide = true
            }
          }

          return (
            <div>
              {currentNav ? <NavBar
                className={'stick-header'}>{currentNav.title} </NavBar> : null}
              <Switch>
                {
                  navList.map(item => {
                    return (
                      <Route path={item.path} key={item.path}
                             component={item.component}/>
                    )
                  })
                }
                <Route path='/laobaninfo' component={LaoBanInfo}/>
                <Route path='/manonginfo' component={MaNongInfo}/>
                <Route path='/chat/:userid' component={Chat}/>
                <Route component={NotFound}/>
              </Switch>
              {currentNav ? <NavFooter unReadCount={unReadCount}
                                       navList={navList}/> : null}
            </div>
          )
        }
      }
    }
  }
}

export default connect(
  state => ({user: state.user, unReadCount: state.chat.unReadCount}),
  {getMe},
)(Main)

/*
* 实现自动登录
* 一、componentDidMount()
*   1.如果cookie中有user_id，但redux里面没有user_id,发请求获取对应的user，
*     暂时不作任何显示
* 二、render()
*   2.如果cookie没中有user_id，让他登陆 =>自动进入login界面
*   3.判断redux里有没有user_id，
*       - 如果没有，暂时不作任何显示
*       - 如果有，说明已经登录了，则显示对应的界面
*           - 如果请求的是根路径，根据user的type和header来计算出一个重定向的路由路径，并自动重定向
*
* */