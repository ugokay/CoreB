import Vue from 'vue'
import Router from 'vue-router'
import GlobalFilters from '@/containers/GlobalFilters'
import Dashboard from '@/containers/Dashboard'
import ReportDesign from '@/containers/ReportDesign'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/report-design/:id',
      name: 'ReportDesign',
      component: ReportDesign
    },
    {
      path: '/global-filters',
      name: 'GlobalFilters',
      component: GlobalFilters
    }
  ]
  // mode: 'history'
})
