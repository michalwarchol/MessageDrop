declare namespace NodeJS {
    export interface ProcessEnv {
      DB_NAME: string;
      DB_URL: string;
      SESSION_SECRET: string;
    }
  }