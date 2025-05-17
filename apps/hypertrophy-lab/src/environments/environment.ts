export type Environment = {
  production: boolean;
  API_BASE: string;
};

export const environment: Environment = {
  production: false,
  API_BASE: 'http://localhost:3333/api/v1',
};
