"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Modal, SafeAreaView, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { colors } from "../../../styles/globalStyles"
import { useFont, fontFamily } from "../../../context/FontContext"

export interface FilterOptions {
  priceRange?: {
    min: number
    max: number
  }
  rating?: number
  experience?: string
  availability?: "today" | "tomorrow" | "this_week" | "any"
  isOnline?: boolean
}

interface FilterOptionsScreenProps {
  visible: boolean
  onClose: () => void
  selectedFilters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  onApplyFilters: () => void
  onClearFilters: () => void
}

const priceRanges = [
  { id: "any", label: "Tất cả", min: 0, max: 1000000 },
  { id: "low", label: "Dưới 100.000 VND", min: 0, max: 100000 },
  { id: "medium", label: "100.000 - 200.000 VND", min: 100000, max: 200000 },
  { id: "high", label: "Trên 200.000 VND", min: 200000, max: 1000000 },
]

const ratingOptions = [
  { id: "any", label: "Tất cả", value: 0 },
  { id: "4plus", label: "4.0+ sao", value: 4.0 },
  { id: "4.5plus", label: "4.5+ sao", value: 4.5 },
  { id: "4.8plus", label: "4.8+ sao", value: 4.8 },
]

const experienceOptions = [
  { id: "any", label: "Tất cả", value: "" },
  { id: "junior", label: "1-3 năm", value: "1-3" },
  { id: "mid", label: "4-7 năm", value: "4-7" },
  { id: "senior", label: "8-15 năm", value: "8-15" },
  { id: "expert", label: "Trên 15 năm", value: "15+" },
]

const availabilityOptions = [
  { id: "any", label: "Bất kỳ", value: "any" as const },
  { id: "today", label: "Hôm nay", value: "today" as const },
  { id: "tomorrow", label: "Ngày mai", value: "tomorrow" as const },
  { id: "this_week", label: "Tuần này", value: "this_week" as const },
]

export const FilterOptionsScreen: React.FC<FilterOptionsScreenProps> = ({
  visible,
  onClose,
  selectedFilters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters,
}) => {
  const { fontsLoaded } = useFont()
  const [tempFilters, setTempFilters] = useState<FilterOptions>(selectedFilters)

  const handlePriceRangeSelect = (range: { min: number; max: number }) => {
    const newFilters = {
      ...tempFilters,
      priceRange: range.min === 0 && range.max === 1000000 ? undefined : range,
    }
    setTempFilters(newFilters)
  }

  const handleRatingSelect = (rating: number) => {
    const newFilters = {
      ...tempFilters,
      rating: rating === 0 ? undefined : rating,
    }
    setTempFilters(newFilters)
  }

  const handleExperienceSelect = (experience: string) => {
    const newFilters = {
      ...tempFilters,
      experience: experience === "" ? undefined : experience,
    }
    setTempFilters(newFilters)
  }

  const handleAvailabilitySelect = (availability: "today" | "tomorrow" | "this_week" | "any") => {
    const newFilters = {
      ...tempFilters,
      availability: availability === "any" ? undefined : availability,
    }
    setTempFilters(newFilters)
  }

  const handleOnlineToggle = () => {
    const newFilters = {
      ...tempFilters,
      isOnline: tempFilters.isOnline ? undefined : true,
    }
    setTempFilters(newFilters)
  }

  const handleApply = () => {
    onFiltersChange(tempFilters)
    onApplyFilters()
    onClose()
  }

  const handleClear = () => {
    const clearedFilters = {}
    setTempFilters(clearedFilters)
    onFiltersChange(clearedFilters)
    onClearFilters()
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (tempFilters.priceRange) count++
    if (tempFilters.rating) count++
    if (tempFilters.experience) count++
    if (tempFilters.availability) count++
    if (tempFilters.isOnline) count++
    return count
  }

  if (!fontsLoaded) {
    return null
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { fontFamily: fontFamily.bold }]}>Bộ lọc</Text>
          <TouchableOpacity
            onPress={handleClear}
            style={styles.clearButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.clearText, { fontFamily: fontFamily.medium }]}>Xóa tất cả</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Price Range */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { fontFamily: fontFamily.bold }]}>Khoảng giá</Text>
            {priceRanges.map((range) => {
              const isSelected =
                (!tempFilters.priceRange && range.id === "any") ||
                (tempFilters.priceRange?.min === range.min && tempFilters.priceRange?.max === range.max)

              return (
                <TouchableOpacity
                  key={range.id}
                  style={styles.optionItem}
                  onPress={() => handlePriceRangeSelect({ min: range.min, max: range.max })}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.optionLabel, { fontFamily: fontFamily.medium }]}>{range.label}</Text>
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Ionicons name="checkmark" size={20} color={colors.white} />
                    </View>
                  )}
                </TouchableOpacity>
              )
            })}
          </View>

          {/* Experience */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { fontFamily: fontFamily.bold }]}>Kinh nghiệm</Text>
            {experienceOptions.map((option) => {
              const isSelected =
                (!tempFilters.experience && option.value === "") || tempFilters.experience === option.value

              return (
                <TouchableOpacity
                  key={option.id}
                  style={styles.optionItem}
                  onPress={() => handleExperienceSelect(option.value)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.optionLabel, { fontFamily: fontFamily.medium }]}>{option.label}</Text>
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Ionicons name="checkmark" size={20} color={colors.white} />
                    </View>
                  )}
                </TouchableOpacity>
              )
            })}
          </View>

          {/* Availability */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { fontFamily: fontFamily.bold }]}>Thời gian có sẵn</Text>
            {availabilityOptions.map((option) => {
              const isSelected =
                (!tempFilters.availability && option.value === "any") || tempFilters.availability === option.value

              return (
                <TouchableOpacity
                  key={option.id}
                  style={styles.optionItem}
                  onPress={() => handleAvailabilitySelect(option.value)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.optionLabel, { fontFamily: fontFamily.medium }]}>{option.label}</Text>
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Ionicons name="checkmark" size={20} color={colors.white} />
                    </View>
                  )}
                </TouchableOpacity>
              )
            })}
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply} activeOpacity={0.8}>
            <Text style={[styles.applyButtonText, { fontFamily: fontFamily.bold }]}>
              Áp dụng {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    color: colors.text,
    textAlign: "center",
  },
  clearButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  clearText: {
    fontSize: 14,
    color: colors.primary,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  optionLabel: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  ratingOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stars: {
    flexDirection: "row",
    gap: 2,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#00B5B8",
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  applyButton: {
    backgroundColor: "#00B5B8",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 16,
    color: colors.white,
  },
})
