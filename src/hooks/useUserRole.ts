import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

interface CustomJwtPayload {
  user_role: string;
}

export const useUserRole = () => {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      try {
        const decoded = jwtDecode<CustomJwtPayload>(token);
        setUserRole(decoded.user_role);
        localStorage.setItem('user_role', decoded.user_role);
      } catch (err) {
        console.error('Lỗi giải mã token:', err);
      }
    }
  }, []);

  return userRole;
};
