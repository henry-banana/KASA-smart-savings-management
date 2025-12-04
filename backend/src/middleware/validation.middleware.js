// Middleware kiểm tra các số phải lớn hơn 0
export function validatePositiveNumbers(req, res, next) {
  try {
    const { minimumDepositAmount, minimumTermDays } = req.body;

    // Kiểm tra minimumDepositAmount
    if (minimumDepositAmount !== undefined) {
      const depositAmount = Number(minimumDepositAmount);
      if (isNaN(depositAmount) || depositAmount <= 0) {
        return res.status(400).json({
          message:
            "minimumDepositAmount must be a positive number greater than 0",
          success: false,
        });
      }
    }

    // Kiểm tra minimumTermDays
    if (minimumTermDays !== undefined) {
      const termDays = Number(minimumTermDays);
      if (isNaN(termDays) || termDays <= 0) {
        return res.status(400).json({
          message: "minimumTermDays must be a positive number greater than 0",
          success: false,
        });
      }
    }

    next();
  } catch (error) {
    console.error("❌ Error in validation middleware:", error);
    return res.status(400).json({
      message: "Invalid input data",
      success: false,
    });
  }
}
