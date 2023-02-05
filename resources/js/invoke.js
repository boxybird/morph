import wpMorph from './morph'

export default (componentName, data, hooks = {}) => {
  // Convert dot notation to path.
  componentName = componentName.replace(/\./g, '/')

  const componentsToMorph =
    document.querySelectorAll(`[data-wpmorph-component-name="${componentName}"]`) || null

  if (!componentsToMorph.length === 0) {
    throw new Error(`Component(s) not found: "${componentName}"`)
  }

  componentsToMorph.forEach((component) => {
    wpMorph(component, data, hooks)
  })
}
