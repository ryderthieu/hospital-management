import { MedicineCategory, DiseaseCategory, Disease } from '../type';
import { SvgProps } from 'react-native-svg';
import Icon from '../../../assets/images/ChuyenKhoa/medicine.svg';

export const diseaseCategoriesData: DiseaseCategory[] = [
  { id: '1', name: 'Đau đầu', iconType: 'svg', icon: Icon as React.FC<SvgProps> },
  { id: '2', name: 'Sốt', iconType: 'svg', icon: Icon as React.FC<SvgProps> },
  { id: '3', name: 'Ho', iconType: 'svg', icon: Icon as React.FC<SvgProps> },
  { id: '4', name: 'Đau bụng', iconType: 'svg', icon: Icon as React.FC<SvgProps> },
  { id: '5', name: 'Da liễu', iconType: 'svg', icon: Icon as React.FC<SvgProps> },
  { id: '6', name: 'Tiêu chảy', iconType: 'svg', icon: Icon as React.FC<SvgProps> },
  { id: '7', name: 'Hô hấp', iconType: 'svg', icon: Icon as React.FC<SvgProps> },
  { id: '8', name: 'Mắt', iconType: 'svg', icon: Icon as React.FC<SvgProps> },
];

export const diagnosisOptions = [
  'Đau đầu',
  'Sốt',
  'Ho',
  'Mệt mỏi',
  'Buồn nôn',
  'Đau ngực',
  'Tiêu chảy',
  'Phát ban',
];

export const sampleDisease: Disease = {
  id: "1",
  name: "Cảm lạnh",
  description: "Một bệnh hô hấp phổ biến do virus.",
  symptoms: ["Sốt", "Ho", "Ngạt mũi", "Mệt mỏi"],
  suggestedMedicines: [
    {
      id: "m1",
      name: "Paracetamol",
      category: "Thuốc hạ sốt",
      expiryDate: "2026-05-01",
      manufacturer: "Hãng A",
      description: "Giảm đau, hạ sốt.",
      sideEffects: "Buồn nôn, dị ứng.",
      image: "https://example.com/paracetamol.jpg",
      price: "5000",
    },
  ],
  image: "https://example.com/cold.jpg",
};