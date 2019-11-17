const getTokenFromRequest = req =>
  req.headers['authorization'] && // Express headers are auto converted to lowercase
  req.headers['authorization'].slice(7, req.headers['authorization'].length); // Remove "Bearer" from token string

  export default getTokenFromRequest;
