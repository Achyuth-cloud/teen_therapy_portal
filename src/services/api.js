const api = {
  get: async (resource) => ({ resource, data: [] }),
  post: async (resource, payload) => ({ resource, payload, success: true })
};

export default api;
