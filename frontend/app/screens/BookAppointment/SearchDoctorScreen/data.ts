import { Specialty } from '../types';
import { SvgProps } from 'react-native-svg';
import TimMach from '../../../assets/images/ChuyenKhoa/TimMach.svg';
import SanNhi from '../../../assets/images/ChuyenKhoa/SanNhi.svg';
import DongY from '../../../assets/images/ChuyenKhoa/DongY.svg';
import DaKhoa from '../../../assets/images/ChuyenKhoa/DaKhoa.svg';
import Than from '../../../assets/images/ChuyenKhoa/Than.svg';
import TamThan from '../../../assets/images/ChuyenKhoa/TamThan.svg';
import TieuHoa from '../../../assets/images/ChuyenKhoa/TieuHoa.svg';
import UngThu from '../../../assets/images/ChuyenKhoa/UngThu.svg';
import PhauThuat from '../../../assets/images/ChuyenKhoa/PhauThuat.svg';
import NhaKhoa from '../../../assets/images/ChuyenKhoa/NhaKhoa.svg';

export const specialtiesData: Specialty[] = [
  { id: '1', name: 'Tim mạch', count: '340 bác sĩ', iconType: 'svg', icon: TimMach as React.FC<SvgProps> },
  { id: '2', name: 'Sản nhi', count: '450 bác sĩ', iconType: 'svg', icon: SanNhi as React.FC<SvgProps> },
  { id: '3', name: 'Đông y', count: '450 bác sĩ', iconType: 'svg', icon: DongY as React.FC<SvgProps> },
  { id: '4', name: 'Đa khoa', count: '50 bác sĩ', iconType: 'svg', icon: DaKhoa as React.FC<SvgProps> },
  { id: '5', name: 'Thận', count: '20 bác sĩ', iconType: 'svg', icon: Than as React.FC<SvgProps> },
  { id: '6', name: 'Tâm thần', count: '50 bác sĩ', iconType: 'svg', icon: TamThan as React.FC<SvgProps> },
  { id: '7', name: 'Tiêu hóa', count: '14 bác sĩ', iconType: 'svg', icon: TieuHoa as React.FC<SvgProps> },
  { id: '8', name: 'Ung thư', count: '34 bác sĩ', iconType: 'svg', icon: UngThu as React.FC<SvgProps> },
  { id: '9', name: 'Phẫu thuật', count: '54 bác sĩ', iconType: 'svg', icon: PhauThuat as React.FC<SvgProps> },
  { id: '10', name: 'Nha khoa', count: '34 bác sĩ', iconType: 'svg', icon: NhaKhoa as React.FC<SvgProps> },
];
