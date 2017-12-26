<template>
  <li class="is-list-item">
    <h6>
      <icon name="database"></icon>
      <span class="title"> {{ field.name }} </span>
    </h6>
    <span :class="saved">
      <icon name="check"></icon>
    </span>
    <div class="labels">
      <label class="checkbox-item" @click="handleChecks">
        <input type="checkbox" checked/>
        <span class="text"><i></i></span>
      </label>
      <label class="checkbox-item" @click="handleChecks">
        <input type="checkbox"/>
        <span class="text"><i></i></span>
      </label>
      <label class="checkbox-item" @click="handleChecks">
        <input type="checkbox"/>
        <span class="text"><i></i></span>
      </label>
    </div>
    <div class="details" v-click-outside="hideDropdown">
      <span
        class="openDropdownArea"
        @click="openDropdown">
        <icon name="ellipsis-v"></icon>
      </span>
      <ul :class="isVisible">
        <li><a>Delete</a></li>
      </ul>
    </div>
  </li>
</template>

<script>
  import Icon from 'vue-awesome/components/Icon'
  import { Database, EllipsisV, Check } from 'vue-awesome/icons'
  import ClickOutside from 'vue-click-outside'

  export default {
    name: 'SchemeItem',
    components: {
      Icon
    },
    data() {
      return {
        clickedDropDown: false,
        isSaving: false
      }
    },
    props: {
      field: {
        type: Object,
        required: true
      }
    },
    computed: {
      isVisible: function () {
        return this.clickedDropDown ? 'dropdown-menu open' : 'dropdown-menu'
      },
      saved: function () {
        return this.isSaving ? 'is-saved is-visible' : 'is-saved'
      }
    },
    methods: {
      handleChecks() {
        this.isSaving = true
        setTimeout(() => {
          this.isSaving = false
        }, 1100)
      },
      openDropdown: function () {
        this.clickedDropDown = true
      },
      hideDropdown: function () {
        this.clickedDropDown = false
      }
    },
    directives: {
      ClickOutside
    }
  }
</script>
