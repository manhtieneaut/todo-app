// components/HomeContent.tsx
import { Typography, Divider, List } from 'antd';

const { Title, Paragraph, Text } = Typography;

const data = [
  {
    title: 'Ngày 1 - Giới thiệu về Supabase và kiến trúc hệ thống',
    content: [
      <Paragraph>
        <Text strong>Supabase là gì và hoạt động như thế nào:</Text> Supabase là một nền tảng Backend-as-a-Service (BaaS) mã nguồn mở...
      </Paragraph>,
      <Paragraph>
        <Text strong>So sánh Supabase với các nền tảng khác:</Text> So sánh Supabase với các đối thủ cạnh tranh như Firebase, Hasura,...
      </Paragraph>,
      <Paragraph>
        <Text strong>Kiến trúc đa thuê bao (Multi-tenant) trên Supabase Cloud:</Text> Tìm hiểu cách Supabase Cloud hỗ trợ kiến trúc đa thuê bao...
      </Paragraph>,
      <Paragraph>
        <Text strong>Cấu trúc tổ chức dự án: API-first vs DB-first:</Text> Thảo luận về hai phương pháp tiếp cận thiết kế dự án...
      </Paragraph>,
    ],
  },
  {
    title: 'Ngày 2 - Thiết kế cơ sở dữ liệu và tối ưu hóa',
    content: [
      <Paragraph>
        <Text strong>Thiết kế schema: Chuẩn hóa vs phi chuẩn hóa:</Text> Phân tích ưu và nhược điểm...
      </Paragraph>,
      <Paragraph>
        <Text strong>Các loại quan hệ trong cơ sở dữ liệu:</Text> Hiểu rõ các loại quan hệ 1-n và n-n...
      </Paragraph>,
      <Paragraph>
        <Text strong>Tối ưu hóa cơ sở dữ liệu:</Text> Học cách tối ưu hóa index, full-text search...
      </Paragraph>,
      <Paragraph>
        <Text strong>Row-Level Security (RLS) và Policy Design Patterns:</Text> Nắm vững cách thiết lập RLS...
      </Paragraph>,
    ],
  },
  {
    title: 'Ngày 3 - Xác thực người dùng và quản lý quyền truy cập',
    content: [
      <Paragraph>
        <Text strong>Hoạt động của Supabase Auth qua GoTrue:</Text> Tìm hiểu cách Supabase sử dụng GoTrue...
      </Paragraph>,
      <Paragraph>
        <Text strong>Quản lý session và token refresh:</Text> Hiểu cách quản lý phiên làm việc...
      </Paragraph>,
      <Paragraph>
        <Text strong>Các phương thức xác thực:</Text> So sánh email/password, magic link, OAuth...
      </Paragraph>,
      <Paragraph>
        <Text strong>Role-Based Access Control (RBAC):</Text> Cách thiết lập quyền truy cập theo role...
      </Paragraph>,
    ],
  },
  {
    title: 'Ngày 4 - Realtime Subscriptions và Edge Functions',
    content: [
      <Paragraph>
        <Text strong>Hoạt động của `supabase.realtime`:</Text> Tìm hiểu cách cập nhật realtime...
      </Paragraph>,
      <Paragraph>
        <Text strong>So sánh Edge Functions và traditional backend API:</Text> Ưu nhược điểm giữa chúng...
      </Paragraph>,
      <Paragraph>
        <Text strong>Websocket và CRDT considerations:</Text> Hiểu về Websocket và CRDT...
      </Paragraph>,
    ],
  },
  {
    title: 'Ngày 5 - Lưu trữ tệp và quản lý metadata',
    content: [
      <Paragraph>
        <Text strong>Hoạt động của Supabase Storage và cấu trúc Bucket:</Text> Cách Supabase lưu trữ file...
      </Paragraph>,
      <Paragraph>
        <Text strong>Xác thực truy cập tệp:</Text> Dùng signed URL và RLS để bảo vệ file...
      </Paragraph>,
      <Paragraph>
        <Text strong>Quản lý metadata:</Text> Trích xuất EXIF, PDF, OCR từ tệp...
      </Paragraph>,
    ],
  },
  {
    title: 'Ngày 6 - Tích hợp frontend và triển khai CI/CD',
    content: [
      <Paragraph>
        <Text strong>Kết nối Supabase với các framework frontend:</Text> Next.js, React, Vue, Flutter...
      </Paragraph>,
      <Paragraph>
        <Text strong>Quản lý trạng thái ứng dụng:</Text> Dùng React Query, Zustand...
      </Paragraph>,
      <Paragraph>
        <Text strong>Thiết lập CI/CD với GitHub Actions:</Text> Tự động hóa triển khai...
      </Paragraph>,
    ],
  },
];

export default function HomeContent() {
  return (
    <div style={{ padding: '2rem', maxWidth: 1000, margin: 'auto' }}>
      <Typography>
        {data.map((section, idx) => (
          <div key={idx}>
            <Title level={2} style={{ color: '#1677ff' }}>{section.title}</Title>
            <List
              dataSource={section.content}
              renderItem={(item, index) => (
                <List.Item key={index} style={{ paddingLeft: 0 }}>
                  {item}
                </List.Item>
              )}
            />

            <Divider />
          </div>
        ))}
      </Typography>
    </div>
  );
}
