<template>
  <aside class="navbar navbar-bundle col-xs-12 col-md-2 col-lg-2">
    <div class="row">
      <div class="nav-head flex flex-space-between flex-middle">
        <a class="logo" href="/">
          <img src="assets/logo.svg" alt="Corebi Logo">
        </a>
        <a class="btn-menu" href="javascript:void(0);">
          <i  class="icon-hamburger"></i>
        </a>
      </div>
      <div>
        <ul>
          <li><a href="#/">Home</a></li>
          <li><a href="#/report-element-detail/29">REP</a></li>
        </ul>
      </div>
      <div class="admin-settings">
        <i class="icon-settings"></i>
        <span class="text-holder">
            Admin </span>
        <button class="menu-toggler pull-right"><i class="icon-tri-left"></i> </button>
      </div>
    </div>
  </aside>
</template>
<script>
export default{
  name: 'navigation',
  data: function () {
    return {}
  }
}
</script>
<style>

</style>
