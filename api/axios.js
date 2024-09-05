import axios from 'axios';

const instance = axios.create({

  baseURL: 'http://10.60.60.179:8080/', // 后端服务器地址
  timeout: 1000, // 请求超时时间


  headers: {'Content-Type': 'application/json'}
});

export default instance;
