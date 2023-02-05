import Alpine from 'alpinejs'
import morph from '@alpinejs/morph'
import wpMorph from './morph'
import wpMorphInvoke from './invoke'

window.Alpine = Alpine

Alpine.plugin(morph)

Alpine.magic('wpMorph', (el) => (data, hooks = {}) => {
  return wpMorph(el, data, hooks)
})

Alpine.magic('wpMorphInvoke', () => (componentName, data, hooks = {}) => {
  return wpMorphInvoke(componentName, data, hooks)
})

Alpine.start()
