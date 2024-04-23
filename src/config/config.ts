// TODO: implemement validations for env variables
export default {
  PORT: process.env.PORT,
  JWT: {
    SECRET: process.env.JWT_SECRET,
    EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  },
  CORS_ORIGIN: process.env.CORS_ORIGIN.split(','),
};
