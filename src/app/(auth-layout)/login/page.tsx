'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAuthStore } from './store';
import { Form, Input, Button, Typography, message, Card } from 'antd';

const { Title } = Typography;

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);

  const handleAuth = async (values: { email: string; password: string }) => {
    const { email, password } = values;

    const response = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (response.error) {
      message.error('Lỗi: ' + response.error.message);
      return;
    }

    const { user } = response.data;

    if (user) {
      setCurrentUser({ id: user.id, email: user.email! });
      localStorage.setItem('jwt_token', response.data.session?.access_token ?? '');
      message.success(isSignUp ? 'Đăng ký thành công!' : 'Đăng nhập thành công!');
      router.push('/');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to right, #9D50BB, #6E48AA)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card style={{ width: 400, borderRadius: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
          {isSignUp ? 'Đăng ký' : 'Đăng nhập'}
        </Title>

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

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password size="large" placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              {isSignUp ? 'Đăng ký' : 'Đăng nhập'}
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Button type="link" onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
