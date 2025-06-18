import React, { useState, useRef } from 'react';
import { Download, Printer, Eye, EyeOff } from 'lucide-react';

// Import html2pdf from CDN (loaded in HTML head)
declare global {
  interface Window {
    html2pdf: any;
  }
}

// Prescription data based on the uploaded document
const prescriptionData = {
  hospitalName: "BỆNH VIỆN ĐẠI HỌC Y DƯỢC TP.HCM",
  hospitalAddress: "215 Hồng Bàng - Quận 5 - TP - Hồ Chí Minh",
  hospitalPhone: "028 38554269",
  hospitalWebsite: "www.bvdaihoc.com.vn",
  hospitalEmail: "bvdh@bvdaihoc.com.vn",
  prescriptionNumber: "N24-0229476",
  patient: {
    name: "TRẦN NHẬT TRƯỜNG",
    gender: "Nam",
    birthDate: "17/10/2004",
    phone: "0961565563",
    address: "12 Ấp 3, Xã Hướng Thọ Phú, Thành phố Tân An, Long An"
  },
  vitalSigns: {
    heartRate: "70 L/ph",
    bloodPressure: "120/80 mmHg",
    bmi: "24.8 kg/m²",
    weight: "70 kg"
  },
  diagnosis: "MÀY ĐAY MẠN (L50)",
  medications: [
    {
      name: "Ebastine Normon 10mg Orodispersible Tablets",
      quantity: "56 viên",
      instruction: "Ngày uống 2 lần, mỗi lần 1 viên, sau ăn sáng, chiều"
    },
    {
      name: "EPA + DHA (Dasbrain)",
      quantity: "56 viên", 
      instruction: "Ngày uống 2 lần, mỗi lần 1 viên, sau ăn sáng, chiều"
    }
  ],
  followUp: {
    department: "DỊ ỨNG - MIỄN DỊCH LÂM SÀNG",
    date: "chiều Thứ sáu, ngày 04/04/2025"
  },
  doctor: {
    name: "ThS.BS. Trần Thiên Tài",
    signDate: "15:21, 07/03/2025"
  },
  staff: "Nguyễn Thị Mỹ Viện"
};

const PrescriptionPDF: React.FC = () => {
  const [showPreview, setShowPreview] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const prescriptionRef = useRef<HTMLDivElement>(null);

  // Load html2pdf library dynamically
  const loadHtml2Pdf = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (window.html2pdf) {
        resolve(window.html2pdf);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = () => {
        if (window.html2pdf) {
          resolve(window.html2pdf);
        } else {
          reject(new Error('Failed to load html2pdf'));
        }
      };
      script.onerror = () => reject(new Error('Failed to load html2pdf script'));
      document.head.appendChild(script);
    });
  };

  // Generate PDF using html2pdf.js
  const generatePDF = async () => {
    if (!prescriptionRef.current) return;

    setIsGenerating(true);
    try {
      const html2pdf = await loadHtml2Pdf();
      
      const options = {
        margin: [10, 10, 10, 10],
        filename: `Don_Thuoc_${prescriptionData.patient.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
          allowTaint: false
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        }
      };

      await html2pdf().set(options).from(prescriptionRef.current).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Có lỗi khi tạo PDF. Vui lòng thử lại.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Print using html2pdf
  const printPrescription = async () => {
    if (!prescriptionRef.current) return;

    setIsGenerating(true);
    try {
      const html2pdf = await loadHtml2Pdf();
      
      const options = {
        margin: [10, 10, 10, 10],
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait'
        }
      };

      const pdf = await html2pdf().set(options).from(prescriptionRef.current).outputPdf();
      const blob = new Blob([pdf], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const printWindow = window.open(url, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
          URL.revokeObjectURL(url);
        };
      }
    } catch (error) {
      console.error('Error printing PDF:', error);
      alert('Có lỗi khi in PDF. Vui lòng thử lại.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Control Panel */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Medical Prescription - HTML2PDF</h1>
              <p className="text-sm text-gray-600 mt-1">Sử dụng html2pdf.js với Tailwind CSS</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {showPreview ? <EyeOff size={20} /> : <Eye size={20} />}
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
              <button
                onClick={generatePDF}
                disabled={isGenerating}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={20} />
                {isGenerating ? 'Generating...' : 'Download PDF'}
              </button>
              <button
                onClick={printPrescription}
                disabled={isGenerating}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Printer size={20} />
                {isGenerating ? 'Processing...' : 'Print'}
              </button>
            </div>
          </div>
          
          {/* Progress indicator */}
          {isGenerating && (
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm text-gray-600">Đang tạo PDF...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Prescription Preview */}
      {showPreview && (
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div 
              ref={prescriptionRef} 
              className="bg-white p-8 max-w-4xl mx-auto"
              style={{ fontFamily: 'Times New Roman, serif' }}
            >
              
              {/* Header Section */}
              <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-black">
                {/* Hospital Logo */}
                <div className="w-16 h-16 bg-blue-100 border-2 border-blue-600 rounded-lg flex items-center justify-center text-blue-600 font-bold text-sm">
                  UMC
                </div>
                
                {/* Hospital Info */}
                <div className="flex-1 mx-4">
                  <h1 className="font-bold text-base mb-1">{prescriptionData.hospitalName}</h1>
                  <div className="text-xs leading-relaxed">
                    <p>{prescriptionData.hospitalAddress}</p>
                    <p>ĐT: {prescriptionData.hospitalPhone}, Website: {prescriptionData.hospitalWebsite}</p>
                    <p>Email: {prescriptionData.hospitalEmail}</p>
                  </div>
                </div>
                
                {/* QR Code and Number */}
                <div className="text-right">
                  <div className="w-12 h-12 border border-black mb-2 flex items-center justify-center text-xs bg-gray-50">
                    QR
                  </div>
                  <div className="text-xs">
                    <div className="font-bold">Số hồ sơ:</div>
                    <div className="font-bold">{prescriptionData.prescriptionNumber}</div>
                  </div>
                </div>
              </div>

              {/* Prescription Title */}
              <h2 className="text-center text-2xl font-bold mb-6 tracking-widest">ĐƠN THUỐC</h2>

              {/* Main Content */}
              <div className="flex gap-6">
                {/* Left Column - Department Info */}
                <div className="w-48 border border-black p-3 bg-gray-50">
                  <h3 className="font-bold text-xs text-center mb-3 leading-tight">
                    Phòng khám Dị Ứng - Miễn Dịch<br/>Lâm Sàng
                  </h3>
                  
                  <div className="text-xs mb-4">
                    <h4 className="font-bold mb-2">Danh sách bác sĩ:</h4>
                    <div className="space-y-1">
                      <p>TS BS. Phạm Lê Duy</p>
                      <p>ThS BS. Trần Thiên Tài</p>
                      <p className="text-xs italic">(Phụ trách phòng khám)</p>
                      <p>ThS BS. Trần Thị Thanh Mai</p>
                    </div>
                  </div>
                  
                  <div className="text-xs">
                    <h4 className="font-bold mb-2">Chức năng phòng khám</h4>
                    <p className="mb-2">Phòng khám Dị ứng - Miễn dịch lâm sàng khám, tư vấn và điều trị:</p>
                    <p className="mb-2">- Các bệnh lý dị ứng: Chàm, mày đay, dị ứng thuốc, dị ứng thức ăn, viêm mũi dị ứng...</p>
                    <p className="mb-2">- Các bệnh lý tự miễn: Lupus ban đỏ, xơ cứng bì, viêm khớp dạng thấp, viêm cột sống dính khớp, viêm da cơ...</p>
                    <p className="mb-2">- Đặc biệt, thực hiện các tầm soát nguyên nhân gây dị ứng:</p>
                    <p className="mb-1">+ Thử nghiệm dị ứng da tìm dị nguyên: test lẩy da.</p>
                    <p>+ Định lượng IgE đặc hiệu trong máu.</p>
                  </div>
                </div>

                {/* Right Column - Patient Info and Prescription */}
                <div className="flex-1">
                  {/* Patient Information */}
                  <div className="grid grid-cols-2 gap-6 mb-4">
                    <div className="space-y-2">
                      <div className="flex text-xs">
                        <span className="font-bold w-20">Họ tên :</span>
                        <span>{prescriptionData.patient.name}</span>
                      </div>
                      <div className="flex text-xs">
                        <span className="font-bold w-20">Ngày sinh:</span>
                        <span>{prescriptionData.patient.birthDate}</span>
                      </div>
                      <div className="flex text-xs">
                        <span className="font-bold w-20">Địa chỉ :</span>
                        <span className="flex-1">{prescriptionData.patient.address}</span>
                      </div>
                      <div className="flex text-xs">
                        <span className="font-bold w-20">Thẻ BHYT:</span>
                        <span>-</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex text-xs">
                        <span className="font-bold w-20">Giới tính:</span>
                        <span>{prescriptionData.patient.gender}</span>
                      </div>
                      <div className="flex text-xs">
                        <span className="font-bold w-20">Di động:</span>
                        <span>{prescriptionData.patient.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Vital Signs */}
                  <div className="mb-4 text-xs">
                    <span className="font-bold">Sinh hiệu:</span> Tần số tim: {prescriptionData.vitalSigns.heartRate}, Huyết áp: {prescriptionData.vitalSigns.bloodPressure}, BMI: {prescriptionData.vitalSigns.bmi}; Cân nặng: {prescriptionData.vitalSigns.weight}
                  </div>

                  {/* Diagnosis */}
                  <div className="mb-6 text-xs">
                    <span className="font-bold">Chẩn đoán : {prescriptionData.diagnosis}</span>
                  </div>

                  {/* Medications */}
                  <div className="mb-8 space-y-4">
                    {prescriptionData.medications.map((med, index) => (
                      <div key={index} className="text-xs">
                        <div className="flex justify-between items-start font-bold mb-1">
                          <span className="flex-1">
                            <span className="inline-block w-6">{index + 1} .</span>
                            {med.name}
                          </span>
                          <span className="ml-4">{med.quantity}</span>
                        </div>
                        <div className="ml-6 text-gray-700">{med.instruction}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Instructions Section */}
              <div className="mt-8 text-xs space-y-3">
                <div>
                  <span className="font-bold">Lời dặn :</span>
                </div>
                <div>
                  <span className="font-bold">Tái khám :</span> {prescriptionData.followUp.department} vào {prescriptionData.followUp.date}
                </div>
                <div className="leading-relaxed">
                  Người bệnh đăng ký tái khám TRƯỚC ngày khám qua ứng dụng UMC Care hoặc đăng ký tái khám tại các quầy Đăng ký khám bệnh
                </div>
              </div>

              {/* Signature Section */}
              <div className="flex justify-end mt-12">
                <div className="text-center text-xs">
                  <div className="w-40 h-12 border-b border-black mb-2 relative bg-gray-50">
                    <span className="absolute right-2 bottom-1 italic text-gray-500 text-xs">Signature ✓</span>
                  </div>
                  <div className="font-bold">{prescriptionData.doctor.name}</div>
                  <div className="mt-1">Ngày ký: {prescriptionData.doctor.signDate}</div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-4 border-t border-black">
                <div className="text-xs text-center mb-3">
                  *Đơn thuốc dùng một lần. Khi cần hỗ trợ, xin vui lòng liên hệ số điện thoại: {prescriptionData.hospitalPhone}.
                </div>
                <div className="flex justify-between items-center text-xs">
                  <div className="flex-1">
                    <p>Cài đặt ứng dụng UMC Care (quét mã QR)</p>
                    <p>để đăng ký khám bệnh, thanh toán viện phí và xem Hồ sơ sức khỏe.</p>
                  </div>
                  <div className="w-10 h-10 border border-black flex items-center justify-center ml-4 bg-gray-50">
                    QR
                  </div>
                </div>
                
                {/* Staff Name */}
                <div className="mt-4 text-xs">
                  Nhân viên: {prescriptionData.staff}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feature Comparison */}
      <div className="max-w-6xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-bold text-green-800 mb-2">✅ Ưu điểm html2pdf.js:</h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• <strong>Chất lượng cao:</strong> Render chính xác font, màu sắc, layout</li>
            <li>• <strong>Dễ sử dụng:</strong> API đơn giản, config linh hoạt</li>
            <li>• <strong>Tailwind CSS:</strong> Styling nhanh và responsive</li>
            <li>• <strong>Tùy chỉnh:</strong> Margin, format, quality, compression</li>
            <li>• <strong>Tương thích:</strong> Hoạt động tốt trên mọi browser</li>
          </ul>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-bold text-yellow-800 mb-2">⚠️ Nhược điểm html2pdf.js:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• <strong>File size lớn:</strong> Thêm ~400KB vào bundle</li>
            <li>• <strong>Loading time:</strong> Cần load thư viện từ CDN</li>
            <li>• <strong>Performance:</strong> Chậm hơn với tài liệu phức tạp</li>
            <li>• <strong>Dependencies:</strong> Phụ thuộc thư viện ngoài</li>
            <li>• <strong>Mobile:</strong> Có thể lag trên thiết bị yếu</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionPDF;