import { boot } from 'quasar/wrappers'
import L from 'leaflet'
import 'leaflet-draw'

export default boot(({ app }) => {
  app.config.globalProperties.$L = L
})
