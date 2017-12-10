import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'

Vue.use(Router)
Vue.use(Meta, {
  keyName: 'head',
  attribute: 'data-n-head',
  ssrAttribute: 'data-n-head-ssr',
  tagIDKeyName: 'hid'
})

export function createRouter () {
  return new Router({
    mode: 'history',
    base: '/',
    routes: [
      {
        path: '/',
        component: () => import('layout/default'),
        children: [
          {
            path: '',
            name: 'homepage',
            component: () => import('view/index')
          },
          {
            path: 'bangumi/news',
            component: () => import('view/bangumi/news')
          },
          {
            path: 'bangumi/rank',
            component: () => import('view/bangumi/rank')
          },
          {
            path: 'bangumi/timeline',
            component: () => import('view/bangumi/time')
          },
          {
            name: 'bangumi-tags',
            path: 'bangumi/tags/:id?',
            component: () => import('view/bangumi/tags')
          },
          {
            path: 'bangumi/:id(\\d+)',
            name: 'bangumi-show',
            component: () => import('view/bangumi/show')
          },
          {
            path: 'video/:id(\\d+)',
            component: () => import('view/video/show')
          },
          {
            path: 'user/:slug',
            name: 'user-show',
            component: () => import('view/user/show')
          }
        ]
      }
    ]
  })
}
