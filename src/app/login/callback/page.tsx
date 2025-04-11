'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { jwtDecode } from 'jwt-decode';
import { useAuthStore } from '@/store/auth';
import { useProfileStore } from '@/store/profile';
import { getUserInfo } from '@/api/profileApi';
import { toast } from 'sonner';

interface CustomJwtPayload {
  user_role: string;
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);
  const setUserInfo = useProfileStore((state) => state.setUserInfo);
  const setLoading = useProfileStore((state) => state.setLoading);

  useEffect(() => {
    const handleMagicLink = async () => {
      const { data, error } = await supabase.auth.getSession();
  
      if (error || !data.session) {
        toast.error('Đăng nhập thất bại!');
        return;
      }
  
      const { session } = data;
      const user = session.user;
  
      try {
        const jwtToken = session.access_token;
        localStorage.setItem('jwt_token', jwtToken);
  
        const decodedToken = jwtDecode<CustomJwtPayload>(jwtToken);
        const userRole = decodedToken.user_role;
        localStorage.setItem('user_role', userRole);
  
        setCurrentUser({ id: user.id, email: user.email! });
  
        setLoading(true);
        const profile = await getUserInfo();
        setUserInfo(profile);
  
        toast.success('Đăng nhập thành công!');
        router.push('/');
      } catch (e) {
        toast.error('Lỗi xử lý thông tin người dùng!');
      } finally {
        setLoading(false);
      }
    };
  
    handleMagicLink();
  }, [router, setCurrentUser, setUserInfo, setLoading]); // ✅ thêm đầy đủ các hàm
  

  return <p style={{ padding: 24 }}>Đang xử lý đăng nhập...</p>;
}
