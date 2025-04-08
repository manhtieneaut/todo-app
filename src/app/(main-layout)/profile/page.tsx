"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Avatar, Button, Card, Form, Input, message, Spin, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const sanitizeFileName = (fileName: string) => {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

const uploadAvatar = async (file: File) => {
  try {
    const sanitizedFileName = sanitizeFileName(file.name);
    const fileName = `${Date.now()}-${sanitizedFileName}`;

    const { data, error } = await supabase.storage
      .from("profile")
      .upload(fileName, file);

    if (error) {
      console.error("Error uploading avatar:", error.message);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from("profile")
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.error("Unexpected error uploading avatar:", err);
    return null;
  }
};

export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [form] = Form.useForm();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        message.error("Bạn cần đăng nhập!");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching user:", error);
      } else {
        setUserInfo(data);
        form.setFieldsValue({
          full_name: data.full_name,
          phone: data.phone,
          dob: data.dob,
          gender: data.gender,
          bio: data.bio,
        });
      }

      setLoading(false);
    };

    fetchUserInfo();
  }, [form]);

  const handleSave = async () => {
    if (!userInfo) return;

    let avatarUrl = userInfo.avatar_url;

    if (avatarFile) {
      const uploadedUrl = await uploadAvatar(avatarFile);
      if (!uploadedUrl) {
        message.error("Lỗi khi upload avatar. Vui lòng thử lại.");
        return;
      }
      avatarUrl = uploadedUrl;
    }

    const values = form.getFieldsValue();
    const { error } = await supabase
      .from("users")
      .update({ ...values, avatar_url: avatarUrl })
      .eq("id", userInfo.id);

    if (error) {
      message.error("Lỗi khi cập nhật thông tin.");
    } else {
      setUserInfo({ ...userInfo, ...values, avatar_url: avatarUrl });
      setEditMode(false);
      setAvatarFile(null);
      message.success("Cập nhật thông tin thành công!");
    }
  };

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
          <Button type="link" onClick={() => setEditMode(!editMode)}>
            {editMode ? "Huỷ" : "Chỉnh sửa"}
          </Button>
        }
      >
        <div className="flex items-center gap-6 mb-6">
          <Avatar
            size={100}
            src={
              avatarFile
                ? URL.createObjectURL(avatarFile)
                : userInfo.avatar_url || "/default-avatar.png"
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

        {editMode ? (
          <Form form={form} layout="vertical">
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
            <Button type="primary" onClick={handleSave}>
              Lưu thay đổi
            </Button>
          </Form>
        ) : (
          <div className="space-y-4">
            <p>
              <strong>Họ và tên:</strong> {userInfo.full_name || "Chưa cập nhật"}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {userInfo.phone || "Chưa cập nhật"}
            </p>
            <p>
              <strong>Ngày sinh:</strong> {userInfo.dob || "Chưa cập nhật"}
            </p>
            <p>
              <strong>Giới tính:</strong> {userInfo.gender || "Chưa cập nhật"}
            </p>
            <p>
              <strong>Tiểu sử:</strong> {userInfo.bio || "Chưa cập nhật"}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
