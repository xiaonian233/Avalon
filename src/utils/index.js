import lodash from './lodash'
import env from '../../.env'

export default {
  install (Vue, options) {
    Vue.prototype.$throttle = lodash.throttle

    Vue.prototype.$orderBy = lodash.orderBy

    Vue.prototype.$groupBy = lodash.groupBy

    Vue.prototype.$cdn = env.cdn

    Vue.prototype.$channel = new Vue()

    Vue.prototype.$resize = (url, options = {}) => {
      if (url === '') {
        return ''
      }
      const link = url.match(/^http/) === null ? `${env.cdn.image}${url}` : url
      const canUseWebP = () => {
        if (Vue.prototype.$isServer) {
          return false
        }
        if (window.supportWebP !== undefined) {
          return window.supportWebP
        }

        const elem = document.createElement('canvas')

        if (elem.getContext && elem.getContext('2d')) {
          const support = elem.toDataURL('image/webp').indexOf('data:image/webp') === 0
          window.supportWebP = support
          return support
        }

        return false
      }

      const format = canUseWebP() ? '/format/webp' : ''

      if (options.width && options.width > 0) {
        const width = `/w/${options.width}`
        const mode = options.mode === undefined ? 1 : options.mode
        const height = options.height ? `/h/${options.height}` : mode === 1 ? `/h/${options.width}` : ''

        return `${link}?imageMogr2/auto-orient/strip|imageView2/${mode}${width}${height}${format}`
      }
      return `${link}?imageMogr2/auto-orient/strip${format}`
    }
  }
}
