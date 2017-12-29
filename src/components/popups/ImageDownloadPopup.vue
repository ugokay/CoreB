<template>
  <div v-if="!hidden" class="popup-area">
    <div class="popup">
      <div class="close-icon" @click="close">
        <div class="icon-plus"></div>
      </div>
      <div class="canvas" v-html="canvas"></div>
      <div class="input-row">
        <button >Download Image</button>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'popup',
    data: function () {
      return {
        hidden: true,
        canvas: ''
      }
    },
    methods: {
      close: function () {
        this.hidden = true
      },
      drawCanvas: function (canvasData) {
        this.hidden = false
        // this.canvas = canvasData.outerHTML
        console.log(canvasData)
      }
    }
  }
</script>

