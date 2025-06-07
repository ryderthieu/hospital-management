"use client"

import { useState } from "react"
import { useModal } from "../../../hooks/useModal"
import { Modal } from "../../ui/modal"
import Button from "../../ui/button/Button"
import Label from "../../form/Label"
import { FiEdit } from "react-icons/fi"
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa"

export default function UserMetaCard({ doctorData, setDoctorData }) {
  const { isOpen, openModal, closeModal } = useModal()
  const [tempImage, setTempImage] = useState(null)

  const handleSave = () => {
    if (tempImage && setDoctorData) {
      setDoctorData((prev) => ({
        ...prev,
        profileImage: tempImage,
      }))
    }
    console.log("Saving profile changes...")
    closeModal()
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setTempImage(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Fallback data nếu không có doctorData
  const data = doctorData || {
    fullName: "Musharof Chowdhury",
    position: "Team Manager",
    department: "Arizona, United States",
    profileImage: "/images/user/owner.jpg",
  }

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="relative w-24 h-24 overflow-hidden border-2 border-blue-200 rounded-full dark:border-blue-700">
              <img
                src={data.profileImage || "/placeholder.svg?height=96&width=96"}
                alt={data.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-xl font-bold text-center text-blue-800 dark:text-blue-200 xl:text-left">
                {data.fullName}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                {doctorData ? (
                  <>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {data.position}
                    </span>
                    <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {data.department}
                    </span>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{data.position}</p>
                    <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{data.department}</p>
                  </>
                )}
              </div>
              {doctorData && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center xl:text-left">
                  Chuyên khoa: {data.specialty}
                </p>
              )}
            </div>
            {!doctorData && (
              <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
                <a
                  href="https://www.facebook.com/PimjoHQ"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                >
                  <FaFacebookF className="w-5 h-5" />
                </a>

                <a
                  href="https://x.com/PimjoHQ"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                >
                  <FaTwitter className="w-5 h-5" />
                </a>

                <a
                  href="https://www.linkedin.com/company/pimjo"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                >
                  <FaLinkedinIn className="w-5 h-5" />
                </a>

                <a
                  href="https://instagram.com/PimjoHQ"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                >
                  <FaInstagram className="w-5 h-5" />
                </a>
              </div>
            )}
          </div>
          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-1 rounded-full border border-blue-300 bg-white px-4 py-2.5 text-xs font-medium text-blue-700 shadow-sm hover:bg-blue-50 hover:text-blue-800 dark:border-blue-700 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-blue-900/20 lg:inline-flex lg:w-auto lg:min-w-[160px] transition-all duration-200"
          >
            <FiEdit className="w-4 h-4" />
            {doctorData ? "Chỉnh sửa ảnh" : "Edit"}
          </button>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px] m-4">
        <div className="relative w-full p-6 overflow-y-auto bg-white rounded-3xl dark:bg-gray-900">
          <div className="mb-6">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              {doctorData ? "Chỉnh sửa ảnh đại diện" : "Edit Profile Picture"}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {doctorData ? "Tải lên ảnh đại diện mới cho hồ sơ của bạn." : "Upload a new profile picture."}
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 overflow-hidden border-2 border-gray-200 rounded-full dark:border-gray-700">
              <img
                src={tempImage || data.profileImage || "/placeholder.svg?height=128&width=128"}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="w-full">
              <Label>{doctorData ? "Chọn ảnh mới" : "Choose new image"}</Label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
              />
              <p className="mt-1 text-xs text-gray-500">
                {doctorData
                  ? "Định dạng: JPG, JPEG, PNG. Kích thước tối đa: 3MB"
                  : "Formats: JPG, JPEG, PNG. Max size: 3MB"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6 justify-end">
            <Button size="sm" variant="outline" onClick={closeModal}>
              {doctorData ? "Hủy" : "Close"}
            </Button>
            <Button size="sm" onClick={handleSave}>
              {doctorData ? "Lưu thay đổi" : "Save Changes"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}