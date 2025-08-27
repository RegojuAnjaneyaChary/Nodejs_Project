function errorHandler(err, req, res, next) {
  console.log("=== Error Handler ===");
  console.log("Error type:", err.constructor.name);
  console.log("Error message:", err.message);
  console.log("Error stack:", err.stack);
  console.log("Error statusCode:", err.statusCode);
  console.log("Error details:", err);

  // Handle validation errors
  if (err.statusCode === 400) {
    return res.status(400).json({
      message: err.message,
      errors: err.errors
    });
  }

  // Handle Multer errors
  if (err.name === 'MulterError') {
    return res.status(400).json({
      message: `File upload error: ${err.message}`
    });
  }

  // Handle Cloudinary errors
  if (err.message && err.message.includes('Cloudinary')) {
    return res.status(500).json({
      message: `Image upload failed: ${err.message}`
    });
  }

  // Handle database errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Invalid token'
    });
  }

  // Handle general server errors
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  return res.status(statusCode).json({
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

module.exports = { errorHandler };