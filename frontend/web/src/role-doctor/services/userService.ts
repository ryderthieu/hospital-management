import type { UserProfile } from "../types/user"

export const fetchUserProfile = async (): Promise<UserProfile> => {
  // In a real app, this would be an API call
  return {
    avatarUrl:
      "https://scontent.fsgn22-1.fna.fbcdn.net/v/t39.30808-6/476834381_1003190531653574_2584131049560639925_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=kRwowaTq_nUQ7kNvwFLXVnI&_nc_oc=AdlZyaM6KYA-D1xUt09TCm2lilAx611Gwf3vDki_tTGhebmP2Zflv6kV8-EboluapVw&_nc_zt=23&_nc_ht=scontent.fsgn22-1.fna&_nc_gid=bFVLyXApF0OPekNm0jpXHQ&oh=00_AfFXHHw-lUYlByPwLQ0Om0klhFcZ7i-Hl5KaHD_yaJlKqg&oe=681AC99C",
    lastName: "Nguyễn Thiên",
    firstName: "Tài",
    gender: "Nam",
    dateOfBirth: "05/11/1995",
    address: "Tòa S3.02, Vinhomes Grand Park, Phường Long Thạnh Mỹ, Thành phố Thủ Đức, Thành phố Hồ Chí Minh",
    phoneNumber: "0901 565 563",
    specialization: "Suy tim",
    doctorId: "BS22521584",
    accountType: "Bác sĩ",
    title: "Thạc sĩ Bác sĩ (Ths.BS)",
    department: "Nội tim mạch",
  }
}

export const updateUserProfile = async (profile: UserProfile): Promise<UserProfile> => {
  // In a real app, this would be an API call
  console.log("Updating profile:", profile)
  return profile
}

export const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
  // In a real app, this would be an API call
  console.log("Changing password:", { currentPassword, newPassword })

  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 1000)
  })
}
