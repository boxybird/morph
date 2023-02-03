import morph from '@alpinejs/morph'
import { serialize } from 'object-to-formdata'

document.addEventListener('alpine:init', (Alpine) => {
  window.Alpine.plugin(morph)

  window.Alpine.magic('wpMorph', (e) => (data, hooks = {}) => {
    const rootEl = e.closest('[data-wpmorph-component-hash]')
    const componentHash = rootEl.dataset.wpmorphComponentHash

    const payload = {}

    if (typeof data === 'string') {
      payload[data] = data
    } else {
      Object.assign(payload, data)
    }

    // Lifecycle hook
    if (hooks.onStart && typeof hooks.onStart === 'function') {
      hooks.onStart()
    }

    fetch('/morph/api/v1/morph', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'X-Morph-Request': true,
        'X-Morph-Hash': componentHash,
      },
      body: serialize(payload),
    })
      .then((response) => {
        // Lifecycle hook
        if (hooks.onResponse && typeof hooks.onResponse === 'function') {
          hooks.onResponse(response)
        }

        if (!response.ok) {
          throw new Error(response.statusText)
        }

        return response.text()
      })
      .then((res) => {
        window.Alpine.morph(rootEl, res)

        // Lifecycle hook
        if (hooks.onSuccess && typeof hooks.onSuccess === 'function') {
          hooks.onSuccess(data)
        }
      })
      .catch((error) => {
        // Lifecycle hook
        if (hooks.onError && typeof hooks.onError === 'function') {
          hooks.onError(error)
        }
      })
      .finally(() => {
        // Lifecycle hook
        if (hooks.onFinish && typeof hooks.onFinish === 'function') {
          hooks.onFinish()
        }
      })
  })
})
