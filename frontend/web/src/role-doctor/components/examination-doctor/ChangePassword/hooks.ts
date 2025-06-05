import { useState } from 'react';
import { PasswordChangeFormData } from './types';
import { changePassword } from './services';

export const usePasswordChange = () => {
  const [formData, setFormData] = useState<PasswordChangeFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (field: keyof PasswordChangeFormData, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
    // Reset states when form changes
    setError(null);
    setSuccess(false);
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    if (field === 'current') {
      setShowCurrentPassword(!showCurrentPassword);
    } else if (field === 'new') {
      setShowNewPassword(!showNewPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.currentPassword) {
      setError('Vui lòng nhập mật khẩu hiện tại');
      return false;
    }

    if (!formData.newPassword) {
      setError('Vui lòng nhập mật khẩu mới');
      return false;
    }

    if (formData.newPassword.length < 8) {
      setError('Mật khẩu mới phải có ít nhất 8 ký tự');
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const result = await changePassword(formData.currentPassword, formData.newPassword);
      
      if (result) {
        setSuccess(true);
        // Reset form
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setError('Không thể đổi mật khẩu. Vui lòng thử lại.');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    showCurrentPassword,
    showNewPassword,
    showConfirmPassword,
    loading,
    error,
    success,
    handleChange,
    togglePasswordVisibility,
    handleSubmit
  };
};