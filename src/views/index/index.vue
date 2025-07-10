<template>
  <div>
    <!-- 文字画布 -->
    <canvas id="text" width="500" height="100"></canvas>
    <!-- 粒子动画画布 -->
    <canvas id="stage" width="500" height="100"></canvas>
    <!-- 输入表单 -->
    <form id="form" @submit.prevent="handleSubmit">
      <input type="text" id="inputText" v-model="inputValue" />
      <input type="submit" value="Try" />
    </form>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
// 使用EaselJS的完整版而不是createjs-module
import { Stage, Shape, Text } from '@createjs/easeljs'
import { TweenLite, Quad } from 'gsap'

export default {
  setup() {
    // 响应式数据
    const inputValue = ref('HELLO') // 默认文字改为中文
    const stage = ref(null) // 主舞台
    const textStage = ref(null) // 文字舞台
    const circles = ref([]) // 粒子数组
    const textPixels = ref([]) // 文字像素点
    const textFormed = ref(false) // 是否已形成文字
    const offsetX = ref(0) // X偏移
    const offsetY = ref(0) // Y偏移
    const colors = ['#B2949D', '#FFF578', '#FF5F8D', '#37A9CC', '#188EB2'] // 粒子颜色
    const text = ref(null) // 文字对象

    /* 初始化舞台 */
    function initStages() {
      offsetX.value = (window.innerWidth - 600) / 2
      offsetY.value = (window.innerHeight - 300) / 2
      
      // 初始化文字舞台
      textStage.value = new Stage("text")
      textStage.value.canvas.width = 600
      textStage.value.canvas.height = 200

      // 初始化主舞台
      stage.value = new Stage("stage")
      stage.value.canvas.width = window.innerWidth
      stage.value.canvas.height = window.innerHeight
    }

    /* 初始化文字对象 */
    function initText() {
      text.value = new Text("示例", "80px 'Microsoft YaHei'", "#eee") // 使用微软雅黑
      text.value.textAlign = 'center'
      text.value.x = 300
    }

    /* 初始化粒子 */
    function initCircles() {
      circles.value = []
      for(let i = 0; i < 600; i++) {
        const circle = new Shape()
        const r = 7
        const x = window.innerWidth * Math.random()
        const y = window.innerHeight * Math.random()
        const color = colors[Math.floor(i % colors.length)]
        const alpha = 0.2 + Math.random() * 0.5
        
        circle.alpha = alpha
        circle.radius = r
        circle.graphics.beginFill(color).drawCircle(0, 0, r)
        circle.x = x
        circle.y = y
        circles.value.push(circle)
        stage.value.addChild(circle)
        circle.movement = 'float' // 初始状态为漂浮
        tweenCircle(circle)
      }
    }

    /* 粒子动画控制 */
    function tweenCircle(c, dir) {
      if(c.tween) c.tween.kill()
      
      // 进入文字形态的动画
      if(dir === 'in') {
        c.tween = TweenLite.to(c, 0.4, {
          x: c.originX, 
          y: c.originY,
          ease: Quad.easeInOut,
          alpha: 1,
          radius: 5,
          scaleX: 0.4,
          scaleY: 0.4,
          onComplete: () => {
            c.movement = 'jiggle' // 变为微抖动状态
            tweenCircle(c)
          }
        })
      } 
      // 散开动画
      else if(dir === 'out') {
        c.tween = TweenLite.to(c, 0.8, {
          x: window.innerWidth * Math.random(),
          y: window.innerHeight * Math.random(),
          ease: Quad.easeInOut,
          alpha: 0.2 + Math.random() * 0.5,
          scaleX: 1,
          scaleY: 1,
          onComplete: () => {
            c.movement = 'float' // 恢复漂浮状态
            tweenCircle(c)
          }
        })
      } 
      // 默认动画
      else {
        if(c.movement === 'float') {
          // 漂浮动画
          c.tween = TweenLite.to(c, 5 + Math.random() * 3.5, {
            x: c.x + -100 + Math.random() * 200,
            y: c.y + -100 + Math.random() * 200,
            ease: Quad.easeInOut,
            alpha: 0.2 + Math.random() * 0.5,
            onComplete: () => {
              tweenCircle(c)
            }
          })
        } else {
          // 文字形态下的微抖动
          c.tween = TweenLite.to(c, 0.05, {
            x: c.originX + Math.random() * 3,
            y: c.originY + Math.random() * 3,
            ease: Quad.easeInOut,
            onComplete: () => {
              tweenCircle(c)
            }
          })
        }
      }
    }

    /* 形成文字 */
    function formText() {
      for(let i = 0, l = textPixels.value.length; i < l; i++) {
        circles.value[i].originX = offsetX.value + textPixels.value[i].x
        circles.value[i].originY = offsetY.value + textPixels.value[i].y
        tweenCircle(circles.value[i], 'in')
      }
      textFormed.value = true
      
      // 隐藏多余的粒子
      if(textPixels.value.length < circles.value.length) {
        for(let j = textPixels.value.length; j < circles.value.length; j++) {
          circles.value[j].tween = TweenLite.to(circles.value[j], 0.4, { alpha: 0.1 })
        }
      }
    }

    /* 散开粒子 */
    function explode() {
      for(let i = 0, l = textPixels.value.length; i < l; i++) {
        tweenCircle(circles.value[i], 'out')
      }
      
      // 显示所有粒子
      if(textPixels.value.length < circles.value.length) {
        for(let j = textPixels.value.length; j < circles.value.length; j++) {
          circles.value[j].tween = TweenLite.to(circles.value[j], 0.4, { alpha: 1 })
        }
      }
    }

    /* 表单提交处理 */
    function handleSubmit() {
      if(textFormed.value) {
        explode()
        if(inputValue.value !== '') {
          setTimeout(() => {
            createText(inputValue.value)
          }, 810)
        } else {
          textFormed.value = false
        }
      } else {
        createText(inputValue.value)
      }
    }

    /* 创建文字 */
    function createText(t) {
      // 根据文字长度调整字体大小
      const fontSize = 860 / (t.length)
      const finalFontSize = fontSize > 160 ? 160 : fontSize
      
      text.value.text = t
      text.value.font = `900 ${finalFontSize}px 'Microsoft YaHei'` // 使用微软雅黑
      text.value.textAlign = 'center'
      text.value.x = 300
      text.value.y = (172 - finalFontSize) / 2
      textStage.value.addChild(text.value)
      textStage.value.update()

      // 获取文字像素数据
      const ctx = document.getElementById('text').getContext('2d')
      const pix = ctx.getImageData(0, 0, 600, 200).data
      textPixels.value = []
      
      // 采样像素点
      for(let i = pix.length; i >= 0; i -= 4) {
        if(pix[i] !== 0) {
          const x = (i / 4) % 600
          const y = Math.floor(Math.floor(i / 600) / 4)

          // 每8像素采样一个点
          if((x && x % 8 === 0) && (y && y % 8 === 0)) {
            textPixels.value.push({ x, y })
          }
        }
      }

      formText()
    }

    /* 动画循环 */
    function animate() {
      stage.value.update()
      requestAnimationFrame(animate)
    }

    // 组件挂载时初始化
    onMounted(() => {
      initStages()
      initText()
      initCircles()
      animate()
      createText(inputValue.value)
    })

    return {
      inputValue,
      handleSubmit
    }
  }
}
</script>

<style scoped>
/* 样式部分 */
body {
  background: #eee;
}

* {
  position: absolute;
  margin: 0; padding: 0;
}

input[type="text"] {
  border: 1px solid #ddd;
  padding: 6px;
  font-size: 18px;
  width: 200px;
  top: 30px;
  left: 130px;
}

input[type="submit"] {
  display: block;
  width: 100px;
  border: 0;
  line-height: 35px;
  height: 35px;
  color: #fff;
  background: mediumpurple;
  font-size: 18px;
  top: 30px;
  left: 350px;
  cursor: pointer;
  background-color: transparent; /* 设置提交按钮背景为透明 */
  color: mediumpurple; /* 设置提交按钮文字颜色 */
}

form {
  width: 600px;
  height: 100px;
  position: fixed; /* 使用固定定位 */
  right: 20px; /* 距离右侧20px */
  bottom: 20px; /* 距离底部20px */
  background-color: transparent; /* 设置表单背景为透明 */
}
</style>