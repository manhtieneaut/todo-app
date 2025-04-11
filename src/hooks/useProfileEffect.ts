import { useEffect } from 'react';
import { useProfileStore } from '@/store/profile';
import { FormInstance } from 'antd';

export const useProfileEffect = (form: FormInstance) => {
  const { userInfo } = useProfileStore();

  useEffect(() => {
    if (userInfo) {
      form.setFieldsValue({
        full_name: userInfo.full_name,
        phone: userInfo.phone,
        dob: userInfo.dob,
        gender: userInfo.gender,
        bio: userInfo.bio,
      });
    }
  }, [userInfo, form]);
};
