import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
  StyleSheet,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  SearchStackParamList,
} from "../../../navigation/types";
import { globalStyles, colors } from "../../../styles/globalStyles";
import Header from "../../../components/Header";
import { useFont, fontFamily } from "../../../context/FontContext";
import { diagnosisOptions } from "./data";

type DiseaseSearchScreenProps = {
  navigation: StackNavigationProp<SearchStackParamList, "DiseaseSearch">;
};

export const DiseaseSearchScreen: React.FC<DiseaseSearchScreenProps> = ({
  navigation,
}) => {
  const { fontsLoaded } = useFont();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Chọn triệu chứng");

  const toggleOption = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const removeOption = (option: string) => {
    setSelectedOptions(selectedOptions.filter((item) => item !== option));
  };

  const filteredOptions = diagnosisOptions.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderDiagnosisOption = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.optionItem}
      onPress={() => toggleOption(item)}
    >
      <Ionicons
        name={selectedOptions.includes(item) ? "checkbox" : "square-outline"}
        size={20}
        color={
          selectedOptions.includes(item) ? colors.primary : colors.textSecondary
        }
      />
      <Text style={styles.optionText}>{item}</Text>
    </TouchableOpacity>
  );

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
  };

  const renderSelectedOption = ({ item }: { item: string }) => (
    <View style={styles.selectedOptionChip}>
      <Text style={styles.selectedOptionText}>{item}</Text>
      <TouchableOpacity onPress={() => removeOption(item)}>
        <Ionicons name="close" size={16} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={globalStyles.container}>
      <StatusBar barStyle="dark-content" />

      <Header
        title="Chẩn đoán bệnh"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showAction={false}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {selectedOptions.length > 0 && (
          <FlatList
            data={selectedOptions}
            renderItem={renderSelectedOption}
            keyExtractor={(item) => item}
            horizontal
            style={styles.selectedOptionsList}
            contentContainerStyle={styles.selectedOptionsContainer}
            showsHorizontalScrollIndicator={false}
          />
        )}

        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <Text style={styles.dropdownText}>{selectedCategory}</Text>
          <Ionicons
            name={isDropdownOpen ? "chevron-up" : "chevron-down"}
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>

        {isDropdownOpen && (
          <View style={styles.dropdownContainer}>
            <View style={globalStyles.searchInputContainer}>
              <Ionicons name="search" size={20} color={colors.textSecondary} />
              <TextInput
                style={globalStyles.searchInput}
                placeholder="Tìm kiếm triệu chứng"
                placeholderTextColor={colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <FlatList
              data={filteredOptions}
              renderItem={renderDiagnosisOption}
              keyExtractor={(item) => item}
              style={styles.optionsList}
              nestedScrollEnabled={true} // Enable nested scrolling
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  illustrationContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  selectedOptionsList: {
    marginBottom: 16,
  },
  selectedOptionsContainer: {
    flexDirection: "row",
  },
  selectedOptionChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6f7fa",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  selectedOptionText: {
    fontSize: 14,
    color: colors.primary,
    marginRight: 6,
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  dropdownText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  dropdownContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  categoryList: {
    marginBottom: 12,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  categoryItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#e6f7fa",
    marginRight: 8,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    color: colors.primary,
  },
  optionsList: {
    maxHeight: 200,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  optionText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: 8,
  },
});
