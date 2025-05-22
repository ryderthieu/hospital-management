"use client";

import { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  View,
  Text,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFont, fontFamily } from "../../context/FontContext";
import { useNavigation } from "@react-navigation/native";
import SegmentedControl from "../../components/Appointment/SegmentedControl";
import SearchBar from "../../components/Appointment/SearchBar";
import AppointmentCard from "../../components/Appointment/AppointmentCard";
import DateFilterModal from "../../components/Appointment/DateFilterModal";
import Header from "../../components/Header";
import { mockAppointments } from "./Data";
import type { Appointment } from "./type";

const AppointmentsScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed">(
    "upcoming"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);
  const insets = useSafeAreaInsets();
  const { fontsLoaded } = useFont();

  useEffect(() => {
    filterAppointments();
  }, [activeTab, searchQuery, startDate, endDate]);

  const filterAppointments = () => {
    const filtered = mockAppointments.filter((appointment) => {
      const matchesTab = appointment.status === activeTab;

      const matchesSearch =
        searchQuery === "" ||
        appointment.doctorName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        appointment.specialty.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesDateRange = true;
      if (startDate && endDate) {
        const appointmentDate = new Date(
          appointment.date.split(", ")[1].replace(/\//g, "-")
        );
        matchesDateRange =
          appointmentDate >= startDate && appointmentDate <= endDate;
      }

      return matchesTab && matchesSearch && matchesDateRange;
    });

    setFilteredAppointments(filtered);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleFilter = () => {
    setShowFilterModal(true);
  };

  const handleApplyFilter = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const renderDateFilterInfo = () => {
    if (!startDate || !endDate) return null;

    const formatDate = (date: Date) => {
      return `${date.getDate().toString().padStart(2, "0")}/${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}/${date.getFullYear()}`;
    };

    return (
      <View style={styles.filterInfoContainer}>
        <Text style={styles.filterInfoText}>
          Lọc từ {formatDate(startDate)} đến {formatDate(endDate)}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" />
      <Header
        title="Lịch khám"
        showBack={false}
        showAction={true}
        actionType="notification"
        onActionPress={() => navigation.navigate("Notifications")}
      />
      <View style={[styles.header, { paddingTop: insets.top > 0 ? 0 : 16 }]}>
        <SegmentedControl
          options={[
            { label: "Sắp đến", value: "upcoming" },
            { label: "Đã khám", value: "completed" },
          ]}
          selectedValue={activeTab}
          onChange={(value) => setActiveTab(value as "upcoming" | "completed")}
        />

        <SearchBar
          placeholder="Tìm bác sĩ tim mạch"
          onSearch={handleSearch}
          onFilter={handleFilter}
        />

        {renderDateFilterInfo()}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không tìm thấy lịch khám nào</Text>
          </View>
        )}
      </ScrollView>

      <DateFilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleApplyFilter}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: "#F3F4F6",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 8,
  },
  filterInfoContainer: {
    backgroundColor: "#E6F7F7",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  filterInfoText: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: "#0BC5C5",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: "#6B7280",
  },
});

export default AppointmentsScreen;
