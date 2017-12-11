<template>
  <a href="#" class="btn--add is-fixed">
    <i class="icon-plus" />
    Add
  </a>
</template>

<script>
export default {
  name: 'AddButton'
}
</script>}
</script>

<style>
.btn--add {
  display:  inline-block;
  background: #432fc2;
  color:#fff;
  -webkit-box-shadow: 2px 2px 10px 0 rgba(108, 6, 225, 0.4);
   box-shadow: 2px 2px 10px 0 rgba(108, 6, 225, 0.4);
  line-height: 40px;
  font-size: 15px;
  transition: all 300ms;
  z-index: 99999;
  border: 0;
  border-radius: 3px;
  padding: 0 10px;
  min-width: 40px;
  text-align: center;
  padding-right: 0;
  padding-left: 0;
  position: relative;
  z-index: 9999
}
.btn--add i {
  margin-right: 0!important;
}
.btn--add.is-fixed {
  position: fixed;
  right: 30px;
  bottom: 30px;
  border-radius: 100px;
  padding: 0 20px;
}
.btn--add:hover {
  color:#fff;
  -webkit-box-shadow: 0 2px 20px 0 rgba(108, 6, 225, 0.5);
   box-shadow: 0 2px 20px 0 rgba(108, 6, 225, 0.5);
}
.btn--add i {
  font-size: 10px!important;
  margin-right: 5px;
}
</style>
