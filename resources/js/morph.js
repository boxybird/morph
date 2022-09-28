import Alpine from 'alpinejs'
import morph from '@alpinejs/morph'

window.Alpine = Alpine

Alpine.plugin(morph)

Alpine.magic('morph', (e) => (data, callback) => {
  const rootEl = e.closest('[data-component-name]')
  const componentName = rootEl.dataset.componentName

  const payload = {}

  if (typeof data === 'string') {
    payload[data] = data
  } else {
    Object.assign(payload, data)
  }

  fetch(`${MORPH.base_url}${componentName}/`, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'X-Morph-Request': true,
    },
    body: new URLSearchParams({
      ...payload,
      nonce: window.MORPH.nonce,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText)
      }

      return response.text()
    })
    .then((data) => {
      Alpine.morph(rootEl, data)

      callback &&
        callback({
          data,
          success: true,
        })
    })
    .catch((error) => {
      callback &&
        callback({
          error,
          success: false,
        })
    })
})

Alpine.start()