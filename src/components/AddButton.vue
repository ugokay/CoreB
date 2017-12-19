<template>
  <a @click.prevent="click" href="#" class="btn--add is-fixed">
    <i class="icon-plus" />
    Add
  </a>
</template>

<script>
export default {
  name: 'AddButton',
  methods: {
    click: function () {
      this.$emit('click')
    }
  }
}
</script>
