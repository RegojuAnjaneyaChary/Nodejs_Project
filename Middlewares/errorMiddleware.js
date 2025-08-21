function errorHandler(err, req, res, next) {
  console.log(err);
  return res.status(err.statusCode).json({ message: err.message, errors: err.errors });
};
module.exports = { errorHandler };