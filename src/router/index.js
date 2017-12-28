import Vue from 'vue'
import Router from 'vue-router'

import GlobalFilters from '@/containers/GlobalFilters'
import ReportList from '@/containers/ReportList'
import Dashboard from '@/containers/Dashboard'
import Users from '@/containers/Users'
import ReportDesign from '@/containers/ReportDesign'
import Schemas from '@/containers/Schemas'

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
      path: '/report-list',
      name: 'ReportList',
      component: ReportList
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
    },
    {
      path: '/users',
      name: 'Users',
      component: Users
    },
    {
      path: '/schemas',
      name: 'Schemas',
      component: Schemas
    }
  ]
})
