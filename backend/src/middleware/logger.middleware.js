// Middleware để log các request
export function requestLogger(req, res, next) {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl || req.url;
  const ip = req.ip || req.connection.remoteAddress;

  console.log(`\n[${timestamp}] 📥 ${method} ${url}`);
  console.log(`IP: ${ip}`);

  // Log request body nếu có (trừ password)
  if (req.body && Object.keys(req.body).length > 0) {
    const sanitizedBody = { ...req.body };
    if (sanitizedBody.password) sanitizedBody.password = "***";
    console.log("Body:", JSON.stringify(sanitizedBody, null, 2));
  }

  // Log query params nếu có
  if (req.query && Object.keys(req.query).length > 0) {
    console.log("Query:", JSON.stringify(req.query, null, 2));
  }

  // Intercept response để log kết quả
  const start = Date.now();
  const originalJson = res.json;

  res.json = function (data) {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;

    // Xác định trạng thái
    const isSuccess = statusCode >= 200 && statusCode < 300;
    const statusIcon = isSuccess ? "✅" : "❌";

    console.log(`\n[${timestamp}] ${statusIcon} ${method} ${url}`);
    console.log(`Status: ${statusCode} ${getStatusText(statusCode)}`);
    console.log(`Duration: ${duration}ms`);
    console.log("─".repeat(80));

    return originalJson.call(this, data);
  };

  next();
}

// Helper function để lấy text mô tả status code
function getStatusText(statusCode) {
  const statusTexts = {
    200: "OK",
    201: "Created",
    204: "No Content",
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    500: "Internal Server Error",
    502: "Bad Gateway",
    503: "Service Unavailable",
  };
  return statusTexts[statusCode] || "";
}
