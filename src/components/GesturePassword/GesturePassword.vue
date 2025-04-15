<template>
  <view>
    <canvas
      :style="'width: ' + width + 'px; height: ' + height + 'px;display:inline-block'"
      canvas-id="firstCanvas"
      id="firstCanvas"
      @error="canvasIdErrorCallback"
      @touchstart="touchStart"
      @touchmove="touchMove"
      @touchend="touchEnd"
    ></canvas>
  </view>
</template>

<script lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
let context
export default {
  name: 'draw-lock',
  props: {
    width: {
      type: Number,
      default: 300
    },
    height: {
      type: Number,
      default: 300
    },
    background: {
      type: String,
      default: 'rgba(0,0,0,0)'
    },
    lineColor: {
      type: String,
      default: '#3988FF'
    },
    lineBackground: {
      type: String,
      default: '#BED5F8'
    },
    circleWidth: {
      type: Number,
      default: 64
    },
    rowPont: {
      type: Number,
      default: 3
    },
    colPont: {
      type: Number,
      default: 3
    },
    isClosePopup: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      initCircleCoordinate: [],
      selectedCoordinate: [],
      candidateCoordinate: [],
      isActive: false,
      circleR: 0,
      password: ''
    }
  },
  created() {
    // 页面禁止滚动
    wx.setPageStyle({
      style: {
        overflow: 'hidden'
      }
    })
    this.$nextTick(() => {
      this.circleR = (this.width * 28) / 375
      if (this.width > this.height) {
        this.circleR = (this.height * 28) / 375
      }
      context = uni.createCanvasContext('firstCanvas', this)
      this.initCanvas()
    })
  },
  beforeUnmount() {
    // 解开禁用滚动
    wx.setPageStyle({
      style: {
        overflow: 'auto'
      }
    })
  },
  watch: {
    isClosePopup(newVal) {
      if (newVal === true) {
        // 解开禁用滚动

        wx.setPageStyle({
          style: {
            overflow: 'auto'
          }
        })
      } else {
        // 页面禁止滚动

        wx.setPageStyle({
          style: {
            overflow: 'hidden'
          }
        })
      }
    }
  },
  methods: {
    initCanvas() {
      this.initCircleCoordinate = this.getCircleCoordinate()
      this.candidateCoordinate = this.initCircleCoordinate
      this.selectedCoordinate = []
      this.draw()
    },
    touchEnd() {
      if (this.isActive) {
        this.isActive = false
        this.draw() // 这里应该把数据传出去
        // 重制绘图
        this.password = this.getPassword()
        this.initCanvas()
        this.$emit('change', this.password)
      }
    },
    getPassword() {
      return this.selectedCoordinate.map(function (i) {
        return i.key
      })
    },
    updateCanvas(po) {
      this.draw()
      var last = this.selectedCoordinate[this.selectedCoordinate.length - 1]
      context.beginPath()
      context.moveTo(po.x, po.y)
      context.lineTo(last.x, last.y)
      context.closePath()
      context.stroke() // 滑动经过圆点
      for (var i = 0; i < this.candidateCoordinate.length; i++) {
        if (this.collisionDetection(po, this.candidateCoordinate[i])) {
          this.isActive = true
          this.selectedCoordinate.push(this.candidateCoordinate[i])
          this.candidateCoordinate.splice(i, 1)
          break
        }
      }
    },
    touchMove(e) {
      if (this.isActive) {
        var po = this.getPosition(e)
        if (!po) return
        this.updateCanvas(po)
      }
      this.$emit('move', e)
    },
    collisionDetection(a, b) {
      var rX = Math.abs(a.x - b.x)
      var rY = Math.abs(a.y - b.y)

      if (rX * rX + rY * rY < this.circleR * this.circleR) {
        return true
      }

      return false
    },
    getPosition(e) {
      if (e.touches.length < 1) return
      return {
        x: e.touches[0].x,
        y: e.touches[0].y
      }
    },
    draw() {
      this.onDefaultDraw()
    },
    touchStart(e) {
      var po = this.getPosition(e)
      if (!po) return
      for (var i = 0; i < this.candidateCoordinate.length; i++) {
        if (this.collisionDetection(po, this.candidateCoordinate[i])) {
          this.isActive = true
          this.selectedCoordinate.push(this.candidateCoordinate[i])
          this.candidateCoordinate.splice(i, 1)
          this.draw() // 碰撞检测通过需要重绘canvans
          break
        }
      }
      this.$emit('start', e)
    },
    onDefaultDraw() {
      context.clearRect(0, 0, this.width, this.height)
      context.setFillStyle(this.background)
      context.fillRect(0, 0, this.width, this.height)
      context.setLineWidth(1)
      context.setStrokeStyle(this.lineColor)
      context.beginPath()
      for (var i = 0; i < this.initCircleCoordinate.length; i++) {
        context.moveTo(
          this.initCircleCoordinate[i].x + this.circleR,
          this.initCircleCoordinate[i].y
        )
        context.arc(
          this.initCircleCoordinate[i].x,
          this.initCircleCoordinate[i].y,
          this.circleR,
          0,
          Math.PI * 2,
          true
        )
      }
      context.stroke()
      context.closePath()
      context.setStrokeStyle(this.lineColor)
      context.beginPath()

      for (var _i = 0; _i < this.selectedCoordinate.length; _i++) {
        context.lineTo(this.selectedCoordinate[_i].x, this.selectedCoordinate[_i].y)
      }
      context.stroke()
      context.closePath() // 绘制被选中的点的背景 #D9EDFF
      context.setFillStyle(this.lineBackground)
      context.beginPath()

      for (var _i2 = 0; _i2 < this.selectedCoordinate.length; _i2++) {
        context.moveTo(
          this.selectedCoordinate[_i2].x + this.circleR / 2,
          this.selectedCoordinate[_i2].y
        )
        context.arc(
          this.selectedCoordinate[_i2].x,
          this.selectedCoordinate[_i2].y,
          this.circleR,
          0,
          Math.PI * 2,
          true
        )
      }
      context.fill()
      context.closePath() // 绘制被选中的点的中心圆 大小是圆面积的 20/56
      context.setFillStyle(this.lineColor)
      context.beginPath()
      for (var _i3 = 0; _i3 < this.selectedCoordinate.length; _i3++) {
        context.moveTo(
          this.selectedCoordinate[_i3].x + this.circleR / 2,
          this.selectedCoordinate[_i3].y
        )
        context.arc(
          this.selectedCoordinate[_i3].x,
          this.selectedCoordinate[_i3].y,
          (this.circleR * 20) / 56,
          0,
          Math.PI * 2,
          true
        )
      }
      context.fill()
      context.closePath()
      context.draw()
    },
    getCircleCoordinate() {
      var offsetx = (this.width - this.rowPont * this.circleR * 2) / (this.rowPont + 1)
      var offsety = (this.height - this.rowPont * this.circleR * 2) / (this.colPont + 1)
      var circleCoordinate = []

      for (var col = 0; col < this.colPont; col++) {
        for (var row = 0; row < this.rowPont; row++) {
          circleCoordinate.push({
            x: offsetx * (row + 1) + this.circleR * (2 * row + 1),
            y: offsety * (col + 1) + this.circleR * (2 * col + 1),
            key: 3 * col + row + 1
          })
        }
      }
      return circleCoordinate
    },
    canvasIdErrorCallback: function (e) {
      console.error(e.detail.errMsg)
    }
  }
}
</script>

<style></style>
