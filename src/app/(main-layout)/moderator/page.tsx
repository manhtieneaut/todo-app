'use client';

import { Typography } from 'antd';
import { ShieldCheck } from 'lucide-react';

const { Title, Paragraph } = Typography;

export default function ModeratorPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <ShieldCheck size={28} className="text-blue-600" />
        <Title level={2} className="!mb-0">Khu vực Moderator</Title>
      </div>
      <Paragraph>
        Chào mừng bạn đến với trang dành riêng cho <strong>Moderator</strong>. Tại đây bạn có thể quản lý nội dung, kiểm duyệt bình luận hoặc kiểm tra hoạt động của người dùng.
      </Paragraph>

      {/* TODO: Bạn có thể thêm component hoặc bảng dữ liệu ở đây */}
    </div>
  );
}
