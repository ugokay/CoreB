<template>
  <div v-if="!hidden" class="popup-area">
    <div class="popup">
      <div class="close-icon" @click="close">
        <div class="icon-plus"></div>
      </div>
      <div class="input-row">
        <label>Group Name</label>
        <input
          v-model="groupData.name"
          type="text">
      </div>
      <!-- <div class="input-row row no-margin">
        <label>Group(s)</label>
        <label
          class="checkbox-item icon-before no-padding-right col-md-6"
          v-for="group in groups">
            <input
              type="checkbox"
              :value="group.id"
              v-model="groupData.roles" />
            <span class="text">{{group.name}}<i></i></span>
        </label>
      </div> -->
      <div class="input-row">
        <button v-if="isCreate" @click="addNewGroup">Create Group</button>
        <button v-else @click="updateGroup">Update the Group</button>
      </div>
    </div>
  </div>
</template>

<script>
  import { MOCK_USERS_GROUP } from '@/helpers/helpers'

  export default {
    name: 'popup',
    props: {
      group: {
        type: Object,
        default: function () {
          return {
            id: '',
            group_name: ''
          }
        }
      }
    },
    data: function () {
      return {
        hidden: true,
        groupData: this.group,
        isCreate: true,
        groups: MOCK_USERS_GROUP
      }
    },
    methods: {
      close: function () {
        this.hidden = true
      },
      updateGroup: function () {
        // this.$emit('updateGroup', this.groupData)
        // this.close()
      },
      open: function (group) {
        if (group) {
          this.groupData = group
          this.isCreate = false
        } else {
          this.groupData = {
            id: Math.round(Math.random() * 10000),
            full_name: '',
            email: '',
            roles: []
          }
          this.isCreate = true
        }
        this.hidden = false
      },
      addNewGroup () {
        this.$emit('addNewGroup', this.groupData)
        this.close()
      }
    }
  }
</script>

