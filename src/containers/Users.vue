<template>
  <div class="global-filters">
    <user-popup ref="userPopup" @addNewUser="addNewUser" />
    <group-popup ref="groupPopup" @addNewGroup="addNewGroup"/>
    <div class="btn--add has-multiple is-fixed">
      <a @click.prevent="addUser"><i class="icon-plus" /> Add User</a>
      <a @click.prevent="addGroup">Add Group</a>
    </div>
    <div class="col-sm-12">
      <!-- <h2>Users Group</h2> -->
      <ul class="global-filters">
        <span class="title">User Groups</span>
        <li
          v-for="(user_group, index) in user_groups"
          :key="user_group.id">
          <span class="name">
            {{ user_group.name }} ({{ userCounts(user_group.id) }})
          </span>
          <span class="pull-right">
            <span class="label label-danger">Delete</span>
            <span 
              class="label label-primary is-pointer"
              @click="editGroup(index)">
              Edit
            </span>
          </span>
        </li>
      </ul>
      <ul class="global-filters">
        <span class="title">Users</span>
        <li
          class="row no-margin is-pointer"
          v-for="(user, index) in users"
          tag="li"
          @click="editUser(index)"
          :key="user.id">
          <span class="col-md-2 col-xs-6 name no-padding">{{ user.full_name.split(' ')[0] }}</span>
          <span class="col-md-2 col-xs-6 name">{{ user.full_name.split(' ')[1] }}</span>
          <span class="col-md-4 col-xs-6 text-muted">{{ user.email }}</span>
          <span class="col-md-1 col-xs-6 name">{{ user.id }}</span>
          <span class="col-md-3 col-xs-6 text-right no-padding">{{ calculateUserRoles(user.roles) }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { HTTP } from '@/helpers/http-helper'
import { MOCK_USERS_GROUP, MOCK_USERS } from '@/helpers/helpers'
import UserPopup from '@/components/popups/UserPopup'
import GroupPopup from '@/components/popups/GroupPopup'

export default {
  name: 'Users',
  data() {
    return {
      users: MOCK_USERS,
      user_groups: MOCK_USERS_GROUP
    }
  },
  components: {
    UserPopup,
    GroupPopup
  },
  methods: {
    calculateUserRoles(roles) {
      let rolenames = []
      roles.forEach(role => {
        switch (role) {
          case 1:
            rolenames.push(' Admin')
            break;
          case 2:
            rolenames.push(' Inspector')
            break;
          case 3:
            rolenames.push(' Editor')
            break;
          default:
            rolenames.push(' None')
            break
        }
      })
      return rolenames.toString()
    },
    userCounts(id) {
      let users = []
      const roleItems = this.users.forEach(user => {
        user.roles.includes(id) ? users.push(user) : null
      })
      return users.length + ' User' + (users.length > 1 ? 's' : '')
    },
    // user stuff
    addNewUser(user) {
      this.users.push(user)
    },
    addUser() {
      this.$refs.userPopup.open()
    },
    editUser(index) {
      this.$refs.userPopup.open(this.users[index])
    },
    // group stuff
    addGroup() {
      this.$refs.groupPopup.open()
    },
    editGroup(index) {
      this.$refs.groupPopup.open(this.user_groups[index])
    },
    addNewGroup(group) {
      this.user_groups.push(group)
    }
  }
  
}
</script>
