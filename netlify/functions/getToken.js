exports.handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({ token: process.env.TMDB_TOKEN || "" }),
  };
};
