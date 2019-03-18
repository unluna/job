/*
*能发送ajax请求的函数模块
* 函数返回的是promise对象
* */
import axios from 'axios'

export default function (url, data = {}, type = 'GET') {
  if (type === 'GET') {
    //data:{username:Tom,password:123456}
    //paramStr:username=Tom&password=123456
    let paramStr = ''
    Object.keys(data).forEach(key => {//keys 的 array
      paramStr += key + '=' + data[key] + '&'
    })
    if (paramStr) {
      paramStr = paramStr.substring(0, paramStr.length - 1)
    }
    //使用axios发送get请求
    return axios.get(url + '?' + paramStr)
  } else {
    //使用axios发送post请求
    return axios.post(url, data)
  }
}

