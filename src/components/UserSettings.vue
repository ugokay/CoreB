<template>
  <div>
    <div class="nav-tabs-navigation">
    <div class="nav-tabs-wrapper">
      <ul class="nav nav-tabs">
        <li>
          <span class="button-holder title title_center">
            <router-link to="/" class="headToBack">
              <icon name="chevron-left"></icon>
              Back to Dashboard
            </router-link>
          </span>
        </li>
      </ul>
    </div>
  </div>
  <div class="User-settings">
    <div class="user-nav">
      <img src="/static/icons/user-icon.svg" alt="" class="user-icon">
    </div>
    <label class="input-area">
      <span>Username:</span>
      <input type="text" class="settings-input" placeholder="Username">
    </label>
    <label class="input-area">
      <span>Password:</span>
      <input type="password" class="settings-input" placeholder="Password">
    </label>
    <label class="input-area">
      <span>Email:</span>
      <input type="email" class="settings-input" placeholder="Email">
    </label>
    <label class="input-area">
      <span>Slide Period:</span>
      <input type="text" class="settings-input" placeholder="5000ms">
    </label>
    <div class="input-row mt-35">
      <button>UPDATE SETTINGS</button>
    </div>
  </div>
  </div>
</template>

<script>
  import Icon from 'vue-awesome/components/Icon'
  export default {
    name: 'UserSettings',
    components: {
      Icon
    }
  }
</script>
