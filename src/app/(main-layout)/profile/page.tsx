"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

// Hàm chuẩn hóa tên file
const sanitizeFileName = (fileName: string) => {
  return fileName
    .normalize("NFD") // Chuẩn hóa Unicode để loại bỏ dấu
    .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu tiếng Việt
    .toLowerCase() // Chuyển tất cả ký tự thành chữ thường
    .replace(/[^a-z0-9.-]/g, "-") // Thay thế ký tự không hợp lệ bằng dấu gạch ngang
    .replace(/-+/g, "-") // Loại bỏ dấu gạch ngang thừa
    .replace(/^-|-$/g, ""); // Loại bỏ dấu gạch ngang ở đầu và cuối
};

// Hàm upload avatar
const uploadAvatar = async (file: File) => {
  try {
    const sanitizedFileName = sanitizeFileName(file.name); // Chuẩn hóa tên file
    const fileName = `${Date.now()}-${sanitizedFileName}`; // Tạo tên file duy nhất

    const { data, error } = await supabase.storage
      .from("profile") // Tên bucket
      .upload(fileName, file);

    if (error) {
      console.error("Lỗi khi upload avatar:", error.message);
      return null;
    }

    // Lấy URL công khai của file
    const { data: publicUrlData } = supabase.storage
      .from("profile")
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.error("Lỗi không mong muốn khi upload avatar:", err);
    return null;
  }
};

export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null); // Lưu file avatar được chọn

  const [formData, setFormData] = useState({
    full_name: "",
    avatar_url: "",
    phone: "",
    dob: "",
    gender: "",
    bio: "",
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("Bạn cần đăng nhập!");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Lỗi khi lấy user:", error);
      } else {
        setUserInfo(data);
        setFormData({
          full_name: data.full_name ?? "",
          avatar_url: data.avatar_url ?? "",
          phone: data.phone ?? "",
          dob: data.dob ?? "",
          gender: data.gender ?? "",
          bio: data.bio ?? "",
        });
      }

      setLoading(false);
    };

    fetchUserInfo();
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!userInfo) return;

    let avatarUrl = formData.avatar_url;

    // Nếu có file avatar mới, upload lên Supabase
    if (avatarFile) {
      const uploadedUrl = await uploadAvatar(avatarFile);
      if (!uploadedUrl) {
        alert("Lỗi khi upload avatar. Vui lòng thử lại.");
        return;
      }
      avatarUrl = uploadedUrl;
    }

    const { error } = await supabase
      .from("users")
      .update({ ...formData, avatar_url: avatarUrl })
      .eq("id", userInfo.id);

    if (error) {
      console.error("Lỗi khi cập nhật thông tin:", error.message);
    } else {
      setUserInfo({ ...userInfo, ...formData, avatar_url: avatarUrl });
      setEditMode(false);
      setAvatarFile(null); // Reset file avatar sau khi lưu
    }
  };

  if (loading) return <p>Đang tải thông tin người dùng...</p>;

  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Thông tin cá nhân</h1>

      {editMode ? (
        <>
          <div className="grid grid-cols-1 gap-4">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <label htmlFor="avatar" className="cursor-pointer">
                <img
                  src={
                    avatarFile
                      ? URL.createObjectURL(avatarFile)
                      : formData.avatar_url || "/default-avatar.png"
                  }
                  alt="Avatar"
                  className="w-16 h-16 rounded-full object-cover border"
                />
              </label>
              <input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setAvatarFile(e.target.files ? e.target.files[0] : null)
                }
                className="hidden"
              />
              <span className="text-sm text-gray-500">
                Nhấn vào ảnh để thay đổi avatar
              </span>
            </div>

            {/* Các trường thông tin */}
            {["full_name", "phone", "dob", "gender", "bio"].map((field) => (
              <input
                key={field}
                name={field}
                placeholder={field}
                value={(formData as any)[field]}
                onChange={handleChange}
                className="border px-4 py-2 rounded-lg"
              />
            ))}
          </div>
          <button
            onClick={handleSave}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Lưu thay đổi
          </button>
        </>
      ) : (
        <div className="space-y-4 text-sm text-gray-700">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <img
              src={userInfo.avatar_url || "/default-avatar.png"}
              alt="Avatar"
              className="w-16 h-16 rounded-full object-cover border"
            />
            <div>
              <p className="font-semibold">{userInfo.full_name || "Chưa cập nhật"}</p>
              <p className="text-gray-500">{userInfo.email}</p>
            </div>
          </div>

          {/* Các thông tin khác */}
          <p><strong>SĐT:</strong> {userInfo.phone || "Chưa cập nhật"}</p>
          <p><strong>Ngày sinh:</strong> {userInfo.dob || "Chưa cập nhật"}</p>
          <p><strong>Giới tính:</strong> {userInfo.gender || "Chưa cập nhật"}</p>
          <p><strong>Tiểu sử:</strong> {userInfo.bio || "Chưa cập nhật"}</p>
        </div>
      )}

      <button
        onClick={() => setEditMode(!editMode)}
        className="mt-6 text-blue-500 hover:underline"
      >
        {editMode ? "Huỷ" : "Chỉnh sửa thông tin"}
      </button>
    </div>
  );
}
