export const ValidationMessages = {
  required: (field: string) => `${field} là bắt buộc`,
  minLength: (field: string, min: number) => `${field} phải có ít nhất ${min} ký tự`,
  maxLength: (field: string, max: number) => `${field} không được vượt quá ${max} ký tự`,
  pattern: (field: string) => `${field} không đúng định dạng`,
  phone: "Số điện thoại không hợp lệ (10-11 số)",
  email: "Email không đúng định dạng",
  password: "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số",
  confirmPassword: "Xác nhận mật khẩu không khớp",
  name: "Tên chỉ được chứa chữ cái và khoảng trắng",
  age: "Tuổi phải từ 1 đến 120",
  cccd: "Số CCCD phải có 12 số",
  custom: (message: string) => message,
}

export const Patterns = {
  phone: /^(0[3|5|7|8|9])+([0-9]{8})$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  name: /^[a-zA-ZÀ-ỹ\s]+$/,
  cccd: /^\d{12}$/,
  onlyNumbers: /^\d+$/,
  noSpecialChars: /^[a-zA-Z0-9À-ỹ\s]+$/,
}
