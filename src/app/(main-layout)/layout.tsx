"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Layout, Menu, Avatar, Dropdown, Breadcrumb, Typography } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  MessageOutlined,
  OrderedListOutlined,
  SafetyOutlined,
  LogoutOutlined,
  ProfileOutlined,
} from "@ant-design/icons";

import { supabase } from "@/lib/supabaseClient";
import { useAuthStore } from "@/store/auth";
import { useProfileStore } from "@/store/profile";
import { getUserInfo } from "@/api/profileApi";
import AuthGuard from "@/component/AuthGuard";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, setCurrentUser } = useAuthStore();
  const { userInfo, setUserInfo, setLoading } = useProfileStore();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("user_role");
    setUserRole(storedRole);
  }, []);

  useEffect(() => {
    const initUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser({ id: user.id, email: user.email! });

        try {
          setLoading(true);
          const profile = await getUserInfo();
          setUserInfo(profile);
        } finally {
          setLoading(false);
        }
      }
    };

    if (!currentUser) initUser();
  }, [currentUser, setCurrentUser, setUserInfo, setLoading]); // ✅ đầy đủ dependencies


  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setUserInfo(null);
    localStorage.removeItem("jwt_token");
    router.push("/login");
  };

  const breadcrumb = pathname === "/"
    ? ["Home"]
    : pathname
      .split("/")
      .filter(Boolean)
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1));


  const menuItems = [
    { label: "Home", icon: <HomeOutlined />, key: "/" },
    { label: "Profile", icon: <UserOutlined />, key: "/profile" },
    { label: "Chats", icon: <MessageOutlined />, key: "/chat" },
    { label: "Tasks", icon: <OrderedListOutlined />, key: "/task" },
    ...(userRole === "admin"
      ? [{ label: "Admin", icon: <SafetyOutlined />, key: "/admin" }]
      : []),
    ...(userRole === "moderator"
      ? [{ label: "Moderator", icon: <SafetyOutlined />, key: "/moderator" }]
      : []),
  ];

  const dropdownMenu = (
    <Menu
      onClick={({ key }) => {
        if (key === "logout") handleLogout();
        if (key === "profile") router.push("/profile");
      }}
      items={[
        { label: "Profile", key: "profile", icon: <ProfileOutlined /> },
        { label: "Logout", key: "logout", icon: <LogoutOutlined />, danger: true },
      ]}
    />
  );

  return (
    <AuthGuard>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          width={200}
          style={{
            background: "#fff",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 10,
            overflow: "auto",
            borderRight: "1px solid #f0f0f0",
          }}
        >
          <div className="logo text-center py-5 font-bold text-purple-600 text-xl">MyApp</div>
          <Menu
            mode="inline"
            selectedKeys={[pathname]}
            onClick={({ key }) => router.push(key)}
            items={menuItems}
          />
        </Sider>


        <Layout style={{ marginLeft: 200 }}>
          <Header
            style={{
              background: "#fff",
              padding: "0 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              position: "sticky", // 🧷 Dính trên đầu
              top: 0,
              zIndex: 100,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)", // 👌 cho đẹp thêm
            }}
          >

            <div>
              <Breadcrumb>
                {breadcrumb.map((item, index) => (
                  <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>
                ))}
              </Breadcrumb>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Text type="secondary" className="hidden sm:block">
                {currentUser?.email}
              </Text>
              <Dropdown overlay={dropdownMenu} placement="bottomRight" trigger={["click"]}>
                <Avatar
                  size="large"
                  src={userInfo?.avatar_url || "/default-avatar.png"}
                  style={{ cursor: "pointer" }}
                />
              </Dropdown>
            </div>
          </Header>


          <Content style={{ margin: "24px", padding: 24, background: "#f9f9f9" }}>
            {children}
          </Content>
        </Layout>
      </Layout>
    </AuthGuard>
  );
}
