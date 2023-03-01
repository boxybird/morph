import { serialize } from 'object-to-formdata'

export default (el, data, hooks = {}) => {
  const rootEl = el.closest('[data-wpmorph-component-hash]')
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
      const keys = []

      window.Alpine.morph(rootEl, res, {
        adding(el) {
          if (
            el.nodeType === 1 &&
            el.hasAttribute('wp-morph-transition') &&
            el.hasAttribute('key')
          ) {
            let key = el.getAttribute('key')

            keys.push(key)

            if (keys[0] === key) {
              const customCssClass = el.getAttribute('wp-morph-transition')

              el.classList.add(customCssClass || 'wp-morph-transition')
            }
          }
        },

        added(el) {
          if (el.nodeType === 1 && el.hasAttribute('wp-morph-transition')) {
            const customInCssClass = el.getAttribute('wp-morph-transition-in')

            setTimeout(() => {
              el.classList.add(customInCssClass || 'wp-morph-transition-in')
            }, 170)
          }
        },
      })

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
}
