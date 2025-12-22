
import {userAccountRepository} from '../repositories/UserAccount/UserAccountRepository.js';

const checkRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const user = await userAccountRepository.findById(req.userId);
      if (!user || !user.role) {
        return res.status(403).json({ message: 'Forbidden: No role assigned' });
      }

      const userRole = user.role.roleName;
      if (allowedRoles.includes(userRole)) {
        next();
      } else {
        res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};

module.exports = checkRole;
