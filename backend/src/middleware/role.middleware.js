// Hàm này kiểm tra vai trò của người dùng dựa trên JWT đã xác thực
// Middleware này phải được sử dụng sau verifyToken

const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      // Lấy roleName từ req.user (đã được set bởi verifyToken middleware)
      if (!req.user || !req.user.roleName) {
        return res.status(403).json({ 
          message: 'Forbidden: No role assigned',
          success: false 
        });
      }

      const userRole = req.user.roleName;
      
      if (allowedRoles.includes(userRole)) {
        next();
      } else {
        return res.status(403).json({ 
          message: `Forbidden: Insufficient permissions. Required roles: ${allowedRoles.join(', ')}`,
          success: false 
        });
      }
    } catch (error) {
      console.error('Error in checkRole middleware:', error);
      return res.status(500).json({ 
        message: 'Internal server error',
        success: false 
      });
    }
  };
};

export default checkRole;
