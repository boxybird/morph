import Alpine from 'alpinejs'
import morph from '@alpinejs/morph'

window.Alpine = Alpine

Alpine.plugin(morph)

Alpine.magic('morph', (e) => (data, callback) => {
  const rootEl = e.closest('[data-morph-component-name]')
  const componentName = rootEl.dataset.morphComponentName

  const payload = {}

  if (typeof data === 'string') {
    payload[data] = data
  } else {
    Object.assign(payload, data)
  }

  const formData = new FormData()

  Object.keys(payload).forEach((key) => {
    let value = payload[key]

    if (value instanceof FileList) {
      Array.from(value).forEach((file) => {
        formData.append(`${key}[]`, file)
      })
    }

    formData.append(key, value)
  })

  fetch(`${MORPH.base_url}${componentName}/`, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'X-Morph-Request': true,
      'X-Morph-Nonce': window.MORPH.nonce,
    },
    body: formData,
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
