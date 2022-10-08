import morph from '@alpinejs/morph'

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

    if (typeof data === 'string') {
      payload[data] = data
    } else {
      Object.assign(payload, data)
    }

    const formData = new FormData()

    Object.keys(payload).forEach((key) => {
      let value = payload[key]

      // Handle multiple file uploads
      // Single file uploads are handled by the formData.append(key, value) below
      if (value instanceof FileList) {
        Array.from(value).forEach((file) => {
          formData.append(`${key}[]`, file)
        })
      }

      formData.append(key, value)
    })

    fetch(`${BB_MORPH.base_url}${componentName}/`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'X-Morph-Request': true,
        'X-Morph-Hash': window.BB_MORPH.hash,
      },
      body: formData,
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
      .then((data) => {
        window.Alpine.morph(rootEl, data)

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
