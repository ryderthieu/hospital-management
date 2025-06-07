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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
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
};

export const DiseaseSearchScreen: React.FC<DiseaseSearchScreenProps> = ({
  navigation,
}) => {
  const { fontsLoaded } = useFont();
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

  const scrollToBottom = () => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateAIResponse = (userMessage: string): Message => {
    // Simple AI response simulation
    let responseText = "";
    let suggestions: string[] = [];

    if (userMessage.toLowerCase().includes("đau đầu")) {
      responseText = "Bạn bị đau đầu. Có thể do căng thẳng, thiếu ngủ hoặc các nguyên nhân khác. Bạn có các triệu chứng kèm theo nào không?";
      suggestions = ["Có buồn nôn", "Không có triệu chứng khác", "Có chóng mặt", "Đau từ mấy ngày"];
    } else if (userMessage.toLowerCase().includes("sốt")) {
      responseText = "Bạn bị sốt bao nhiều độ? Có các triệu chứng kèm theo như ho, đau họng không?";
      suggestions = ["Sốt 38-39 độ", "Có ho khô", "Có đau họng", "Không đo được"];
    } else if (userMessage.toLowerCase().includes("ho")) {
      responseText = "Bạn ho đã bao lâu? Ho có đờm hay ho khô?";
      suggestions = ["Ho khô", "Ho có đờm", "Ho từ 2-3 ngày", "Ho kéo dài"];
    } else if (userMessage.toLowerCase().includes("đau bụng")) {
      responseText = "Đau bụng ở vị trí nào? Đau liên tục hay từng cơn?";
      suggestions = ["Đau bụng trên", "Đau bụng dưới", "Đau từng cơn", "Đau liên tục"];
    } else {
      responseText = "Tôi hiểu rồi. Bạn có thể mô tả thêm chi tiết về triệu chứng này không? Ví dụ: thời gian xuất hiện, mức độ nghiêm trọng...";
      suggestions = ["Triệu chứng nhẹ", "Triệu chứng nặng", "Mới xuất hiện", "Đã lâu rồi"];
    }

    return {
      id: Date.now().toString(),
      text: responseText,
      isUser: false,
      timestamp: new Date(),
      suggestions
    };
  };

  const sendMessage = () => {
    if (inputText.trim() === "") return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = simulateAIResponse(inputText.trim());
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const sendSuggestion = (suggestion: string) => {
    setInputText(suggestion);
    setTimeout(() => sendMessage(), 100);
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
          {item.text}
        </Text>
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
          <View style={[styles.typingDot, { animationDelay: '0ms' }]} />
          <View style={[styles.typingDot, { animationDelay: '150ms' }]} />
          <View style={[styles.typingDot, { animationDelay: '300ms' }]} />
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
              placeholderTextColor={colors.textSecondary}
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
                color={inputText.trim() ? "#fff" : colors.textSecondary} 
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
    color: colors.textPrimary,
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
    color: colors.textSecondary,
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
    flexDirection: "row",
    alignItems: "center",
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textSecondary,
    marginHorizontal: 2,
    // Note: Animation would need to be implemented with Animated API
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
    color: colors.textPrimary,
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
});