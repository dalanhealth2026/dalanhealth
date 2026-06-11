import axios from 'axios';
import { useAuth } from '@/store/auth';

// VITE_API_BASE_URL overrides when set at build time; otherwise production
// builds default to the live Railway API and dev builds to localhost. The
// baked-in default exists because Vercel env-var plumbing (e.g. variables
// marked "Sensitive" are hidden from the build step) silently produced
// bundles that fell back to localhost.
const baseURL =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.PROD
    ? 'https://dalanhealth.up.railway.app/api/v1'
    : 'http://localhost:8000/api/v1');

export const api = axios.create({ baseURL, timeout: 15000 });

api.interceptors.request.use((config) => {
  const token = useAuth.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error?.response?.status === 401) {
      useAuth.getState().logout();
    }
    return Promise.reject(error);
  },
);
