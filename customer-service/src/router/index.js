import Vue from 'vue'
import Router from 'vue-router'
import CustomerService from '@/components/CustomerService'
import common_chat from '@/components/common/common_chat'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'CustomerService',
      component: CustomerService
    },
    {
      path: '/',
      name: 'common_chat',
      component: common_chat
    },
  ]
})
