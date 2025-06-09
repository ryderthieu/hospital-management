package org.example.pharmacyservice.service;

import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import lombok.extern.slf4j.Slf4j;
import org.example.pharmacyservice.dto.PrescriptionPdfDto;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
@Slf4j
public class PdfService {
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public byte[] generatePrescriptionPdf(PrescriptionPdfDto prescription) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            // Thêm tiêu đề
            document.add(new Paragraph("ĐƠN THUỐC")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(20)
                    .setBold());

            // Thông tin bệnh nhân
            Table infoTable = new Table(2).useAllAvailableWidth();
            addTableRow(infoTable, "Họ và tên:", prescription.getPatientName());
            addTableRow(infoTable, "Giới tính:", prescription.getPatientGender());
            addTableRow(infoTable, "Ngày sinh:", DATE_FORMATTER.format(prescription.getPatientBirthday()));
            addTableRow(infoTable, "Số điện thoại:", prescription.getPatientPhone());
            addTableRow(infoTable, "Địa chỉ:", prescription.getPatientAddress());
            addTableRow(infoTable, "CMND/CCCD:", prescription.getPatientIdentityNumber());
            addTableRow(infoTable, "Số BHYT:", prescription.getPatientInsuranceNumber());
            document.add(infoTable);

            // Thông tin khám bệnh
            document.add(new Paragraph("\nThông tin khám bệnh:").setBold());
            Table medicalTable = new Table(2).useAllAvailableWidth();
            addTableRow(medicalTable, "Chẩn đoán:", prescription.getDiagnosis());
            addTableRow(medicalTable, "Huyết áp:", prescription.getSystolicBloodPressure() + "/" + prescription.getDiastolicBloodPressure() + " mmHg");
            addTableRow(medicalTable, "Nhịp tim:", prescription.getHeartRate() + " bpm");
            addTableRow(medicalTable, "Đường huyết:", prescription.getBloodSugar() + " mg/dL");
            if (prescription.getNote() != null && !prescription.getNote().isEmpty()) {
                addTableRow(medicalTable, "Ghi chú:", prescription.getNote());
            }
            document.add(medicalTable);

            // Chi tiết đơn thuốc
            document.add(new Paragraph("\nChi tiết đơn thuốc:").setBold());
            Table medicineTable = new Table(6).useAllAvailableWidth();
            medicineTable.addCell(createHeaderCell("STT"));
            medicineTable.addCell(createHeaderCell("Tên thuốc"));
            medicineTable.addCell(createHeaderCell("Đơn vị"));
            medicineTable.addCell(createHeaderCell("Liều dùng"));
            medicineTable.addCell(createHeaderCell("Tần suất"));
            medicineTable.addCell(createHeaderCell("Thời gian"));

            int stt = 1;
            for (PrescriptionPdfDto.PrescriptionDetailInfo detail : prescription.getPrescriptionDetails()) {
                medicineTable.addCell(createCell(String.valueOf(stt++)));
                medicineTable.addCell(createCell(detail.getMedicineName()));
                medicineTable.addCell(createCell(detail.getUnit()));
                medicineTable.addCell(createCell(detail.getDosage()));
                medicineTable.addCell(createCell(detail.getFrequency()));
                medicineTable.addCell(createCell(detail.getDuration()));
            }
            document.add(medicineTable);

            // Thông tin tái khám
            if (prescription.isFollowUp() && prescription.getFollowUpDate() != null) {
                document.add(new Paragraph("\nLịch tái khám: " + DATE_FORMATTER.format(prescription.getFollowUpDate()))
                        .setTextAlignment(TextAlignment.LEFT));
            }

            // Thông tin bác sĩ
            document.add(new Paragraph("\nBác sĩ kê đơn")
                    .setTextAlignment(TextAlignment.RIGHT)
                    .setMarginTop(40));
            document.add(new Paragraph(prescription.getDoctorName())
                    .setTextAlignment(TextAlignment.RIGHT)
                    .setBold());
            String doctorInfo = prescription.getDoctorSpecialization();
            if (prescription.getDoctorDepartment() != null && !prescription.getDoctorDepartment().isEmpty()) {
                doctorInfo += " - " + prescription.getDoctorDepartment();
            }
            document.add(new Paragraph(doctorInfo)
                    .setTextAlignment(TextAlignment.RIGHT));

            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            log.error("Lỗi khi tạo PDF: {}", e.getMessage(), e);
            throw new RuntimeException("Không thể tạo file PDF: " + e.getMessage());
        }
    }

    private Cell createHeaderCell(String text) {
        Cell cell = new Cell().add(new Paragraph(text));
        cell.setBackgroundColor(new DeviceRgb(220, 220, 220));
        cell.setBold();
        cell.setTextAlignment(TextAlignment.CENTER);
        return cell;
    }

    private Cell createCell(String text) {
        Cell cell = new Cell().add(new Paragraph(text != null ? text : ""));
        cell.setTextAlignment(TextAlignment.CENTER);
        return cell;
    }

    private void addTableRow(Table table, String label, String value) {
        table.addCell(new Cell().add(new Paragraph(label).setBold()));
        table.addCell(new Cell().add(new Paragraph(value != null ? value : "")));
    }
} 