'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
  
      if (error || !data.session) {
        router.replace('/login');
      } else {
        setLoading(false);
      }
    };
  
    checkAuth();
  }, [router]); // ✅ thêm router vào đây
  

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <span>Đang xác thực người dùng...</span>
      </div>
    );
  }
  

  return <>{children}</>;
}
