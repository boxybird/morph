import morph from '@alpinejs/morph'
import wpMorph from './morph'
import wpMorphInvoke from './invoke'

document.addEventListener('alpine:init', () => {
  Alpine.plugin(morph)

  window.Alpine.magic('wpMorph', (el) => (data, hooks = {}) => {
    return wpMorph(el, data, hooks)
  })

  window.Alpine.magic('wpMorphInvoke', () => (componentName, data, hooks = {}) => {
    return wpMorphInvoke(componentName, data, hooks)
  })
})
