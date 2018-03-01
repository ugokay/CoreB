<template>
  <v-flex class="mt-5 mb-5" xs12 offset-lg2 lg8>
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
            <v-spacer></v-spacer>
            <v-btn class="red" dark small>Delete</v-btn>
            <v-btn class="info" @click="editGroup(index)" dark small>Edit</v-btn>
          </li>
        </ul>
        <ul class="global-filters mt-3">
          <span class="title">Users</span>
          <li
            class="row no-margin is-pointer"
            v-for="(user, index) in users"
            tag="li"
            @click="editUser(index)"
            :key="user.id">
            <span class="name no-padding">{{ user.full_name.split(' ')[0] }}</span>
            <span class="name">{{ user.full_name.split(' ')[1] }}</span>
            <span class="text-muted">{{ user.email }}</span>
            <span class="name">{{ user.id }}</span>
            <v-btn small flat>{{ calculateUserRoles(user.roles) }}</v-btn>
          </li>
        </ul>
      </div>
    </div>
  </v-flex>
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
    addNewUser(user) {
      this.users.push(user)
    },
    addUser() {
      this.$refs.userPopup.open()
    },
    editUser(index) {
      this.$refs.userPopup.open(this.users[index])
    },
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
