<script setup>
// 引入Vue的响应式API
import { ref } from 'vue'
// 引入登录API接口
import { loginApi } from '@/api/login'
// 引入Element Plus的消息提示组件
import { ElMessage } from 'element-plus'
// 引入Vue Router
import { useRouter } from 'vue-router'

// 获取路由实例
const router = useRouter()
// 创建响应式登录表单对象
let loginForm = ref({ username: '', password: '' })

/**
 * 登录方法
 * 1. 调用登录API
 * 2. 处理登录结果
 * 3. 成功时存储token并跳转页面
 * 4. 失败时显示错误消息
 */
const login = async () => {
  try {
    const result = await loginApi(loginForm.value)
    console.log('登录API响应:', result)
    
    if (result.code === 1) {
      // 1.提示登录成功
      ElMessage.success('登录成功')
      //2.存储单签员工信息
      localStorage.setItem('loginUser', JSON.stringify(result.data))
      // 3. 跳转页面
      router.push('/index')
    } else {
      ElMessage.error(result.msg || '登录失败，未知错误')
    }
  } catch (error) {
    console.error('登录请求出错:', error)
    ElMessage.error('登录请求出错，请检查网络或稍后重试')
  }
}

/**
 * 清空表单方法
 * 重置用户名和密码字段
 */
const clear = () => {
  loginForm.value.username = ''
  loginForm.value.password = ''
}
</script>

<template>
  <!-- 登录容器 - 居中显示 -->
  <div class="login-container">
    <!-- 登录表单 -->
    <form class="form">
      <!-- 标题 -->
      <p class="title">Login</p>
      
      <!-- 描述信息 -->
      <p class="message">Sign in to your account to continue</p>
      
      <!-- 用户名输入组 -->
      <label>
        <input 
          v-model="loginForm.username" 
          required 
          type="text" 
          class="input"
          placeholder=""
        >
        <span>Username</span>
      </label>

      <!-- 密码输入组 -->
      <label>
        <input 
          v-model="loginForm.password" 
          required 
          type="password" 
          class="input"
          placeholder=""
        >
        <span>Password</span>
      </label>

      <!-- 操作按钮组 -->
      <button type="button" class="submit" @click="login">Login</button>
      
      <!-- 注册链接 -->
      <p class="signup">Don't have an account? <a href="#">Sign up</a></p>
    </form>
  </div>
</template>

<style scoped>
/* 防止页面滚动 */
html, body {
  height: 100%;
  overflow: hidden;
}

/* 登录容器样式 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
  padding: 20px;
}

/* 表单容器样式 */
.form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 350px;
  background-color: #fff;
  padding: 25px;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

/* 标题样式 */
.title {
  font-size: 28px;
  color: royalblue;
  font-weight: 600;
  letter-spacing: -1px;
  position: relative;
  display: flex;
  align-items: center;
  padding-left: 30px;
  margin-bottom: 5px;
}

.title::before, .title::after {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  border-radius: 50%;
  left: 0px;
  background-color: royalblue;
}

.title::before {
  width: 18px;
  height: 18px;
}

.title::after {
  width: 18px;
  height: 18px;
  animation: pulse 1s linear infinite;
}

/* 描述信息样式 */
.message {
  color: rgba(88, 87, 87, 0.822);
  font-size: 14px;
  margin-bottom: 15px;
}

/* 输入框样式 */
.form label {
  position: relative;
}

.form label .input {
  width: 100%;
  padding: 10px 10px 20px 10px;
  outline: 0;
  border: 1px solid rgba(105, 105, 105, 0.397);
  border-radius: 10px;
  box-sizing: border-box;
}

.form label .input + span {
  position: absolute;
  left: 10px;
  top: 15px;
  color: grey;
  font-size: 0.9em;
  cursor: text;
  transition: 0.3s ease;
}

.form label .input:placeholder-shown + span {
  top: 15px;
  font-size: 0.9em;
}

.form label .input:focus + span,
.form label .input:not(:placeholder-shown) + span {
  top: 30px;
  font-size: 0.7em;
  font-weight: 600;
}

.form label .input:not(:placeholder-shown) + span {
  color: royalblue;
}

.form label .input:focus {
  border-color: royalblue;
  box-shadow: 0 0 0 2px rgba(65, 105, 225, 0.2);
}

/* 提交按钮样式 */
.submit {
  border: none;
  outline: none;
  background-color: royalblue;
  padding: 12px;
  border-radius: 10px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 10px;
}

.submit:hover {
  background-color: rgb(56, 90, 194);
}

/* 注册链接样式 */
.signup {
  color: rgba(88, 87, 87, 0.822);
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
}

.signup a {
  color: royalblue;
  text-decoration: none;
}

.signup a:hover {
  text-decoration: underline;
}

/* 脉冲动画 */
@keyframes pulse {
  from {
    transform: scale(0.9);
    opacity: 1;
  }
  to {
    transform: scale(1.8);
    opacity: 0;
  }
}
</style>    