"use client"

import type React from "react"
import { memo, useMemo } from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import type { DateOption } from "../types"
import { colors } from "../../../styles/globalStyles"
import { useFont, fontFamily } from "../../../context/FontContext"

interface DateCardProps {
  date: DateOption
  isSelected: boolean
  onPress: () => void
  showAvailability?: boolean
  availableSlots?: number
}

export const DateCard: React.FC<DateCardProps> = memo(
  ({ date, isSelected, onPress, showAvailability = false, availableSlots = 0 }) => {
    const { fontsLoaded } = useFont()

    const dateInfo = useMemo(() => {
      const today = new Date()
      const cardDate = new Date(date.id) 

      const isToday = cardDate.toDateString() === today.toDateString()
      const isTomorrow = cardDate.toDateString() === new Date(today.getTime() + 24 * 60 * 60 * 1000).toDateString()
      const isPast = cardDate < today && !isToday

      // Auto-disable past dates
      const isDisabled = date.disabled || isPast

      return {
        isToday,
        isTomorrow,
        isPast,
        isDisabled,
        dayName: isToday
          ? "Hôm Nay"
          : isTomorrow
            ? "Ngày mai"
            : cardDate.toLocaleDateString("vi-VN", { weekday: "short" }),
        dayNumber: cardDate.getDate(),
      }
    }, [date.id, date.disabled])

    const getCardStyle = () => {
      if (dateInfo.isDisabled) return [styles.dateCard, styles.disabledDateCard]
      if (isSelected) return [styles.dateCard, styles.selectedDateCard]
      return styles.dateCard
    }

    const getTextStyle = (baseStyle: any) => {
      if (dateInfo.isDisabled) return [baseStyle, styles.disabledText]
      if (isSelected) return [baseStyle, styles.selectedDateText]
      return baseStyle
    }

    const handlePress = () => {
      if (!dateInfo.isDisabled) {
        onPress()
      }
    }

    if (!fontsLoaded) {
      return null
    }

    return (
      <TouchableOpacity
        style={getCardStyle()}
        onPress={handlePress}
        disabled={dateInfo.isDisabled}
        activeOpacity={dateInfo.isDisabled ? 1 : 0.7}
        accessibilityRole="button"
        accessibilityLabel={`${dateInfo.isToday ? "Hôm nay" : dateInfo.isTomorrow ? "Ngày mai" : `${dateInfo.dayName} ${dateInfo.dayNumber}`}${dateInfo.isDisabled ? ", không có sẵn" : ""}`}
        accessibilityState={{
          selected: isSelected,
          disabled: dateInfo.isDisabled,
        }}
      >
        {/* Day name */}
        <Text style={[getTextStyle(styles.dateDay), { fontFamily: fontFamily.regular }]}>{dateInfo.dayName}</Text>

        {/* Date number */}
        <Text style={[getTextStyle(styles.dateNumber), { fontFamily: fontFamily.bold }]}>{dateInfo.dayNumber}</Text>

        {/* Disabled overlay with strikethrough */}
        {dateInfo.isDisabled && (
          <View style={styles.disabledOverlay}>
            <View style={styles.strikethrough} />
          </View>
        )}
      </TouchableOpacity>
    )
  },
)

DateCard.displayName = "DateCard"

const styles = StyleSheet.create({
  dateCard: {
    width: 80,
    height: 100,
    backgroundColor: colors.white,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  selectedDateCard: {
    backgroundColor: colors.primary, 
  },
  disabledDateCard: {
    backgroundColor: "#F5F5F5",
    position: "relative",
  },
  dateDay: {
    fontSize: 14,
    color: "#666666", 
    marginBottom: 8,
    textAlign: "center",
  },
  dateNumber: {
    fontSize: 32,
    color: "#333333", 
    textAlign: "center",
  },
  selectedDateText: {
    color: colors.white,
  },
  disabledText: {
    color: "#999999", 
  },
  disabledOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  strikethrough: {
    position: "absolute",
    width: "80%",
    height: 2,
    backgroundColor: "#7A9EBE",
    transform: [{ rotate: "45deg" }],
  },
})
