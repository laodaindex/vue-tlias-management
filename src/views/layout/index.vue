<script setup>
import { ref, onMounted } from 'vue'
import { EditPen, SwitchButton, Moon, Promotion, MessageBox, HomeFilled, UserFilled, Tools, HelpFilled, Avatar, Histogram, InfoFilled, Share, Document } from '@element-plus/icons-vue'
// 修改导入路径
import bgImage from '../../assets/002.png'

// 侧边栏折叠状态
const sidebarCollapsed = ref(false)

// 切换侧边栏折叠状态
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

// 页面加载动画控制
const pageLoaded = ref(false)

// 夜间模式开关
const isNightMode = ref(false)

// 切换夜间模式
const toggleNightMode = () => {
  isNightMode.value = !isNightMode.value
}

onMounted(() => {
  // 模拟页面加载完成
  setTimeout(() => {
    pageLoaded.value = true
  }, 300)
})
</script>

<template>
  <div :class="{ 'commoncommon-layout': true, 'night-mode': isNightMode }">
    <el-container>
      <!-- Header 区域 -->
      <el-header class="header">
        <span class="title">智窗SMART WINDOW </span>
        <span class="right_tool">
          <a href="">
            <el-icon><EditPen /></el-icon> 修改密码 &nbsp;&nbsp;&nbsp; |  &nbsp;&nbsp;&nbsp;
          </a>
          <a href="">
            <el-icon><SwitchButton /></el-icon> 退出登录 &nbsp;&nbsp;&nbsp; |  &nbsp;&nbsp;&nbsp;
          </a>
          <a href="#" @click.prevent="toggleNightMode">
            <el-icon><Moon /></el-icon> {{ isNightMode ? '日间模式' : '夜间模式' }}
          </a>
        </span>
      </el-header>
      
      <el-container>
        <!-- 左侧菜单 -->
        <el-aside width="150px" class="aside">
          <!-- 左侧菜单栏 -->
          <el-menu :router="true">
            <!-- 首页菜单 -->
            <el-menu-item index="/index">
              <el-icon><Promotion /></el-icon> 首页
            </el-menu-item>
            
            <!-- 班级管理菜单 -->
            <el-sub-menu index="/manage">
              <template #title>
                <el-icon><MessageBox /></el-icon> 班级学员管理
              </template>
              <el-menu-item index="/clazz">
                <el-icon><HomeFilled /></el-icon>班级管理
              </el-menu-item>
              <el-menu-item index="/stu">
                <el-icon><UserFilled /></el-icon>学员管理
              </el-menu-item>
            </el-sub-menu>
            
            <!-- 系统信息管理 -->
            <el-sub-menu index="/system">
              <template #title>
                <el-icon><Tools /></el-icon>系统信息管理
              </template>
              <el-menu-item index="/dept">
                <el-icon><HelpFilled /></el-icon>部门管理
              </el-menu-item>
              <el-menu-item index="/emp">
                <el-icon><Avatar /></el-icon>员工管理
              </el-menu-item>
            </el-sub-menu>

            <!-- 数据统计管理 -->
            <el-sub-menu index="/report">
              <template #title>
                <el-icon><Histogram /></el-icon>数据统计管理
              </template>
              <el-menu-item index="/empReport">
                <el-icon><InfoFilled /></el-icon>员工信息统计
              </el-menu-item>
              <el-menu-item index="/stuReport">
                <el-icon><Share /></el-icon>学员信息统计
              </el-menu-item>
              <el-menu-item index="/log">
                <el-icon><Document /></el-icon>日志信息统计
              </el-menu-item>
              <el-menu-item index="/fluid">
                <el-icon><Share /></el-icon>流体卡片展示
              </el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>
        
        <el-main class="main-with-overlay">
          <img :src="bgImage" alt="background" class="bg-image">
          <div class="overlay-content">
            <router-view></router-view>
          </div>
        </el-main>
      </el-container>
      
    </el-container>
  </div>
</template>



<style scoped>
/* 白色背景，浅灰色边框和分隔线 */
.header {
  background-color: rgba(255, 255, 255, 0.85); /* 降低背景不透明度 */
  backdrop-filter: blur(8px); /* 添加模糊效果 */
  -webkit-backdrop-filter: blur(8px); /* 兼容Safari */
  border-bottom: 1px solid rgba(229, 230, 235, 0.6); /* 调整边框透明度 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05); /* 微调阴影 */
}
.title {
  color: #9daed4;
  font-size: 28px;
  font-family:Georgia, 'Times New Roman', Times, serif;
  line-height: 60px;
  font-weight: 700;
  letter-spacing: -0.02em;
  background: linear-gradient(90deg, rgba(164, 177, 177, 0.694) 0%, #00a2ffc5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.title:hover {
  transform: translateY(-20px);
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
}

.right_tool {
  float: right;
  line-height: 60px;
  color: #4e5969;
}

.right_tool a {
  color: #4e5969;
  text-decoration: none;
  transition: color 0.2s;
}

.right_tool a:hover {
  color: #165dff;
}

.aside {
  width: 220px;
  border-right: 1px solid #e5e6eb;
  height: calc(100vh - 60px);
  background-color: #ffffff;
  box-shadow: 1px 0 4px rgba(0, 0, 0, 0.03);
}

/* 优化菜单样式 */
.el-menu {
  border-right: none;
}

.el-menu-item,
.el-sub-menu__title {
  height: 50px;
  line-height: 50px;
  color: #4e5969;
  transition: all 0.2s;
}

.el-menu-item:hover {
  background-color: #f5f7fa;
  color: #165dff;
  transform: translateX(20px);
}

.el-sub-menu__title:hover {
  background-color: #f5f7fa;
}

.el-menu-item.is-active {
  background-color: #f0f2f5;
  color: #165dff;
  border-right: 3px solid #5687fa;
}


/* 右侧内容区域 */
.el-main {
  background: linear-gradient(145deg, #f9fafc, #f4f5f8);
  padding: 20px;
  border-radius: 4px;
  box-shadow: 
    0 8px 30px rgba(0, 0, 0, 0.12),
    0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  height: calc(100vh - 60px); /* 设置高度 */
  overflow: hidden; /* 隐藏溢出内容 */
}
/* 鼠标悬停效果 */
.el-main:hover {
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.15),
    0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-5px);
}

/* 动画效果 */
.fade-transform-enter-active {
  transition: all 0.3s ease-out;
}

.fade-transform-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.fade-transform-enter-from,
.fade-transform-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

.main-with-overlay {
  position: relative;
  padding: 0; /* 移除默认内边距 */
}

.bg-image {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: auto;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease; /* 添加过渡效果 */
}

.el-main:hover .bg-image {
  transform: translate(-50%, -50%) scale(0.9); /* 收缩图片 */
}

.overlay-content {
  position: relative;
  z-index: 1;
  height: 100%;
  padding: 20px; /* 恢复内边距 */
  overflow: hidden; /* 隐藏溢出内容 */
}

/* 夜间模式样式 */
.night-mode .header {
  background-color: rgba(30, 30, 30, 0.85);
  border-bottom: 1px solid rgba(60, 60, 60, 0.6);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.night-mode .title {
  background: linear-gradient(90deg, rgba(100, 100, 100, 0.694) 0%, #005688c5 100%);
}

.night-mode .right_tool a {
  color: #a0a0a0;
}

.night-mode .right_tool a:hover {
  color: #008cff;
}

.night-mode .aside {
  border-right: 1px solid #333;
  background-color: #222;
  box-shadow: 1px 0 4px rgba(0, 0, 0, 0.1);
}

.night-mode .el-menu-item,
.night-mode .el-sub-menu__title {
  color: #a0a0a0;
}

.night-mode .el-menu-item:hover {
  background-color: #333;
  color: #008cff;
}

.night-mode .el-sub-menu__title:hover {
  background-color: #333;
}

.night-mode .el-menu-item.is-active {
  background-color: #444;
  color: #008cff;
  border-right: 3px solid #005688;
}

.night-mode .el-main {
  background: linear-gradient(145deg, #1a1a1a, #222);
  border: 1px solid rgba(60, 60, 60, 0.8);
}
</style>  