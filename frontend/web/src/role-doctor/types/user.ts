export interface UserProfile {
  avatarUrl: string
  lastName: string
  firstName: string
  gender: string
  dateOfBirth: string
  address: string
  phoneNumber: string
  accountType: string
  specialization: string
  doctorId: string
  title: string
  department: string
}

export interface PasswordChangeFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}
