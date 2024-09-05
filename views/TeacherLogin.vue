<template>
  <div class="login-container">
    <div class="login-card">
      <div class="image-container">
        <img src="@/assets/login-image.jpg" alt="Login Image" width="380px" height="380px">
      </div>
      <div class="form-container">
        <div class="aaa">
          <p>用户登录</p>
          <div @click="$router.push('/register')" class="zhanghao">
            <span class="no-account">没有账号</span>，<span class="click-register">点击注册</span>
          </div>
        </div>
        <div class="hua"></div>
        <el-form :model="loginForm" ref="loginForm" :rules="rules" label-width="0">
          <el-form-item prop="identifier">
            <el-input v-model="loginForm.identifier" placeholder="手机号/邮箱" prefix-icon="el-icon-user"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="loginForm.password" placeholder="输入密码" prefix-icon="el-icon-lock"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="wangji">
              <div href="#" class="ziti">忘记密码?</div>
            </div>
          </el-form-item>
          <el-form-item>
            <div class="shouce">
              <el-checkbox v-model="loginForm.remember">
                <span class="no-account1">同意并愿意遵守</span>，<span class="click-register1">《****服务协议》</span>
              </el-checkbox>
            </div>
          </el-form-item>
          <div class="anniu">
            <el-form-item>
              <el-button type="primary" @click="handleLogin" round>立即登录</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../api/axios';

export default {
  name: 'TeacherLogin',
  data() {
    return {
      loginForm: {
        identifier: '',
        password: '',
        remember: false,
      },
      rules: {
        identifier: [{ required: true, message: '请输入手机号或邮箱', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      },
    };
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          axios
            .get('/user/login', {
              params: {
                phone_num: this.isEmail(this.loginForm.identifier) ? '' : this.loginForm.identifier,
                email: this.isEmail(this.loginForm.identifier) ? this.loginForm.identifier : '',
                password: this.loginForm.password,
              },
            })
            .then((response) => {
              if (response.data.status === 1) {
                this.$message.success('登录成功');
                localStorage.setItem('auth', true);
                localStorage.setItem('username', response.data.data.username);
                localStorage.setItem('token', response.data.token);
                this.$router.push('/');
              } else {
                this.$message.error('登录失败，请检查用户名或密码');
              }
            })
            .catch((error) => {
              console.error(error);
              this.$message.error('登录失败，请稍后再试');
            });
        } else {
          this.$message.error('请完善表单信息');
        }
      });
    },
    isEmail(identifier) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(identifier);
    }
  },
};
</script>

<style scoped>
@keyframes swing {
  20% { transform: rotate(3deg); }
  40% { transform: rotate(-3deg); }
  60% { transform: rotate(2deg); }
  80% { transform: rotate(-2deg); }
  100% { transform: rotate(0deg); }
}

@keyframes swing-glow {
  0%, 100% { box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
  50% { box-shadow: 0 0 20px rgba(0, 0, 0, 0.2); }
}

.login-card {
  animation: swing 1.5s ease-in-out infinite, swing-glow 1.5s ease-in-out infinite;
}

.login-card:hover {
  animation-play-state: paused;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #e0f7fa;
  background-image: linear-gradient(45deg, #e0f7fa, #b3e5fc);
  animation: bg-animation 10s ease infinite;
}

@keyframes bg-animation {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.no-account1, .click-register1, .no-account, .click-register {
  font-size: 14px;
  transition: color 0.3s ease;
}

.no-account1:hover, .click-register1:hover, .no-account:hover, .click-register:hover {
  color: #ff6347;
}

.el-link {
  display: inline-block;
}

.aaa {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 310px;
  height: 50px;
  margin-left: 20px;
}

.anniu {
  margin-top: 0;
  animation: button-animation 2s ease infinite;
}

@keyframes button-animation {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.shouce {
  margin-left: 80px;
  margin-bottom: 20px;
  margin-top: 0px;
  display: flex;
}

.zhanghao {
  display: flex;
  margin-top: 15px;
  margin-left: 60px;
  height: 30px;
  cursor: pointer;
}

.hua {
  border-top: 108px;
}

.wangji {
  font-size: 12px;
  display: flex;
  color: rgba(24, 144, 255, 1);
  margin-left: 110px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 80px;
  height: 22px;
  left: 100px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.25);
  transition: 0.4s;
  border-radius: 34px;
}

.slider.round {
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input:checked + .slider {
  background-color: #2196f3;
}

input:checked + .slider:before {
  transform: translateX(58px);
}

.inner-label, .inner-label1 {
  font-size: 12px;
  font-weight: 400;
  line-height: 22px;
  color: rgba(255, 255, 255, 1);
  text-align: right;
  vertical-align: top;
  margin: 0 10px;
}

.login-card {
  display: flex;
  width: 800px;
  height: 400px;
  background: white;
  border-radius: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.image-container {
  flex: 2;
  background-color: #fff8f2;
  border-top-left-radius: 30px;
  border-bottom-left-radius: 30px;
  overflow: hidden;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: image-animation 5s ease infinite;
}

@keyframes image-animation {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

.form-container {
  flex: 1;
  padding: 40px 40px;
  animation: form-animation 1s ease forwards;
}

@keyframes form-animation {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}

.el-input {
  width: 90%;
  margin-top: 10px;
  margin-left: 20px;
  transition: all 0.3s ease;
}

.el-input:hover {
  transform: scale(1.02);
}

.el-button {
  width: 100%;
  background-color: #409eff;
  border: none;
  margin-top: -20px;
  transition: background-color 0.3s ease;
}

.el-button:hover {
  background-color: #ff6347;
}

.el-link {
  display: block;
  text-align: center;
  margin-top: 10px;
}

.el-checkbox {
  margin-bottom: 20px;
  display: block;
  text-align: center;
  margin-top: 10px;
  margin-left: -70px;
}
</style>
