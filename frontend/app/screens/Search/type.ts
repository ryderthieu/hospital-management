import { ImageSourcePropType } from "react-native";

export type RootStackParamList = {
  MedicineSearch: undefined;
  MedicineList: { category: string };
  MedicineDetail: { medicine: Medicine };
  SortOptions: undefined;
  FilterOptions: undefined;

  DiseaseSearch: undefined;
  DiseaseList: { category: string };
  DiseaseDetail: { disease: Disease };
};


export type MedicineCategory =
| {
    id: string;
    name: string;
    iconType: 'svg';
    icon: React.ComponentType<any>; 
  }
| {
    id: string;
    name: string;
    iconType: 'image';
    icon: ImageSourcePropType; 
  };

export type DiseaseCategory =
| {
    id: string;
    name: string;
    iconType: 'svg';
    icon: React.ComponentType<any>;
  }
| {
    id: string;
    name: string;
    iconType: 'image';
    icon: ImageSourcePropType;
  };

export interface Medicine {
  id: string;               
  name: string;            
  category: string;         
  expiryDate: string;        
  manufacturer: string;      
  description: string;      
  sideEffects: string;       
  image: string;             
  price?: string;            
}

export interface Disease {
  id: string;
  name: string;             // Tên bệnh
  description: string;      // Mô tả tổng quát
  symptoms: string;         // Triệu chứng
  suggestedMedicines: Medicine[]; // Gợi ý thuốc sử dụng
  image?: string;           // Hình ảnh minh hoạ
}


export interface FilterOption {
  id: string;
  name: string;
  value: string;
  selected?: boolean;
}