import morph from '@alpinejs/morph'
import { serialize } from 'object-to-formdata'

// BBTODO - refactor this monster when you know if this Morph thing is going to work
document.addEventListener('alpine:init', (Alpine) => {
  window.Alpine.plugin(morph)

  window.Alpine.magic('morph', (e) => (data, hooks = {}) => {
    const rootEl = e.closest('[data-morph-component-name]')
    const componentName = rootEl.dataset.morphComponentName

    // Lifecycle hook
    if (hooks.onStart && typeof hooks.onStart === 'function') {
      hooks.onStart()
    }

    const payload = {}

    // Check if the incoming data is from a 'morph' CustomEvent()
    if (typeof data === 'object' && data?.type === 'morph') {
      Object.assign(payload, data.detail)
    } else {
      // If not, handle data as a string or an object
      if (typeof data === 'string') {
        payload[data] = data
      } else {
        Object.assign(payload, data)
      }
    }

    fetch(`${BB_MORPH.base_url}${componentName}/`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'X-Morph-Request': true,
        'X-Morph-Hash': window.BB_MORPH.hash,
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

        // Emit events
        if (hooks.emit && typeof hooks.emit === 'boolean') {
          const eventPayload = {
            bubbles: true,
            detail: {
              ...payload,
              morphComponent: componentName,
            },
          }

          const morph = new CustomEvent('morph', eventPayload)
          const morphEvent = new CustomEvent('morph:emit', eventPayload)

          document.dispatchEvent(morph)
          document.dispatchEvent(morphEvent)
        }

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
