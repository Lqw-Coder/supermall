import axios from 'axios'

export function request(config) {
  //1 创建axios实例
  const instance = axios.create({
    baseURL: 'http://123.207.32.32:8000/api/h8',
    timeout: 5000
  })
  //2 使用axios的拦截器
  instance.interceptors.request.use(config => {
    return config
  }, err => {
  })
  instance.interceptors.response.use(res => {
    return res.data
  }, err => {
    console.log(err)
  })
  //3 发送真正的请求
  return instance(config)
}