<template>
  <div v-if="!hidden" class="popup-area">
    <div class="popup">
      <div class="close-icon" @click="close">
        <div class="icon-plus"></div>
      </div>
      <div class="input-row">
        <label>Email</label>
        <input
          type="text">
      </div>
      <div class="input-row row no-margin">
        <label
          class="checkbox-item icon-before no-padding-right col-md-6">
            <!-- <input
              type="checkbox"
              :value="group.id"
              v-model="userData.roles" /> -->
            <span class="text">Title<i></i></span>
        </label>
      </div>
      <div class="input-row">
        <button v-if="isCreate">Create Scheme</button>
        <button v-else @click="updateFilter">Update</button>
      </div>
    </div>
  </div>
</template>

<script>
  import { MOCK_USERS_GROUP } from '@/helpers/helpers'

  export default {
    name: 'popup',
    props: {
      user: {
        type: Object,
        default: function () {
          return {
            id: '',
            full_name: '',
            email: '',
            roles: []
          }
        }
      }
    },
    data: function () {
      return {
        hidden: true,
        isCreate: true,
      }
    },
    methods: {
      close: function () {
        this.hidden = true
      },
      updateFilter: function () {
        // this.$emit('updateFilter', this.userData)
        // this.close()
      },
      open: function (user) {
        if (user) {
          this.userData = user
          this.isCreate = false
        } else {
          this.userData = {
            id: Math.round(Math.random() * 10000),
            full_name: '',
            email: '',
            roles: []
          }
          this.isCreate = true
        }
        this.hidden = false
      }
    }
  }
</script>

