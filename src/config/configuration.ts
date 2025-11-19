import "dotenv/config";

export const configuration = {
  apiBaseUrl: process.env.API_BASE_URL,
  appBearerToken: process.env.APP_BEARER_TOKEN,
  googleAuthCallback: process.env.GOOGLE_AUTH_CALLBACK,
  googleAuthCode: process.env.GOOGLE_AUTH_CODE,
};

if (!configuration.appBearerToken) {
  throw new Error(
    "APP_BEARER_TOKEN env variable is required to run API tests."
  );
}
