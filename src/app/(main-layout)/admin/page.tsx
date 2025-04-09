'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, Card, Spin, Result } from 'antd';
import { useUserRole } from '@/hooks/useUserRole'; // hook đã tạo trước đó

const { Title } = Typography;

export default function AdminPage() {
  const router = useRouter();
  const userRole = useUserRole();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userRole !== null) {
      if (userRole !== 'admin') {
        router.push('/'); // không phải admin thì redirect về trang chủ
      } else {
        setLoading(false); // đúng admin thì load nội dung
      }
    }
  }, [userRole, router]);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin tip="Đang kiểm tra quyền truy cập..." />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f0f2f5',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Card style={{ width: 600, borderRadius: 12 }}>
        <Title level={2}>🎩 Trang quản trị</Title>
        <p>Chào mừng admin! Bạn có thể quản lý dữ liệu tại đây.</p>
        {/* Thêm nội dung admin ở đây, ví dụ: quản lý người dùng, nhóm chat, tin nhắn, v.v. */}
      </Card>
    </div>
  );
}
