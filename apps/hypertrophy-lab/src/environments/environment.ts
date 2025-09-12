import { Environment } from '@ikigaidev/config';

export const environment: Environment = {
  production: false,
  apiBase: 'http://localhost:3333/api/v1',
  cloudinary: {
    cloudName: 'dvokg3twy',
    uploadPreset: 'z0PsadmkmKASdSKDSqwkem213Sdmaksm231',
    uploadFolder: 'hl-fitness',
  },
  auth: {
    audience: 'https://api.hypertrophy-lab.dev',
    clientId: 'ShNzibPYxu034WL1xb7yReBUr9R51yJA',
    domain: 'dev-uy7xbj3vls2cy6je.us.auth0.com',
    redirectUri: `${window.location.origin}/auth/callback`,
  },
};
