<template>
  <div>{{element.title}}</div>
</template>
<script>
  export default{
    name: 'report-element',
    props: {
      element: {
        type: Object
      }
    },
    data: function () {
      return {
        queryResult: {
          schema: [],
          data: []
        }
      }
    },
    created: function () {
      // Execute report element
    }
  }
</script>
<style></style>
