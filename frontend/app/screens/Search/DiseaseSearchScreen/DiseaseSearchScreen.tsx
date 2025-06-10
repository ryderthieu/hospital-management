import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { SearchStackParamList } from "../../../navigation/types";
import { globalStyles, colors } from "../../../styles/globalStyles";
import Header from "../../../components/Header";
import { useFont, fontFamily } from "../../../context/FontContext";

type DiseaseSearchScreenProps = {
  navigation: StackNavigationProp<SearchStackParamList, "DiseaseSearch">;
};

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  suggestions?: string[];
  predictions?: Array<{ disease: string; probability: string; isHighest: boolean }>;
  foundSymptoms?: string[];
  previousSymptoms?: string;
};

const API_URL = "http://192.168.1.47:5000"; // Thay đổi URL này theo địa chỉ server của bạn

type APIResponse = {
  top_3_predictions: Array<{
    disease: string;
    probability: string;
  }>;
  message: string;
  found_symptoms: string[];
};

const formatPredictionsText = (predictions: Array<{disease: string; probability: string}>) => {
  return predictions.map((p, index) => ({
    disease: p.disease,
    probability: p.probability,
    isHighest: index === 0
  }));
};

const callDiseaseAPI = async (text: string): Promise<APIResponse> => {
  try {
    const response = await fetch(`${API_URL}/disease-predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Có lỗi xảy ra khi gọi API');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

const highlightDiseaseInText = (text: string, predictions: Array<{disease: string; probability: string; isHighest: boolean}>) => {
  if (!predictions || predictions.length === 0) return text;

  // Tạo regex pattern từ tất cả tên bệnh, escape các ký tự đặc biệt
  const diseaseNames = predictions.map(p => p.disease.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(`(${diseaseNames.join('|')})`, 'gi');

  const parts = text.split(pattern);
  return parts.map((part, index) => {
    const prediction = predictions.find(p => p.disease.toLowerCase() === part.toLowerCase());
    if (prediction) {
      return (
        <Text key={index} style={[
          styles.highlightedText,
          prediction.isHighest && styles.highestDiseaseText
        ]}>
          {part}
        </Text>
      );
    }
    return part;
  });
};

export const DiseaseSearchScreen: React.FC<DiseaseSearchScreenProps> = ({
  navigation,
}) => {
  const { fontsLoaded } = useFont();
  const [lastSymptoms, setLastSymptoms] = useState<string>("");

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Xin chào! Tôi là trợ lý AI chẩn đoán bệnh. Hãy mô tả các triệu chứng bạn đang gặp phải nhé.",
      isUser: false,
      timestamp: new Date(),
      suggestions: [
        "Tôi bị đau đầu",
        "Tôi bị sốt",
        "Tôi bị ho",
        "Tôi bị đau bụng"
      ]
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const typingAnimation = useRef(new Animated.Value(0)).current;

  const scrollToBottom = () => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnimation, {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnimation, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      typingAnimation.setValue(0);
    }
  }, [isTyping]);

  const renderPredictionCard = (prediction: { disease: string; probability: string; isHighest: boolean }) => (
    <View style={[
      styles.predictionCard,
      prediction.isHighest && styles.highestPredictionCard
    ]}>
      <MaterialCommunityIcons
        name={prediction.isHighest ? "medical-bag" : "doctor"}
        size={24}
        color={prediction.isHighest ? colors.primary : colors.base600}
      />
      <View style={styles.predictionContent}>
        <Text style={[
          styles.predictionDisease,
          prediction.isHighest && styles.highestPredictionDisease
        ]}>
          {prediction.disease}
        </Text>
        <Text style={styles.predictionProbability}>
          Xác suất: {prediction.probability}
        </Text>
      </View>
    </View>
  );

  const getAIResponse = async (userMessage: string): Promise<Message> => {
    try {
      const apiResponse = await callDiseaseAPI(userMessage);
      const predictions = formatPredictionsText(apiResponse.top_3_predictions);
      
      const responseText = apiResponse.message;
      
      let suggestions: string[] = [];
      if (apiResponse.found_symptoms && apiResponse.found_symptoms.length > 0) {
        suggestions = [
          "Có triệu chứng khác",
          "Triệu chứng nặng hơn",
          "Kéo dài bao lâu",
          "Đặt lịch khám"
        ];
      }

      return {
        id: Date.now().toString(),
        text: responseText,
        predictions: predictions,
        foundSymptoms: apiResponse.found_symptoms,
        isUser: false,
        timestamp: new Date(),
        suggestions
      };
    } catch (error) {
      return {
        id: Date.now().toString(),
        text: "Xin lỗi, có lỗi xảy ra khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.",
        isUser: false,
        timestamp: new Date(),
        suggestions: ["Thử lại", "Mô tả triệu chứng khác"]
      };
    }
  };

  const handleSuggestionAction = (suggestion: string) => {
    switch (suggestion) {
      case "Có triệu chứng khác":
        const aiMessage: Message = {
          id: Date.now().toString(),
          text: "Vui lòng cho tôi biết thêm các triệu chứng khác của bạn.",
          isUser: false,
          timestamp: new Date(),
          previousSymptoms: lastSymptoms,
          suggestions: ["Có triệu chứng khác", "Đặt lịch khám"]
        };
        setMessages(prev => [...prev, aiMessage]);
        setInputText("Ngoài ra tôi còn ");
        break;

      case "Đặt lịch khám":
        navigation.getParent()?.navigate('BookAppointment');
        break;

      default:
        setInputText(suggestion);
        setTimeout(() => sendMessage(), 100);
        break;
    }
  };

  const sendMessage = () => {
    if (inputText.trim() === "") return;

    let finalText = inputText.trim();
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && !lastMessage.isUser && lastMessage.previousSymptoms) {
      finalText = `${lastMessage.previousSymptoms}, ${finalText}`;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    setLastSymptoms(finalText);

    getAIResponse(finalText)
      .then(aiResponse => {
        const suggestions = [
          "Có triệu chứng khác",
          "Đặt lịch khám"
        ];
        setMessages(prev => [...prev, { ...aiResponse, suggestions }]);
      })
      .catch(error => {
        Alert.alert("Lỗi", "Không thể kết nối với server. Vui lòng thử lại sau.");
      })
      .finally(() => {
        setIsTyping(false);
      });
  };

  const sendSuggestion = (suggestion: string) => {
    handleSuggestionAction(suggestion);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.isUser ? styles.userMessage : styles.aiMessage
    ]}>
      <View style={[
        styles.messageBubble,
        item.isUser ? styles.userBubble : styles.aiBubble
      ]}>
        <Text style={[
          styles.messageText,
          item.isUser ? styles.userText : styles.aiText
        ]}>
          {item.isUser ? item.text : highlightDiseaseInText(item.text, item.predictions || [])}
        </Text>

        {!item.isUser && item.predictions && (
          <View style={styles.predictionsContainer}>
            {item.predictions.map((prediction, index) => (
              renderPredictionCard(prediction)
            ))}
          </View>
        )}

        {!item.isUser && item.foundSymptoms && (
          <View style={styles.foundSymptomsContainer}>
            <Text style={styles.foundSymptomsTitle}>Các triệu chứng đã tìm thấy:</Text>
            <View style={styles.symptomsGrid}>
              {item.foundSymptoms.map((symptom, index) => (
                <View key={index} style={styles.symptomTag}>
                  <MaterialCommunityIcons name="checkbox-marked-circle" size={16} color={colors.primary} />
                  <Text style={styles.symptomText}>{symptom}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <Text style={[
          styles.timestamp,
          item.isUser ? styles.userTimestamp : styles.aiTimestamp
        ]}>
          {item.timestamp.toLocaleTimeString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
      </View>
      
      {!item.isUser && item.suggestions && (
        <View style={styles.suggestionsContainer}>
          {item.suggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionButton}
              onPress={() => sendSuggestion(suggestion)}
            >
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const renderTypingIndicator = () => (
    <View style={[styles.messageContainer, styles.aiMessage]}>
      <View style={[styles.messageBubble, styles.aiBubble]}>
        <View style={styles.typingIndicator}>
          {[0, 1, 2].map((i) => (
            <Animated.View
              key={i}
              style={[
                styles.typingDot,
                {
                  opacity: typingAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.3, 1],
                  }),
                  transform: [{
                    translateY: typingAnimation.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0, -5, 0],
                    }),
                  }],
                },
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <Header
        title="Chẩn đoán bệnh AI"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showAction={false}
      />

      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToBottom}
          ListFooterComponent={isTyping ? renderTypingIndicator : null}
        />

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Mô tả triệu chứng của bạn..."
              placeholderTextColor={colors.base400}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                inputText.trim() ? styles.sendButtonActive : styles.sendButtonInactive
              ]}
              onPress={sendMessage}
              disabled={!inputText.trim()}
            >
              <Ionicons 
                name="send" 
                size={20} 
                color={inputText.trim() ? "#fff" : colors.base400} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: "flex-end",
  },
  aiMessage: {
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fontFamily.regular,
  },
  userText: {
    color: "#fff",
  },
  aiText: {
    color: colors.base800,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
    fontFamily: fontFamily.light,
  },
  userTimestamp: {
    color: "rgba(255,255,255,0.7)",
    textAlign: "right",
  },
  aiTimestamp: {
    color: colors.base600,
  },
  suggestionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    maxWidth: "80%",
  },
  suggestionButton: {
    backgroundColor: "#e6f7fa",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: colors.primary + "30",
  },
  suggestionText: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: fontFamily.regular,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.base400,
    marginHorizontal: 2,
  },
  inputContainer: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    fontFamily: fontFamily.regular,
    color: colors.base800,
  },
  sendButton: {
    marginLeft: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonActive: {
    backgroundColor: colors.primary,
  },
  sendButtonInactive: {
    backgroundColor: "transparent",
  },
  predictionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.base50,
    borderRadius: 12,
    padding: 12,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: colors.base200,
  },
  highestPredictionCard: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  predictionContent: {
    marginLeft: 12,
    flex: 1,
  },
  predictionDisease: {
    fontSize: 16,
    fontFamily: fontFamily.medium,
    color: colors.base800,
    marginBottom: 4,
  },
  highestPredictionDisease: {
    color: colors.primary,
    fontFamily: fontFamily.bold,
  },
  predictionProbability: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: colors.base600,
  },
  predictionsContainer: {
    marginTop: 12,
    marginBottom: 8,
  },
  foundSymptomsContainer: {
    marginTop: 12,
    marginBottom: 8,
  },
  foundSymptomsTitle: {
    fontSize: 14,
    fontFamily: fontFamily.medium,
    color: colors.base700,
    marginBottom: 8,
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  symptomTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.base50,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    margin: 4,
    borderWidth: 1,
    borderColor: colors.base200,
  },
  symptomText: {
    marginLeft: 4,
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: colors.base700,
  },
  highlightedText: {
    color: colors.primary,
    fontFamily: fontFamily.medium,
    fontSize: 16,
  },
  highestDiseaseText: {
    color: colors.primary,
    fontFamily: fontFamily.bold,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});