<template>
  <a href="#" class="btn--add">
    <i class="icon-plus" />
    Add
  </a>
</template>

<script>
export default {
  name: 'AddButton'
}
</script>

<style>
.btn--add {
  display:  inline-block;
  position: fixed;
  right: 30px;
  bottom: 30px;
  background: #432fc2;
  color:#fff;
  -webkit-box-shadow: 2px 2px 10px 0 rgba(108, 6, 225, 0.4);
   box-shadow: 2px 2px 10px 0 rgba(108, 6, 225, 0.4);
  border-radius: 100px;
  line-height: 40px;
  font-size: 15px;
  padding: 0 20px;
  transition: all 300ms;
  z-index: 99999;
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
