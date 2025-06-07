package org.example.paymentservice.service;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.paymentservice.config.VnPayConfig;
import org.example.paymentservice.dto.TransactionDTOs;
import org.example.paymentservice.entity.Bill;
import org.example.paymentservice.entity.Transaction;
import org.example.paymentservice.repository.BillRepository;
import org.example.paymentservice.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final BillRepository billRepository;
    private final VnPayConfig vnPayConfig;

    @Transactional
    public TransactionDTOs.TransactionResponse createTransaction(TransactionDTOs.CreateTransactionRequest request) {
        Bill bill = billRepository.findById(request.getBillId())
                .orElseThrow(() -> new RuntimeException("Bill not found with ID: " + request.getBillId()));

        Transaction transaction = new Transaction();
        transaction.setBill(bill);
        transaction.setAmount(request.getAmount());
        transaction.setPaymentMethod(request.getPaymentMethod());
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setStatus(Transaction.TransactionStatus.PENDING);

        Transaction savedTransaction = transactionRepository.save(transaction);
        return mapToTransactionResponse(savedTransaction);
    }

    public TransactionDTOs.PaymentUrlResponse createPaymentUrl(Long transactionId, HttpServletRequest request) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found with ID: " + transactionId));

        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_OrderType = "other";
        String orderInfo = "Thanh toan hoa don: " + transaction.getBill().getBillId();

        // Convert BigDecimal to long (VNPay requires amount in integer, representing VND x 100)
        long amount = transaction.getAmount().multiply(new BigDecimal("100")).longValue();

        String vnp_TxnRef = transactionId + "_" + vnPayConfig.getRandomNumber(4);

        // Get client IP
        String vnp_IpAddr = getClientIp(request);

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnPayConfig.getVnpTmnCode());
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");

        // Use bank code if specified
        if (transaction.getPaymentMethod() == Transaction.PaymentMethod.ONLINE_BANKING) {
            vnp_Params.put("vnp_BankCode", "NCB"); // Default to NCB or get from request
        }

        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", orderInfo);
        vnp_Params.put("vnp_OrderType", vnp_OrderType);
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", vnPayConfig.getVnpReturnUrl());
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        // Create date time format for VNPay
        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        // Set expire date
        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        // Build query
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                // Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                try {
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    // Build query
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                    query.append('=');
                    query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                } catch (Exception e) {
                    log.error("Error encoding URL parameters", e);
                }

                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }

        String queryUrl = query.toString();
        String vnp_SecureHash = vnPayConfig.hmacSHA512(vnPayConfig.getSecretKey(), hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = vnPayConfig.getVnpPayUrl() + "?" + queryUrl;

        // Store the vnp_TxnRef for later verification
        transaction.setStatus(Transaction.TransactionStatus.PENDING);
        transactionRepository.save(transaction);

        TransactionDTOs.PaymentUrlResponse response = new TransactionDTOs.PaymentUrlResponse();
        response.setCode("00");
        response.setMessage("success");
        response.setPaymentUrl(paymentUrl);

        return response;
    }

    @Transactional
    public boolean processPaymentReturn(TransactionDTOs.PaymentResultRequest paymentResult) {
        // Extract transaction ID from vnp_TxnRef (format: {transactionId}_{random})
        String vnp_TxnRef = paymentResult.getVnp_TxnRef();
        String[] parts = vnp_TxnRef.split("_");
        Long transactionId = Long.parseLong(parts[0]);

        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found with ID: " + transactionId));

        // Verify the transaction
        if ("00".equals(paymentResult.getVnp_ResponseCode()) && "00".equals(paymentResult.getVnp_TransactionStatus())) {
            // Update transaction status
            transaction.setStatus(Transaction.TransactionStatus.SUCCESS);
            transactionRepository.save(transaction);

            // Mark bill as paid - implement this according to your business logic
            Bill bill = transaction.getBill();
            bill.setPaid(true);
            billRepository.save(bill);

            return true;
        } else {
            transaction.setStatus(Transaction.TransactionStatus.FAILED);
            transactionRepository.save(transaction);
            return false;
        }
    }

    @Transactional(readOnly = true)
    public TransactionDTOs.TransactionResponse getTransaction(Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found with ID: " + transactionId));

        return mapToTransactionResponse(transaction);
    }

    public String queryTransactionStatus(Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found with ID: " + transactionId));

        try {
            // Format for VNPAY API request
            String vnp_RequestId = vnPayConfig.getRandomNumber(8);
            String vnp_Version = "2.1.0";
            String vnp_Command = "querydr";
            String vnp_TmnCode = vnPayConfig.getVnpTmnCode();
            String vnp_TxnRef = transactionId.toString();
            String vnp_OrderInfo = "Kiem tra ket qua GD OrderId:" + vnp_TxnRef;

            // Transaction date - use current date for this example, modify as needed
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
            String vnp_TransDate = transaction.getCreatedAt().format(formatter);

            // Current date
            String vnp_CreateDate = LocalDateTime.now().format(formatter);

            // IP address
            String vnp_IpAddr = "127.0.0.1"; // This should be dynamically obtained in a real scenario

            JsonObject vnp_Params = new JsonObject();

            vnp_Params.addProperty("vnp_RequestId", vnp_RequestId);
            vnp_Params.addProperty("vnp_Version", vnp_Version);
            vnp_Params.addProperty("vnp_Command", vnp_Command);
            vnp_Params.addProperty("vnp_TmnCode", vnp_TmnCode);
            vnp_Params.addProperty("vnp_TxnRef", vnp_TxnRef);
            vnp_Params.addProperty("vnp_OrderInfo", vnp_OrderInfo);
            vnp_Params.addProperty("vnp_TransactionDate", vnp_TransDate);
            vnp_Params.addProperty("vnp_CreateDate", vnp_CreateDate);
            vnp_Params.addProperty("vnp_IpAddr", vnp_IpAddr);

            String hash_Data = String.join("|", vnp_RequestId, vnp_Version, vnp_Command,
                    vnp_TmnCode, vnp_TxnRef, vnp_TransDate, vnp_CreateDate, vnp_IpAddr, vnp_OrderInfo);

            String vnp_SecureHash = vnPayConfig.hmacSHA512(vnPayConfig.getSecretKey(), hash_Data);

            vnp_Params.addProperty("vnp_SecureHash", vnp_SecureHash);

            // Make API call to VNPAY
            URL url = new URL(vnPayConfig.getVnpApiUrl());
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("POST");
            con.setRequestProperty("Content-Type", "application/json");
            con.setDoOutput(true);

            DataOutputStream wr = new DataOutputStream(con.getOutputStream());
            wr.writeBytes(vnp_Params.toString());
            wr.flush();
            wr.close();

            int responseCode = con.getResponseCode();
            log.info("Sending 'POST' request to URL: " + url);
            log.info("Post Data: " + vnp_Params);
            log.info("Response Code: " + responseCode);

            BufferedReader in = new BufferedReader(
                    new InputStreamReader(con.getInputStream()));
            String output;
            StringBuffer response = new StringBuffer();

            while ((output = in.readLine()) != null) {
                response.append(output);
            }
            in.close();

            return response.toString();

        } catch (Exception e) {
            log.error("Error querying transaction status", e);
            return "Error: " + e.getMessage();
        }
    }

    public String processRefund(TransactionDTOs.TransactionRefundRequest refundRequest) {
        Transaction transaction = transactionRepository.findById(refundRequest.getTransactionId())
                .orElseThrow(() -> new RuntimeException("Transaction not found with ID: " + refundRequest.getTransactionId()));

        try {
            // Format for VNPAY API request
            String vnp_RequestId = vnPayConfig.getRandomNumber(8);
            String vnp_Version = "2.1.0";
            String vnp_Command = "refund";
            String vnp_TmnCode = vnPayConfig.getVnpTmnCode();
            String vnp_TransactionType = "02"; // Full refund by default
            String vnp_TxnRef = transaction.getTransactionId().toString();
            long amount = refundRequest.getAmount().multiply(new BigDecimal("100")).longValue();
            String vnp_Amount = String.valueOf(amount);
            String vnp_OrderInfo = "Hoan tien GD OrderId:" + vnp_TxnRef;

            // Transaction date
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
            String vnp_TransactionDate = transaction.getCreatedAt().format(formatter);

            String vnp_CreateBy = refundRequest.getUser();
            String vnp_CreateDate = LocalDateTime.now().format(formatter);
            String vnp_IpAddr = "127.0.0.1"; // This should be dynamically obtained

            JsonObject vnp_Params = new JsonObject();

            vnp_Params.addProperty("vnp_RequestId", vnp_RequestId);
            vnp_Params.addProperty("vnp_Version", vnp_Version);
            vnp_Params.addProperty("vnp_Command", vnp_Command);
            vnp_Params.addProperty("vnp_TmnCode", vnp_TmnCode);
            vnp_Params.addProperty("vnp_TransactionType", vnp_TransactionType);
            vnp_Params.addProperty("vnp_TxnRef", vnp_TxnRef);
            vnp_Params.addProperty("vnp_Amount", vnp_Amount);
            vnp_Params.addProperty("vnp_OrderInfo", vnp_OrderInfo);
            vnp_Params.addProperty("vnp_TransactionDate", vnp_TransactionDate);
            vnp_Params.addProperty("vnp_CreateBy", vnp_CreateBy);
            vnp_Params.addProperty("vnp_CreateDate", vnp_CreateDate);
            vnp_Params.addProperty("vnp_IpAddr", vnp_IpAddr);

            String hash_Data = String.join("|", vnp_RequestId, vnp_Version, vnp_Command,
                    vnp_TmnCode, vnp_TransactionType, vnp_TxnRef, vnp_Amount, "", vnp_TransactionDate,
                    vnp_CreateBy, vnp_CreateDate, vnp_IpAddr, vnp_OrderInfo);

            String vnp_SecureHash = vnPayConfig.hmacSHA512(vnPayConfig.getSecretKey(), hash_Data);

            vnp_Params.addProperty("vnp_SecureHash", vnp_SecureHash);

            // Make API call to VNPAY
            URL url = new URL(vnPayConfig.getVnpApiUrl());
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("POST");
            con.setRequestProperty("Content-Type", "application/json");
            con.setDoOutput(true);

            DataOutputStream wr = new DataOutputStream(con.getOutputStream());
            wr.writeBytes(vnp_Params.toString());
            wr.flush();
            wr.close();

            int responseCode = con.getResponseCode();
            log.info("Sending 'POST' request to URL: " + url);
            log.info("Post Data: " + vnp_Params);
            log.info("Response Code: " + responseCode);

            BufferedReader in = new BufferedReader(
                    new InputStreamReader(con.getInputStream()));
            String output;
            StringBuffer response = new StringBuffer();

            while ((output = in.readLine()) != null) {
                response.append(output);
            }
            in.close();

            // Process refund response
            Gson gson = new Gson();
            JsonObject jsonResponse = gson.fromJson(response.toString(), JsonObject.class);
            String vnp_ResponseCode = jsonResponse.get("vnp_ResponseCode").getAsString();

            if ("00".equals(vnp_ResponseCode)) {
                // Update transaction status or create refund transaction
                // This depends on your business logic
                log.info("Refund successful for transaction: " + transaction.getTransactionId());
            } else {
                log.error("Refund failed for transaction: " + transaction.getTransactionId()
                        + ", Response code: " + vnp_ResponseCode);
            }

            return response.toString();

        } catch (Exception e) {
            log.error("Error processing refund", e);
            return "Error: " + e.getMessage();
        }
    }

    private TransactionDTOs.TransactionResponse mapToTransactionResponse(Transaction transaction) {
        return new TransactionDTOs.TransactionResponse(
                transaction.getTransactionId(),
                transaction.getBill().getBillId(),
                transaction.getAmount(),
                transaction.getPaymentMethod(),
                transaction.getTransactionDate(),
                transaction.getStatus(),
                transaction.getCreatedAt()
        );
    }

    private String getClientIp(HttpServletRequest request) {
        String ipAddress;
        try {
            ipAddress = request.getHeader("X-FORWARDED-FOR");
            if (ipAddress == null) {
                ipAddress = request.getRemoteAddr();
            }
        } catch (Exception e) {
            ipAddress = "127.0.0.1";
        }
        return ipAddress;
    }
}