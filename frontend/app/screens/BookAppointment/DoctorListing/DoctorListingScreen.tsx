"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView } from "react-native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RouteProp } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import type { RootStackParamList, Doctor } from "../types"
import { globalStyles, colors } from "../../../styles/globalStyles"
import Header from "../../../components/Header"
import { DoctorCard } from "./DoctorCard"
import { SortOptionsScreen, type SortOption } from "./SortOptionsScreen"
import { FilterOptionsScreen, type FilterOptions } from "./FilterOptionsScreen"
import { doctors } from "../data"
import { useFont, fontFamily } from "../../../context/FontContext"

type DoctorListScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "DoctorList">
  route: RouteProp<RootStackParamList, "DoctorList">
}

export const DoctorListScreen: React.FC<DoctorListScreenProps> = ({ navigation, route }) => {
  const { fontsLoaded } = useFont()
  const { specialty } = route.params

  const [sortModalVisible, setSortModalVisible] = useState(false)
  const [filterModalVisible, setFilterModalVisible] = useState(false)
  const [selectedSort, setSelectedSort] = useState<SortOption>("popular")
  const [selectedFilters, setSelectedFilters] = useState<FilterOptions>({})
  const [favorites, setFavorites] = useState<string[]>([])

  // Filter doctors by specialty and filters
  const filteredDoctors = useMemo(() => {
    let filtered = doctors.filter((doctor) => doctor.specialty === specialty)

    // Apply price range filter
    if (selectedFilters.priceRange) {
      filtered = filtered.filter((doctor) => {
        const price = Number.parseInt(doctor.price.replace(/[^\d]/g, ""))
        return price >= selectedFilters.priceRange!.min && price <= selectedFilters.priceRange!.max
      })
    }

    // Apply rating filter
    if (selectedFilters.rating) {
      filtered = filtered.filter((doctor) => (doctor.rating || 0) >= selectedFilters.rating!)
    }

    // Apply experience filter
    if (selectedFilters.experience) {
      filtered = filtered.filter((doctor) => {
        if (!doctor.experience) return false
        const experienceYears = Number.parseInt(doctor.experience.replace(/[^\d]/g, ""))

        switch (selectedFilters.experience) {
          case "1-3":
            return experienceYears >= 1 && experienceYears <= 3
          case "4-7":
            return experienceYears >= 4 && experienceYears <= 7
          case "8-15":
            return experienceYears >= 8 && experienceYears <= 15
          case "15+":
            return experienceYears > 15
          default:
            return true
        }
      })
    }

    // Apply online status filter
    if (selectedFilters.isOnline) {
      filtered = filtered.filter((doctor) => doctor.isOnline)
    }

    // Apply availability filter (mock implementation)
    if (selectedFilters.availability) {
      // In real app, this would check actual availability
      // For now, just return all doctors
      filtered = filtered
    }

    return filtered
  }, [specialty, selectedFilters])

  // Sort doctors based on selected option
  const sortedDoctors = useMemo(() => {
    const sorted = [...filteredDoctors]

    switch (selectedSort) {
      case "newest":
        return sorted.sort((a, b) => new Date(b.joinDate || "").getTime() - new Date(a.joinDate || "").getTime())
      case "oldest":
        return sorted.sort((a, b) => new Date(a.joinDate || "").getTime() - new Date(b.joinDate || "").getTime())
      case "popular":
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      case "price_low_high":
        return sorted.sort((a, b) => {
          const priceA = Number.parseInt(a.price.replace(/[^\d]/g, ""))
          const priceB = Number.parseInt(b.price.replace(/[^\d]/g, ""))
          return priceA - priceB
        })
      case "price_high_low":
        return sorted.sort((a, b) => {
          const priceA = Number.parseInt(a.price.replace(/[^\d]/g, ""))
          const priceB = Number.parseInt(b.price.replace(/[^\d]/g, ""))
          return priceB - priceA
        })
      default:
        return sorted
    }
  }, [filteredDoctors, selectedSort])

  const handleDoctorPress = (doctor: Doctor) => {
    navigation.navigate("BookAppointment", { doctor })
  }

  const handleFavoritePress = (doctorId: string) => {
    setFavorites((prev) => (prev.includes(doctorId) ? prev.filter((id) => id !== doctorId) : [...prev, doctorId]))
  }

  const handleSortPress = () => {
    setSortModalVisible(true)
  }

  const handleFilterPress = () => {
    setFilterModalVisible(true)
  }

  const handleSortSelect = (sort: SortOption) => {
    setSelectedSort(sort)
  }

  const handleFiltersChange = (filters: FilterOptions) => {
    setSelectedFilters(filters)
  }

  const handleApplyFilters = () => {
    // Filters are already applied through useMemo
  }

  const handleClearFilters = () => {
    setSelectedFilters({})
  }

  const getSortLabel = (sort: SortOption): string => {
    switch (sort) {
      case "newest":
        return "Mới nhất"
      case "oldest":
        return "Cũ nhất"
      case "popular":
        return "Nổi bật"
      case "price_low_high":
        return "Giá thấp → cao"
      case "price_high_low":
        return "Giá cao → thấp"
      default:
        return "Nổi bật"
    }
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (selectedFilters.priceRange) count++
    if (selectedFilters.rating) count++
    if (selectedFilters.experience) count++
    if (selectedFilters.availability) count++
    if (selectedFilters.isOnline) count++
    return count
  }

  const renderDoctorItem = ({ item }: { item: Doctor }) => (
    <DoctorCard
      doctor={item}
      onPress={() => handleDoctorPress(item)}
      isFavorite={favorites.includes(item.id)}
      onFavoritePress={() => handleFavoritePress(item.id)}
      showStatus={true}
      isOnline={item.isOnline || Math.random() > 0.3} // Use actual online status or mock
    />
  )

  if (!fontsLoaded) {
    return null
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      {/* Header */}
      <Header title={`Bác sĩ ${specialty}`} showBack={true} onBackPress={() => navigation.goBack()} />

      {/* Filter and Sort Bar */}
      <View style={styles.filterSortBar}>
        <View style={styles.resultCount}>
          <Text style={[styles.resultText, { fontFamily: fontFamily.medium }]}>{sortedDoctors.length} bác sĩ</Text>
        </View>

        <View style={styles.actionButtons}>
          {/* Filter Button */}
          <TouchableOpacity onPress={handleFilterPress} style={styles.actionButton} activeOpacity={0.7}>
            <Ionicons name="options-outline" size={18} color={colors.text} />
            <Text style={[styles.actionText, { fontFamily: fontFamily.medium }]}>
              Lọc {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
            </Text>
          </TouchableOpacity>

          {/* Sort Button */}
          <TouchableOpacity onPress={handleSortPress} style={styles.actionButton} activeOpacity={0.7}>
            <Ionicons name="funnel-outline" size={18} color={colors.text} />
            <Text style={[styles.actionText, { fontFamily: fontFamily.medium }]}>{getSortLabel(selectedSort)}</Text>
            <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Doctor List */}
      <FlatList
        data={sortedDoctors}
        renderItem={renderDoctorItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
      />

      {/* Sort Modal */}
      <SortOptionsScreen
        visible={sortModalVisible}
        onClose={() => setSortModalVisible(false)}
        selectedSort={selectedSort}
        onSortSelect={handleSortSelect}
      />

      {/* Filter Modal */}
      <FilterOptionsScreen
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        selectedFilters={selectedFilters}
        onFiltersChange={handleFiltersChange}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  filterSortBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resultCount: {
    flex: 1,
  },
  resultText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.base50,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionText: {
    fontSize: 14,
    color: colors.text,
  },
  listContainer: {
    padding: 16,
  },
  listSeparator: {
    height: 12,
  },
})
