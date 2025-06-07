import type { ThemeConfig } from "antd"

export const theme: ThemeConfig = {
  token: {
    colorPrimary: "#047481",
    colorSuccess: "#12b76a",
    colorWarning: "#f79009",
    colorError: "#f04438",
    colorInfo: "#0ba5ec",
    borderRadius: 8,
    fontFamily: "Gilroy",
    fontSize: 16,
    colorBgContainer: "#ffffff",
    colorBgLayout: "#f8fafc",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    boxShadowSecondary: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  },
  components: {
    Button: {
      colorPrimary: "#047481",
      borderRadius: 8,
      fontWeight: 500,
      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    },
    Table: {
      colorBgContainer: "#ffffff",
      borderRadius: 12,
      headerBg: "#f8fafc",
      headerColor: "#374151",
      fontWeightStrong: 600,
    },
    Card: {
      borderRadius: 16,
      boxShadowTertiary: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    },
    Menu: {
      colorItemBg: "transparent",
      colorItemText: "#6b7280",
      colorItemTextSelected: "#FFFFFF",
      colorItemBgSelected: "#047481",
      colorItemTextHover: "#047481",
      borderRadius: 8,
      itemMarginInline: 4,
    },
    Input: {
      borderRadius: 8,
      colorBorder: "#d1d5db",
      
      
    },
    Select: {
      borderRadius: 8,
      
      optionSelectedBg: "#AFECEF",
      optionActiveBg: "#EDFAFA"
      
    },
    Modal: {
      borderRadius: 16,
    },
  },
}
