import React, { createContext, useContext, useState, ReactNode } from 'react';
import CustomAlertModal from '../components/CustomAlertModal';

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

export interface AlertOptions {
  title: string;
  message: string;
  buttons?: AlertButton[];
}

interface AlertContextType {
  showAlert: (options: AlertOptions) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<AlertOptions & { visible: boolean }>({
    visible: false,
    title: '',
    message: '',
    buttons: undefined,
  });

  const showAlert = ({ title, message, buttons }: AlertOptions) => {
    setAlert({ visible: true, title, message, buttons });
  };

  const hideAlert = (buttonIndex?: number) => {
    setAlert((prev) => ({ ...prev, visible: false }));
    if (alert.buttons && typeof buttonIndex === 'number' && alert.buttons[buttonIndex]?.onPress) {
      alert.buttons[buttonIndex].onPress!();
    }
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <CustomAlertModal
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        buttons={alert.buttons}
        onClose={hideAlert}
      />
    </AlertContext.Provider>
  );
}; 