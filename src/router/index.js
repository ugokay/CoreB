import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/containers/Dashboard'
import ReportElementDetail from '@/containers/ReportElementDetail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/report-element-detail/:id',
      name: 'ReportElementDetail',
      component: ReportElementDetail
    }
  ]
})
