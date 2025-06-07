"use client"

import type React from "react"
import { View, Text, TouchableOpacity, StyleSheet, Modal, SafeAreaView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { colors } from "../../../styles/globalStyles"
import { useFont, fontFamily } from "../../../context/FontContext"

export type SortOption = "newest" | "oldest" | "popular" | "price_low_high" | "price_high_low"

interface SortOptionsScreenProps {
  visible: boolean
  onClose: () => void
  selectedSort: SortOption
  onSortSelect: (sort: SortOption) => void
}

const sortOptions = [
  {
    id: "newest" as SortOption,
    label: "Mới nhất",
    description: "Bác sĩ mới tham gia gần đây",
  },
  {
    id: "oldest" as SortOption,
    label: "Cũ nhất",
    description: "Bác sĩ có kinh nghiệm lâu năm",
  },
  {
    id: "popular" as SortOption,
    label: "Nổi bật",
    description: "Bác sĩ được đánh giá cao",
  },
  {
    id: "price_low_high" as SortOption,
    label: "Phí từ thấp đến cao",
    description: "Sắp xếp theo giá tăng dần",
  },
  {
    id: "price_high_low" as SortOption,
    label: "Phí từ cao đến thấp",
    description: "Sắp xếp theo giá giảm dần",
  },
]

export const SortOptionsScreen: React.FC<SortOptionsScreenProps> = ({
  visible,
  onClose,
  selectedSort,
  onSortSelect,
}) => {
  const { fontsLoaded } = useFont()

  const handleSortSelect = (sortOption: SortOption) => {
    onSortSelect(sortOption)
    onClose()
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
          <Text style={[styles.headerTitle, { fontFamily: fontFamily.bold }]}>Sắp xếp theo</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Sort Options */}
        <View style={styles.optionsContainer}>
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionItem}
              onPress={() => handleSortSelect(option.id)}
              activeOpacity={0.7}
            >
              <View style={styles.optionContent}>
                <View style={styles.optionText}>
                  <Text style={[styles.optionLabel, { fontFamily: fontFamily.medium }]}>{option.label}</Text>
                  <Text style={[styles.optionDescription, { fontFamily: fontFamily.regular }]}>
                    {option.description}
                  </Text>
                </View>

                {selectedSort === option.id && (
                  <View style={styles.checkmark}>
                    <Ionicons name="checkmark" size={20} color={colors.white} />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom Safe Area */}
        <View style={styles.bottomSafeArea} />
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
  placeholder: {
    width: 40,
  },
  optionsContainer: {
    flex: 1,
    paddingTop: 24,
  },
  optionItem: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionText: {
    flex: 1,
    marginRight: 16,
  },
  optionLabel: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#00B5B8", 
    justifyContent: "center",
    alignItems: "center",
  },
  bottomSafeArea: {
    height: 34,
    backgroundColor: colors.white,
  },
})
