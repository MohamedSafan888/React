import api from './api'
export const authService = {
  login:         async (creds)   => { const {data} = await api.post('/auth/login', creds);    return data },
  register:      async (payload) => { const {data} = await api.post('/auth/register', payload); return data },
  getProfile:    async ()        => { const {data} = await api.get('/auth/profile');             return data },
  updateProfile: async (payload) => { const {data} = await api.put('/auth/profile', payload);   return data },
  logout:        async ()        => { try { await api.post('/auth/logout') } catch {} },
}
