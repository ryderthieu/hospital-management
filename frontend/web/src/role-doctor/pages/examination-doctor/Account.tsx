import React, { useState } from 'react';
import { Bell, Search, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { AccountInfoView } from '../../components/examination-doctor/AccountInfo/index';
import { ChangePassword } from '../../components/examination-doctor/ChangePassword/index';

const Account = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);

  return (
    <div className="flex-1 min-h-screen border border-red-600 bg-gray-50">
        {/* Content */}
        
          <h1 className="text-2xl font-bold ml-6">Tài khoản & Bảo mật</h1>
          
          <div className="p-6 rounded-lg mb-6">
            <div className="flex flex-row w-max gap-0 p-2 mb-6 bg-base-100 border border-base-200 rounded-xl">
              <button
                className={`px-4 py-2 rounded-md font-semibold ${activeTab === 'profile' ? ' bg-base-300 text-base-900' : 'bg-base-100 text-gray-700'}`}
                onClick={() => setActiveTab('profile')}
              >
                Cài đặt hồ sơ
              </button>
              <button
                className={`px-4 py-2 rounded-md font-semibold ${activeTab === 'password' ? ' bg-base-300 text-base-900' : 'bg-base-100 text-gray-700'}`}
                onClick={() => setActiveTab('password')}
              >
                Đổi mật khẩu
              </button>
            </div>

            {activeTab === 'profile' && <AccountInfoView editMode={editMode} setEditMode={setEditMode} />}
            {activeTab === 'password' && <ChangePassword />}
          </div>
        </div>
  );
};

export default Account;