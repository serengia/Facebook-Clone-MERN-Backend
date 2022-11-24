function corsOptionsMiddleware(req, res) {
  let corsOptions = {};

  const whiteList = ["http://localhost:3000"];
  const origin = req.header("Origin");

  if (whiteList.includes(origin)) {
    corsOptions = {
      origin: true,
      optionsSuccessStatus: 200,
    };
  } else {
    corsOptions = {
      origin: false,
      optionsSuccessStatus: 200,
    };
  }

  res(null, corsOptions);
}

module.exports = corsOptionsMiddleware;
