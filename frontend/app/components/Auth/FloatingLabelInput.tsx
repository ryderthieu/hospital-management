import React, { useState, useEffect } from 'react';
import { View, TextInput, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFont, fontFamily } from '../../context/FontContext';

type FloatingLabelInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  iconName: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  showPasswordToggle?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
};

const FloatingLabelInput = ({
  value,
  onChangeText,
  placeholder,
  iconName,
  secureTextEntry = false,
  keyboardType = 'default',
  showPasswordToggle = false,
  autoCapitalize = 'none',
}: FloatingLabelInputProps) => {
  const { fontsLoaded } = useFont();
  if (!fontsLoaded) return null;

  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(!secureTextEntry);
  const [labelAnim] = useState(new Animated.Value(value ? 1 : 0));

  const animateLabel = (toValue: number) => {
    Animated.timing(labelAnim, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    if (value) {
      animateLabel(1);
    }
  }, []);

  return (
    <View style={styles.inputContainer}>
      <View style={[styles.inputWrapper, isFocused && styles.inputWrapperFocused]}>
        <Ionicons
          name={iconName as any}
          size={20}
          color={isFocused ? '#00B5B8' : '#8A8A8A'}
          style={styles.inputIcon}
        />
        <View style={styles.inputBox}>
          <Animated.Text
            style={[
              styles.floatingLabel,
              {
                top: labelAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [18, 0],
                }),
                fontSize: labelAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [16, 12],
                }),
                color: isFocused ? '#00B5B8' : '#8A8A8A',
              },
            ]}
          >
            {placeholder}
          </Animated.Text>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={(text) => {
              onChangeText(text);
              if (text) {
                animateLabel(1);
              } else if (!isFocused) {
                animateLabel(0);
              }
            }}
            onFocus={() => {
              setIsFocused(true);
              animateLabel(1);
            }}
            onBlur={() => {
              setIsFocused(false);
              if (!value) {
                animateLabel(0);
              }
            }}
            secureTextEntry={secureTextEntry && !showPassword}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
          />
        </View>
        {showPasswordToggle && (
          <Ionicons
            name={showPassword ? 'eye-outline' : 'eye-off-outline'}
            size={22}
            color='#8A8A8A'
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 25,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 8,
    position: 'relative',
    height: 50,
  },
  inputWrapperFocused: {
    borderBottomColor: '#00B5B8',
  },
  inputIcon: {
    marginRight: 10,
  },
  inputBox: {
    flex: 1,
    position: 'relative',
    height: 50,
    justifyContent: 'flex-end',
  },
  floatingLabel: {
    position: 'absolute',
    left: 0,
    color: '#8A8A8A',
    fontSize: 16,
    fontFamily: fontFamily.regular,
  },
  input: {
    fontFamily: fontFamily.medium,
    width: '100%',
    fontSize: 16,
    color: '#2B2B2B',
    paddingVertical: 5,
  },
  eyeIcon: {
    padding: 5,
  },
});

export { FloatingLabelInput };