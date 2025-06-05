// components/AccountInfo/index.tsx
import React from 'react';
import { AccountInfoProps } from './types';
import { useAccountInfo } from './hooks';
import { FormField } from '../../examination-doctor/FormField'

export const AccountInfoView: React.FC<AccountInfoProps> = ({ editMode, setEditMode }) => {
  const { profile, loading, error, handleChange, handleSave, handleCancel } = useAccountInfo();

  if (loading) return <div className="flex justify-center py-8">Loading...</div>;
  if (error) return <div className="text-red-500 py-8">{error}</div>;
  if (!profile) return <div className="text-red-500 py-8">No profile data available</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSave();
    if (success) {
      setEditMode(false);
    }
  };

  const cancelEdit = () => {
    handleCancel();
    setEditMode(false);
  };

  return (
    <div className=' bg-white px-5 py-3 border rounded-2xl shadow-md'>
      <div className="flex justify-between items-center">
        <div className='flex flex-col gap-2'>
            <h2 className="text-xl font-semibold">Hồ sơ của tôi</h2>
            <p className="text-gray-600 mb-6">Thông tin này sẽ được hiển thị công khai</p>
        </div>
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="px-4 py-2 bg-base-600 text-white rounded-md hover:bg-base-700 transition border border-transparent"
          >
            Chỉnh sửa
          </button>
        ) : 
        (
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
              >
                Huỷ bỏ
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-base-600 text-white rounded-md hover:bg-base-700 transition border border-transparent"
              >
                Lưu thay đổi
              </button>
            </div>
          )}
      </div>
      

      <form onSubmit={handleSubmit}>
        {/* Avatar Section */}
        <h3 className="text-md font-medium text-gray-700 mb-2">Ảnh đại diện</h3>
        <div className="mb-6 p-3 bg-white rounded-2xl">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row gap-3 justify-center items-center">
              <img
                src={profile.avatarUrl}
                alt="Profile"
                className="h-24 w-24 rounded-full object-cover border border-gray-300"
              />
            
            <div className="ml-5">
              <p className="text-sm text-gray-600 mb-1">Định dạng: jpg, jpeg, png.</p>
              <p className="text-sm text-gray-600 mb-3">Kích thước tối đa: 3MB</p>
            </div>
            </div>
              
              {editMode ? (
                <div className="flex space-x-2">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                  >
                    Gỡ ảnh
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-base-100 text-base-700 rounded-md text-sm hover:bg-base-200"
                  >
                    Thay đổi ảnh đại diện
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="px-4 py-2 bg-base-100 text-base-700 rounded text-sm hover:bg-base-200"
                >
                  Xem ảnh đại diện
                </button>
              )}
            </div>
        </div>

        {/* Personal Information */}
        <div className="grid grid-cols-2 gap-6">
          
              <FormField
                label="Họ và tên đệm"
                type="text"
                name="fullName"
                value={profile.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                isEditable={editMode}
               />
            
          
          
          
              <FormField
              label="Tên"
              type="text"
              name="firstname"
              value={profile.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              isEditable={editMode}
             />
            
          

          <div>
            <label className="block text-gray-700 mb-2">Giới tính</label>
            {editMode ? (
              <select
                value={profile.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="w-full px-2 py-2 bg-white border border-gray-300 rounded-md outline-none focus:ring focus:ring-base-200 focus:border-base-500"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            ) : (
              <p className="px-2 py-2 border border-gray-200 rounded-md bg-gray-50">{profile.gender}</p>
            )}
          </div>

          
           
              <FormField
              label="Ngày sinh"
              type="date"
              name="birshday"
              value={profile.dateOfBirth.split('/').reverse().join('-')}
              onChange={(e) => {
                // Convert YYYY-MM-DD to DD/MM/YYYY
                const date = new Date(e.target.value);
                const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
                handleChange('dateOfBirth', formattedDate);
              }}
              isEditable={editMode}
             />
            
          
        </div>

        <div className="mt-4">
             <FormField
             label="Địa chỉ"
             type="text"
             name="address"
             value={profile.address}
             onChange={(e) => handleChange('address', e.target.value)}
             isEditable={editMode}
            />
        </div>

        <div className="grid grid-cols-2 gap-6 mt-4">
              <FormField
              label="Số điện thoại"
              type="text"
              name="phoneNumber"
              value={profile.phoneNumber}
              onChange={(e) => handleChange('phoneNumber', e.target.value)}
              isEditable={editMode}
             />
          

          <div>
              <FormField
              label="Khoa trực thuộc"
              type="text"
              name="department"
              value={profile.department}
              isEditable={false}
              />
          </div>

          <div>
              <FormField
              label="Loại tài khoản"
              type="text"
              name="accountType"
              value={profile.accountType}
              isEditable={false}
             />
          </div>

          <div>
              <FormField
              label="Mã bác sĩ"
              type="text"
              name="doctorId"
              value={profile.doctorId}
              isEditable={false}
             />
          </div>

          <div>
              <FormField
              label="Chức danh"
              type="text"
              name="title"
              value={profile.title}
              isEditable={false}
             />
          </div>

          <div>
              <FormField
              label="Chuyên khoa"
              type="text"
              name="specialization"
              value={profile.specialization}
              isEditable={false}
             />
          </div>
        </div>
      </form>
    </div>
  );
};

