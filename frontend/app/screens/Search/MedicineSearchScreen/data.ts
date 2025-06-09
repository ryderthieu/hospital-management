import { MedicineCategory, Medicine } from '../type';
import { SvgProps } from 'react-native-svg';
import Icon from '../../../assets/images/ChuyenKhoa/medicine.svg';

export const medicineCategoriesData: MedicineCategory[] = [
  { id: '1', name: 'Kháng sinh', iconType: 'svg', icon: Icon as React.FC<SvgProps> },
  { id: '2', name: 'Giảm đau', iconType: 'svg', icon: Icon as React.FC<SvgProps> },
  { id: '3', name: 'Hạ sốt', iconType: 'svg', icon: Icon as React.FC<SvgProps> },
  { id: '4', name: 'Chống viêm', iconType: 'svg', icon: Icon as React.FC<SvgProps> },
  { id: '5', name: 'Dị ứng', iconType: 'svg', icon: Icon as React.FC<SvgProps> },
  { id: '6', name: 'Huyết áp', iconType: 'svg', icon: Icon as React.FC<SvgProps> },
  { id: '7', name: 'Tim mạch', iconType: 'svg', icon: Icon as React.FC<SvgProps> },
  { id: '8', name: 'Tiêu hóa', iconType: 'svg', icon: Icon as React.FC<SvgProps> },
];

export const medicineData: Medicine[] = [
  {
    id: '1',
    name: 'Amoxicillin',
    category: 'Kháng sinh',
    manufacturer: 'Pfizer',
    description: 'Kháng sinh điều trị nhiễm khuẩn đường hô hấp, tiết niệu.',
    sideEffects: 'Buồn nôn, tiêu chảy, phát ban.',
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE5bqN-3d0odGzXDWsgd7o2Ft2snBP0i5L0w&s',
    price: '150,000 VNĐ',
  },
  {
    id: '2',
    name: 'Ciprofloxacin',
    category: 'Kháng sinh',
    manufacturer: 'Bayer',
    description: 'Kháng sinh phổ rộng, điều trị nhiễm khuẩn nặng.',
    sideEffects: 'Đau đầu, chóng mặt, rối loạn tiêu hóa.',
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE5bqN-3d0odGzXDWsgd7o2Ft2snBP0i5L0w&s',
    price: '200,000 VNĐ',
  },
];