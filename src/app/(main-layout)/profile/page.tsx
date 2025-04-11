'use client';

import { useEffect } from 'react';
import { Avatar, Button, Card, Form, Input, Spin, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useProfileStore } from '@/store/profile';
import { useProfileEffect } from '@/hooks/useProfileEffect';

export default function ProfilePage() {
  const {
    userInfo,
    loading,
    editMode,
    avatarFile,
    setAvatarFile,
    toggleEditMode,
    handleSave,
  } = useProfileStore();

  const [form] = Form.useForm();
  useProfileEffect(form);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card
        title="Thông tin cá nhân"
        extra={
          <Button type="link" onClick={toggleEditMode}>
            {editMode ? 'Huỷ' : 'Chỉnh sửa'}
          </Button>
        }
      >
        <div className="flex items-center gap-6 mb-6">
          <Avatar
            size={100}
            src={
              avatarFile
                ? URL.createObjectURL(avatarFile)
                : userInfo?.avatar_url || '/default-avatar.png'
            }
          />
          {editMode && (
            <Upload
              beforeUpload={(file) => {
                setAvatarFile(file);
                return false;
              }}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Thay đổi avatar</Button>
            </Upload>
          )}
        </div>

        <Form form={form} layout="vertical">
          {editMode ? (
            <>
              <Form.Item name="full_name" label="Họ và tên">
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
              <Form.Item name="phone" label="Số điện thoại">
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
              <Form.Item name="dob" label="Ngày sinh">
                <Input placeholder="Nhập ngày sinh" />
              </Form.Item>
              <Form.Item name="gender" label="Giới tính">
                <Input placeholder="Nhập giới tính" />
              </Form.Item>
              <Form.Item name="bio" label="Tiểu sử">
                <Input.TextArea placeholder="Nhập tiểu sử" rows={4} />
              </Form.Item>
              <Button type="primary" onClick={() => handleSave(form.getFieldsValue())}>
                Lưu thay đổi
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <p><strong>Họ và tên:</strong> {userInfo?.full_name || 'Chưa cập nhật'}</p>
              <p><strong>Số điện thoại:</strong> {userInfo?.phone || 'Chưa cập nhật'}</p>
              <p><strong>Ngày sinh:</strong> {userInfo?.dob || 'Chưa cập nhật'}</p>
              <p><strong>Giới tính:</strong> {userInfo?.gender || 'Chưa cập nhật'}</p>
              <p><strong>Tiểu sử:</strong> {userInfo?.bio || 'Chưa cập nhật'}</p>
            </div>
          )}
        </Form>
      </Card>
    </div>
  );
}
