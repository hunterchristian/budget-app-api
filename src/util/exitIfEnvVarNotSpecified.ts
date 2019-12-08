const exitIfEnvVarNotSpecified = envVar => {
  if (!process.env[envVar]) {
    console.error(`${ envVar } environment variable must be specified`);
    process.exit(1);
  }
};

export default exitIfEnvVarNotSpecified;
