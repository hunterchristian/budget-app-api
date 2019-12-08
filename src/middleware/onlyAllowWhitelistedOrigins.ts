import cors from 'cors';

const onlyAllowWhitelistedOrigins = (allowedOrigins: string[]) =>
  cors({
    origin(origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) {
        callback(null, true);
      }
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          'The CORS policy for this site does not allow access from the specified Origin.';

        callback(new Error(msg), false);
      }

      callback(null, true);
    },
    credentials: true,
  });

export default onlyAllowWhitelistedOrigins;
