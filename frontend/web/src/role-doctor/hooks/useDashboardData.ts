"use client"

import { useState, useEffect } from "react"

export const useDashboardData = () => {
  const [patientStats, setPatientStats] = useState({
    total: 0,
    todayAppointments: 0,
    completed: 0,
    testing: 0,
  })

  const [recentPatients, setRecentPatients] = useState<any[]>([])
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([])
  const [todayAppointments, setTodayAppointments] = useState<any[]>([])

  useEffect(() => {
    setPatientStats({
      total: 1248,
      todayAppointments: 24,
      completed: 18,
      testing: 6,
    })

    setRecentPatients([
      {
        id: 1,
        name: "Trần Nhật Trường",
        code: "BN22521396",
        avatar:
          "https://scontent.fsgn22-1.fna.fbcdn.net/v/t39.30808-6/480404053_1006984517940842_142074701260698715_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=r8rFep9IuVYQ7kNvwFjfPpD&_nc_oc=AdkP83gkVNhfVbpKu0-ljcL3QabSF50PJuixSDMIpPOm3ESya0fA9UYxmWi_SYmCoG8iGbQARjWtLuDjIB85epDh&_nc_zt=23&_nc_ht=scontent.fsgn22-1.fna&_nc_gid=2dC9L86bhn3ZNTzRC62APA&oh=00_AfElIn5o44i9rmvFVSmKCtw9BOAVH0AMFy9txWtVa1elOg&oe=6817C0E8",
        date: "21/04/2025",
        status: "completed",
      },
      {
        id: 2,
        name: "Huỳnh Văn Thiệu",
        code: "BN22521397",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        date: "21/04/2025",
        status: "completed",
      },
      {
        id: 3,
        name: "Trần Ngọc Ánh Thơ",
        code: "BN22521398",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        date: "21/04/2025",
        status: "testing",
      },
      {
        id: 4,
        name: "Lê Thiện Nhi",
        code: "BN22521399",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
        date: "21/04/2025",
        status: "pending",
      },
      {
        id: 5,
        name: "Trần Đỗ Phương Nhi",
        code: "BN22521400",
        avatar: "https://randomuser.me/api/portraits/women/65.jpg",
        date: "21/04/2025",
        status: "pending",
      },
    ])

    setUpcomingAppointments([
      {
        id: 1,
        patientName: "Trần Nhật Trường",
        avatar:
          "https://scontent.fsgn22-1.fna.fbcdn.net/v/t39.30808-6/480404053_1006984517940842_142074701260698715_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=r8rFep9IuVYQ7kNvwFjfPpD&_nc_oc=AdkP83gkVNhfVbpKu0-ljcL3QabSF50PJuixSDMIpPOm3ESya0fA9UYxmWi_SYmCoG8iGbQARjWtLuDjIB85epDh&_nc_zt=23&_nc_ht=scontent.fsgn22-1.fna&_nc_gid=2dC9L86bhn3ZNTzRC62APA&oh=00_AfElIn5o44i9rmvFVSmKCtw9BOAVH0AMFy9txWtVa1elOg&oe=6817C0E8",
        date: "21/04/2025",
        time: "09:30",
        status: "confirmed",
      },
      {
        id: 2,
        patientName: "Huỳnh Văn Thiệu",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        date: "21/04/2025",
        time: "10:15",
        status: "confirmed",
      },
      {
        id: 3,
        patientName: "Trần Ngọc Ánh Thơ",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        date: "21/04/2025",
        time: "11:00",
        status: "pending",
      },
      {
        id: 4,
        patientName: "Lê Thiện Nhi",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
        date: "22/04/2025",
        time: "09:00",
        status: "confirmed",
      },
      {
        id: 5,
        patientName: "Trần Đỗ Phương Nhi",
        avatar: "https://randomuser.me/api/portraits/women/65.jpg",
        date: "22/04/2025",
        time: "10:30",
        status: "pending",
      },
    ])

    setTodayAppointments([
      {
        id: 1,
        patientName: "Trần Nhật Trường",
        date: "2025-04-21",
        time: "09:30",
        status: "confirmed",
      },
      {
        id: 2,
        patientName: "Huỳnh Văn Thiệu",
        date: "2025-04-21",
        time: "10:15",
        status: "confirmed",
      },
      {
        id: 3,
        patientName: "Trần Ngọc Ánh Thơ",
        date: "2025-04-21",
        time: "11:00",
        status: "pending",
      },
      {
        id: 4,
        patientName: "Lê Thiện Nhi",
        date: "2025-04-22",
        time: "09:00",
        status: "confirmed",
      },
      {
        id: 5,
        patientName: "Trần Đỗ Phương Nhi",
        date: "2025-04-22",
        time: "10:30",
        status: "pending",
      },
      {
        id: 6,
        patientName: "Nguyễn Văn An",
        date: "2025-04-23",
        time: "14:00",
        status: "confirmed",
      },
      {
        id: 7,
        patientName: "Phạm Thị Bình",
        date: "2025-04-24",
        time: "15:30",
        status: "cancelled",
      },
    ])
  }, [])

  return {
    patientStats,
    recentPatients,
    upcomingAppointments,
    todayAppointments,
  }
}
