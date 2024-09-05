<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-image-container">
        <img src="@/assets/register-image.jpg" alt="Register Image" width="400px" height="400px" />
      </div>
      <div class="register-card">
        <div class="zhuce">
          <p>用户注册</p>
          <div @click="$router.push('/login')" class="zhanghao">
            <span class="no-account">已有账号</span>，
            <span class="click-register">直接登录</span>
          </div>
        </div>
        <el-form :model="registerForm" ref="registerForm" :rules="rules" label-width="0">
          <el-form-item prop="tel">
            <el-input v-model="registerForm.tel" placeholder="手机号/邮箱" prefix-icon="el-icon-message"></el-input>
          </el-form-item>
          <el-form-item prop="captcha" class="verification-item">
            <el-input v-model="registerForm.captcha" placeholder="验证码" prefix-icon="el-icon-message"></el-input>
            <el-button @click="sendVerificationCode" class="verification-button">获取验证码</el-button>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="registerForm.password" placeholder="设置密码" prefix-icon="el-icon-lock"></el-input>
          </el-form-item>
          <el-form-item prop="confirmPassword">
            <el-input type="password" v-model="registerForm.confirmPassword" placeholder="确认密码" prefix-icon="el-icon-lock"></el-input>
          </el-form-item>
          <el-form-item prop="user_type">
            <el-select v-model="registerForm.user_type" placeholder="选择身份">
              <el-option label="学生" value="student"></el-option>
              <el-option label="教师" value="teacher"></el-option>
              <el-option label="管理员" value="admin"></el-option>
            </el-select>
          </el-form-item>
          <div class="shouce">
            <el-checkbox v-model="registerForm.agree">
              <span class="no-account1">同意并愿意遵守</span>，
              <span class="click-register1">《****服务协议》</span>
            </el-checkbox>
          </div>
          <div class="anniu">
            <el-form-item>
              <el-button type="primary" @click="handleRegister" round>立即注册</el-button>
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
  name: 'TeacherRegister',
  data() {
    return {
      registerForm: {
        tel: '',
        captcha: '',
        password: '',
        confirmPassword: '',
        user_type: '',
        agree: false,
      },
      rules: {
        tel: [{ required: true, message: '请输入手机号或邮箱', trigger: 'blur' }],
        captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        confirmPassword: [{ required: true, message: '请确认密码', trigger: 'blur' }],
        user_type: [{ required: true, message: '请选择身份', trigger: 'change' }],
      },
    };
  },
  methods: {
    sendVerificationCode() {
      this.$message.success('验证码已发送');
    },
    handleRegister() {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          if (this.registerForm.password !== this.registerForm.confirmPassword) {
            this.$message.error('两次输入的密码不一致');
            return;
          }
          axios
            .put('/user/register', {
              tel: this.registerForm.tel,
              password: this.registerForm.password,
              captcha: this.registerForm.captcha,
              user_type: this.registerForm.user_type,
            })
            .then((response) => {
              if (response.data.status === 1) {
                this.$message.success('注册成功');
                localStorage.setItem('auth', true);
                localStorage.setItem('username', this.registerForm.tel);
                this.$router.push('/');
              } else {
                this.$message.error('注册失败，请重试');
              }
            })
            .catch((error) => {
              console.error(error);
              this.$message.error('注册失败，请稍后再试');
            });
        } else {
          this.$message.error('请完善表单信息');
        }
      });
    },
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

@keyframes bg-animation {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes button-animation {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes image-animation {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

@keyframes form-animation {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}

p {
  font-size: 24px;
  margin-top: 10px;
  height: 30px;
  color: rgba(0, 0, 0, 1);
}

.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #e0f7fa;
  background-image: linear-gradient(45deg, #e0f7fa, #b3e5fc);
  animation: bg-animation 10s ease infinite;
}

.register-container {
  display: flex;
  width: 1000px;
  height: auto;
  background-color: #fff;
  border-radius: 30px;
  overflow: hidden;
  animation: swing 1.5s ease-in-out infinite, swing-glow 1.5s ease-in-out infinite;
}

.register-container:hover {
  animation-play-state: paused;
}

.register-image-container {
  flex: 2;
  background-color: #fff8f2;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 30px;
  border-bottom-left-radius: 30px;
  overflow: hidden;
}

.register-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: image-animation 5s ease infinite;
}

.register-card {
  flex: 1;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: form-animation 1s ease forwards;
}

.zhuce {
  display: flex;
  flex-direction: row;
  align-items: right;
  width: 300px;
  height: 50px;
}

.anniu {
  border-radius: 14px;
  width: 250px;
  margin-left: 5px;
  animation: button-animation 2s ease infinite;
}

.anniu:hover {
  animation-play-state: paused;
}

.verification-item {
  display: flex;
  align-items: center;
}

.verification-item .el-input {
  flex: 1;
}

.verification-item .el-button {
  margin-left: 10px;
}

.zhanghao {
  display: flex;
  margin-top: 15px;
  margin-left: 70px;
  height: 30px;
  cursor: pointer;
}

.no-account {
  color: rgba(57, 61, 66, 1);
  font-size: 14px;
  align-items: right;
  height: 30px;
  transition: color 0.3s ease;
}

.no-account:hover {
  color: #ff6347;
}

.click-register {
  height: 30px;
  color: #409eff;
  font-size: 14px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.click-register:hover {
  color: #ff6347;
}

.el-input,
.el-select {
  width: 100%;
  margin-top: -5px;
  transition: all 0.3s ease;
}

.el-input:hover,
.el-select:hover {
  transform: scale(1.02);
}

.el-button {
  width: 100%;
  background-color: #409eff;
  border: none;
  margin-top: 20px;
  margin-left: 0px;
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
  margin-top: -10px;
  margin-bottom: 5px;
  height: 25px;
}

.shouce {
  margin-left: 0px;
  height: 0px;
  margin-top: 0px;
  display: flex;
}

.no-account1 {
  color: rgba(57, 61, 66, 1);
  font-size: 12px;
  align-items: right;
  margin-top: 0px;
  transition: color 0.3s ease;
}

.no-account1:hover {
  color: #ff6347;
}

.click-register1 {
  height: 30px;
  color: #409eff;
  font-size: 12px;
  transition: color 0.3s ease;
}

.click-register1:hover {
  color: #ff6347;
}
</style>
