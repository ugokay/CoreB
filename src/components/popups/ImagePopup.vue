<template>
  <div v-if="!hidden" class="popup-area is-flexible">
    <div class="popup">
      <div class="close-icon" @click="close">
        <div class="icon-plus"></div>
      </div>
      <div class="input-row">
        <label>Name This File</label>
        <input
          v-model="fileName"
          type="text">
      </div>
      <div class="input-row">
        <label>Your Image</label>
        <div class="download-img">
          <img ref="image" :src="canvas">
        </div>
      </div>
      <div class="input-row">
        <button @click="downloadImage">Download Image</button>
      </div>
    </div>
  </div>  
</template>

<script>
  import downloadjs from 'downloadjs'

  export default {
    name: 'ImagePopup',
    data() {
      return {
        hidden: true,
        fileName: 'untitled'
      }
    },
    methods: {
      downloadImage: function () {
        const imageDataset = this.$refs.image.currentSrc
        downloadjs(imageDataset, this.fileName + '.png', 'image/png')
        this.close()
      },
      close: function () {
        this.hidden = true
      },
      open: function (canvas) {
        this.canvas = canvas
        this.hidden = false
      }
    }
  }
</script>
