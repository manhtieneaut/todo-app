'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAuthStore } from '../../store/auth';
import { useProfileStore } from '../../store/profile';
import { getUserInfo } from '../../api/profileApi';
import { Form, Input, Button, Typography, message, Card, Segmented } from 'antd';
import { jwtDecode } from 'jwt-decode';
import { useUserRole } from '@/hooks/useUserRole';

interface CustomJwtPayload {
  user_role: string;
}

const { Title } = Typography;

export default function AuthPage() {
  const [authMethod, setAuthMethod] = useState<'password' | 'magic'>('password');
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);
  const setUserInfo = useProfileStore((state) => state.setUserInfo);
  const setLoading = useProfileStore((state) => state.setLoading);

  useUserRole(); // Nếu cần hook để theo dõi user_role

  const handleAuth = async (values: { email: string; password?: string }) => {
    const { email, password } = values;

    if (authMethod === 'magic') {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/login/callback`, // URL callback sau khi người dùng nhấn vào magic link
        },
      });

      if (error) {
        message.error('Lỗi gửi magic link: ' + error.message);
        return;
      }

      message.success('Đã gửi magic link đến email của bạn!');
      return;
    }

    // Đăng nhập / đăng ký bằng email + password
    const response = isSignUp
      ? await supabase.auth.signUp({ email, password: password! })
      : await supabase.auth.signInWithPassword({ email, password: password! });

    if (response.error) {
      message.error('Lỗi: ' + response.error.message);
      return;
    }

    const { user, session } = response.data;

    if (user && session) {
      setCurrentUser({ id: user.id, email: user.email! });

      const jwtToken = session.access_token;
      localStorage.setItem('jwt_token', jwtToken);

      try {
        const decodedToken = jwtDecode<CustomJwtPayload>(jwtToken);
        const userRole = decodedToken.user_role;
        console.log('User Role:', userRole);
        localStorage.setItem('user_role', userRole);
        setLoading(true);
        const profile = await getUserInfo();
        setUserInfo(profile);
      } catch (err) {
        message.error('Lỗi giải mã token hoặc lấy thông tin người dùng');
      } finally {
        setLoading(false);
      }

      message.success(isSignUp ? 'Đăng ký thành công!' : 'Đăng nhập thành công!');
      router.push('/');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to right, #9D50BB, #6E48AA)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Card style={{
        width: 400,
        borderRadius: 16,
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
      }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 16 }}>
          {isSignUp ? 'Đăng ký' : 'Đăng nhập'}
        </Title>

        <Segmented
          block
          options={[
            { label: 'Email + Mật khẩu', value: 'password' },
            { label: 'Magic Link', value: 'magic' }
          ]}
          value={authMethod}
          onChange={(val) => setAuthMethod(val as 'password' | 'magic')}
          style={{ marginBottom: 24 }}
        />

        <Form layout="vertical" onFinish={handleAuth}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input size="large" placeholder="Nhập email" />
          </Form.Item>

          {authMethod === 'password' && (
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password size="large" placeholder="Nhập mật khẩu" />
            </Form.Item>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              {authMethod === 'magic'
                ? 'Gửi Magic Link'
                : isSignUp
                ? 'Đăng ký'
                : 'Đăng nhập'}
            </Button>
          </Form.Item>
        </Form>

        {authMethod === 'password' && (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Button type="link" onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký'}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
