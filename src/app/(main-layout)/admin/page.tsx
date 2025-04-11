'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, Card, Spin, Button } from 'antd';
import { toast } from 'sonner';
import { useUserRole } from '@/hooks/useUserRole';

const { Title } = Typography;

export default function AdminPage() {
  const router = useRouter();
  const userRole = useUserRole();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userRole !== null) {
      if (userRole !== 'admin') {
        router.push('/');
      } else {
        setLoading(false);
        toast.success('Chào mừng admin trở lại 👋');
      }
    }
  }, [userRole, router]);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Spin tip="Đang kiểm tra quyền truy cập...">
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
          </Spin>
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

        <Button
          type="primary"
          onClick={() => toast.success('Đã gửi thông báo test ✅')}
        >
          Gửi thông báo
        </Button>
      </Card>
    </div>
  );
}
