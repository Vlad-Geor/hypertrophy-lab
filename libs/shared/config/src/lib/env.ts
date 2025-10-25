import { Environment } from './env.model';

export const environment: Environment = {
  production: false,
  apiBase: '',
  cloudinary: {
    cloudName: '',
    uploadPreset: '',
    uploadFolder: '',
  },
  auth: {
    audience: '',
    clientId: '',
    domain: '',
    redirectUri: '',
  },
};
