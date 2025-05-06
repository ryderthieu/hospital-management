import { ImageSourcePropType } from "react-native";

export type RootStackParamList = {
    SpecialistSearch: undefined;
    DoctorList: { specialty: string };
    BookAppointment: { doctor: Doctor };
    SortOptions: undefined;
    FilterOptions: undefined;
  };
  
  export interface Specialty {
    id: string;
    name: string;
    count: string;
    icon: ImageSourcePropType;
  }
  
  export interface Doctor {
    id: string;
    name: string;
    specialty: string;
    room?: string;
    price: string;
    image: any; // Consider using a more specific type for images
  }
  
  export interface DateOption {
    id: string;
    day: string;
    date: string;
    disabled?: boolean;
  }