<template>
  <div class="row report--design">
    <div v-if="hidden" class="popup-area">
      <div class="popup">
        <div class="close-icon" @click="closePopup">
          <div class="icon-plus"></div>
        </div>
        <div class="input-row">
          <textarea
            placeholder="Write sth."
            type="text">
          </textarea>
        </div>
        <div class="input-row">
          <button>Test</button>
        </div>
      </div>
    </div>
    <div class="nav-tabs-navigation">
      <div class="nav-tabs-wrapper">
        <ul class="nav nav-tabs pull-left">
          <li>
            <span class="button-holder title title_center">
              <router-link to="/mappers">Back to Mapper List</router-link>
            </span>
          </li>
        </ul>
        <ul class="top-related-actions pull-right" style="position:absolute; top:0; right:0">
          <li>
            <a @click.prevent="save"><i class="icon-export"></i> Save</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="mapperNav">
      <h3>Enabled Mappers</h3>
      <div class="right-section">
        <label class="checkbox-item">
          <input type="checkbox" />
          <span class="text">Enabled <i></i></span>
        </label>
        <label class="checkbox-item">
          <input type="checkbox" checked/>
          <span class="text">Enabled <i></i></span>
        </label>
        <a href="#" @click.prevent="showPopup">Test Result</a>
      </div>
    </div>
    <editor
      lang="html"
      theme="monokai"
      :options="editorOptions">
    </editor>
    <div class="col-xs-12 action--area">
      <span class="action--btn">RUN <i class="icon-arrow-right" style="color:#ffffff"> </i></span>
    </div>
  </div>
</template>

<script>
  import FilterPopup from '@/components/FilterPopup'
  import Editor from 'ace-vue2'
  import 'brace/mode/javascript'
  import 'brace/mode/sql'
  import 'brace/mode/html'
  import 'brace/theme/monokai'

  export default {
    name: 'Mapper',
    components: {
      FilterPopup,
      Editor
    },
    data () {
      return {
        editorOptions: {
          fontSize: '13pt'
        },
        hidden: false
      }
    },
    methods: {
      closePopup () {
        this.hidden = false
      },
      showPopup () {
        this.hidden = true
      }
    }
  }
</script>
