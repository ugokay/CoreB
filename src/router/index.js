import Vue from 'vue'
import Router from 'vue-router'
import GlobalFilters from '@/containers/GlobalFilters'
import Dashboard from '@/containers/Dashboard'
import ReportDesign from '@/containers/ReportDesign'
import Mappers from '@/containers/Mappers'
import Mapper from '@/components/Mapper'

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
    },
    {
      path: '/mappers',
      name: 'Mappers',
      component: Mappers
    },
    {
      path: '/mapper/:id',
      name: 'Mapper',
      component: Mapper
    }
  ],
  mode: 'history'
})
