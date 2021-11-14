declare namespace NodeJS {
    export interface ProcessEnv {
      DB_NAME: string;
      DB_URL: string;
      SESSION_SECRET: string;
      AWS_BUCKET_NAME: string;
      AWS_ACCESS_KEY_ID: string;
      AWS_SECRET_ACCESS_KEY: string;
      AWS_REGION: string;
      TWILIO_ACCOUNT_SID: string;
      TWILIO_AUTH_TOKEN: string;
      TWILIO_PHONE_NUMBER: string;
    }
  }