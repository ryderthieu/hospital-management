import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import type { AlertButton } from '../context/AlertContext';
import { Ionicons } from '@expo/vector-icons';

interface CustomAlertModalProps {
  visible: boolean;
  title: string;
  message: string;
  buttons?: AlertButton[];
  onClose: (buttonIndex?: number) => void;
}

const getIcon = (title: string) => {
  if (title.toLowerCase().includes('lỗi') || title.toLowerCase().includes('error')) {
    return <Ionicons name="alert-circle" size={48} color="#F44336" style={styles.icon} />;
  }
  if (title.toLowerCase().includes('thành công') || title.toLowerCase().includes('success')) {
    return <Ionicons name="checkmark-circle" size={48} color="#4CAF50" style={styles.icon} />;
  }
  if (title.toLowerCase().includes('cảnh báo') || title.toLowerCase().includes('warning')) {
    return <Ionicons name="warning" size={48} color="#FF9800" style={styles.icon} />;
  }
  return <Ionicons name="information-circle" size={48} color="#00B5B8" style={styles.icon} />;
};

const CustomAlertModal: React.FC<CustomAlertModalProps> = ({ visible, title, message, buttons, onClose }) => {
  const renderButtons = () => {
    if (buttons && buttons.length > 0) {
      return (
        <View style={styles.buttonRow}>
          {buttons.map((btn, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.button, btn.style === 'destructive' && styles.destructiveButton, btn.style === 'cancel' && styles.cancelButton]}
              onPress={() => onClose(idx)}
              activeOpacity={0.8}
            >
              <Text style={[styles.buttonText, btn.style === 'destructive' && styles.destructiveText, btn.style === 'cancel' && styles.cancelText]}>{btn.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }
    // Mặc định chỉ có nút OK
    return (
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={() => onClose(0)} activeOpacity={0.8}>
          <Text style={styles.buttonText}>OK</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {getIcon(title)}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          {renderButtons()}
        </View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get('window');
const MODAL_MARGIN = 32;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  modal: {
    width: width - MODAL_MARGIN * 2,
    marginHorizontal: MODAL_MARGIN,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  icon: {
    marginBottom: 12,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
    color: '#222',
  },
  message: {
    fontSize: 16,
    color: '#444',
    marginBottom: 28,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#00B5B8',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  destructiveButton: {
    backgroundColor: '#F44336',
  },
  destructiveText: {
    color: 'white',
  },
  cancelButton: {
    backgroundColor: '#BDBDBD',
  },
  cancelText: {
    color: '#222',
  },
});

export default CustomAlertModal; 