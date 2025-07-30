export type Environment = {
  production: boolean;
  apiBase: string;
  cloudinary: {
    cloudName: string;
    uploadPreset: string;
    uploadFolder: string;
  };
  auth: {
    domain: string;
    clientId: string;
    audience: string;
    redirectUri: string;
  };
};
