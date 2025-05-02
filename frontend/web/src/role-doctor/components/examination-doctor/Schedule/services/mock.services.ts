import type { Appointment } from "../types/schedule.types"

export const generateMockAppointments = (): Appointment[] => {
  // Generate some mock appointments for demonstration
  const today = new Date()
  const appointments: Appointment[] = []

    // Thêm một cuộc hẹn cố định cho hôm nay
    appointments.push({
      id: `appointment-${today.toISOString()}-fixed`,
      title: "Tư vấn sức khỏe",
      description: "P[05] Tư vấn dinh dưỡng",
      startTime: "13:00",
      endTime: "18:00",
      date: new Date(today),
    })

    appointments.push({
      id: `appointment-${today.toISOString()}-fixed`,
      title: "Tư vấn sức khỏe",
      description: "P[05] Tư vấn dinh dưỡng",
      startTime: "07:00",
      endTime: "11:00",
      date: new Date(today),
    })

  // // Generate appointments for the next 30 days
  // for (let i = 0; i < 30; i++) {
  //   const date = new Date()
  //   date.setDate(today.getDate() + i)

  //   // Add morning appointment
  //   if (Math.random() > 0.5) {
  //     appointments.push({
  //       id: `appointment-${date.toISOString()}-1`,
  //       title: "Khám bệnh",
  //       description: "P[08] Dị ứng - Miễn dịch lâm sàng",
  //       startTime: "07:00",
  //       endTime: "11:00",
  //       date: new Date(date),
  //     })
  //   }

  //   // Add afternoon appointment
  //   if (Math.random() > 0.5) {
  //     appointments.push({
  //       id: `appointment-${date.toISOString()}-2`,
  //       title: "Khám bệnh",
  //       description: "P[08] Dị ứng - Miễn dịch lâm sàng",
  //       startTime: "13:00",
  //       endTime: "16:00",
  //       date: new Date(date),
  //     })
  //   }
  // }

  return appointments
}
