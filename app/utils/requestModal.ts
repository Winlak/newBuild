type RequestModalOptions = {
  source?: string
}

export const openRequestModal = (options: RequestModalOptions = {}) => {
  if (!import.meta.client) {
    return
  }

  window.dispatchEvent(new CustomEvent('open-request-modal', {
    detail: options,
  }))
}
