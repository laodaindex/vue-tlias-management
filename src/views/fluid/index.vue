<script setup>
import { ref } from 'vue';
import { Star } from '@element-plus/icons-vue';

// 定义卡片数据
const cards = ref([
  {
    title: '特色',
    description: '发现精彩内容',
    date: '刚刚',
    className: 'card-1'
  },
  {
    title: '热门',
    description: '本周趋势',
    date: '2天前',
    className: 'card-2'
  },
  {
    title: '最新',
    description: '最新更新和功能',
    date: '今天',
    className: 'card-3'
  }
]);
</script>

<template>
  <div class="fluid-container">
    <div class="cards-wrapper">
      <div v-for="(card, index) in cards" 
           :key="index" 
           :class="['card', card.className]">
        <div class="card-content">
          <div class="card-header">
            <div class="icon-wrapper">
              <el-icon class="icon"><Star /></el-icon>
            </div>
            <h3 class="title">{{ card.title }}</h3>
          </div>
          <p class="description">{{ card.description }}</p>
          <p class="date">{{ card.date }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fluid-container {
  width: 100%;
  min-height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 100%);
  border-radius: 20px;
}

.cards-wrapper {
  position: relative;
  width: 100%;
  max-width: 1000px;
  height: 400px;
  display: grid;
  place-items: center;
  perspective: 1000px;
}

.card {
  position: absolute;
  width: 350px;
  height: 200px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 20px;
  transform-style: preserve-3d;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--el-color-primary-light-3);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.icon {
  font-size: 20px;
  color: var(--el-color-primary);
}

.title {
  margin: 0;
  font-size: 1.25rem;
  color: var(--el-text-color-primary);
  font-weight: 600;
}

.description {
  margin: 0;
  font-size: 1rem;
  color: var(--el-text-color-regular);
}

.date {
  margin: 0;
  font-size: 0.875rem;
  color: var(--el-text-color-secondary);
}

/* 卡片位置和动画 */
.card-1 {
  transform: translateY(-20px) rotate(-5deg);
  z-index: 3;
}

.card-2 {
  transform: translateX(40px);
  z-index: 2;
}

.card-3 {
  transform: translateX(80px) translateY(20px) rotate(5deg);
  z-index: 1;
}

/* 悬停效果 */
.card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  z-index: 4;
  border-color: var(--el-color-primary-light-5);
}

/* 适配深色模式 */
:root[class='dark'] .card {
  background: rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.1);
}

:root[class='dark'] .icon-wrapper {
  background: var(--el-color-primary-dark-2);
}

:root[class='dark'] .card:hover {
  border-color: var(--el-color-primary-dark-2);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .card {
    width: 280px;
    height: 180px;
  }
  
  .card-2 {
    transform: translateX(20px);
  }
  
  .card-3 {
    transform: translateX(40px) translateY(20px) rotate(5deg);
  }
}
</style> 