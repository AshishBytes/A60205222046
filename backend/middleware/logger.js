const logger = (req, res, next) => {
  const log = `${new Date().toISOString()} | ${req.method} ${req.originalUrl}`;
  console.log(log);
  req.customLog = log;
  next();
};

module.exports = logger;
