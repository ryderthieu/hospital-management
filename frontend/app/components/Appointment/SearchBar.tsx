import type React from "react"
import { StyleSheet, View, TextInput, TouchableOpacity } from "react-native"
import { Ionicons, Feather } from "@expo/vector-icons"
import { useFont, fontFamily } from '../../context/FontContext';

interface SearchBarProps {
  placeholder: string
  value?: string
  onSearch?: (text: string) => void
  onFilter?: () => void
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, value = "", onSearch, onFilter }) => {
  const { fontsLoaded } = useFont()
  return (
    <View style={styles.searchContainer}>
      <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        placeholderTextColor="#6B7280"
        value={value}
        onChangeText={onSearch}
      />
      <TouchableOpacity style={styles.filterButton} onPress={onFilter}>
        <Feather name="sliders" size={20} color="#000" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 50,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    fontFamily: fontFamily.regular,
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#000",
  },
  filterButton: {
    padding: 8,
  },
})

export default SearchBar
