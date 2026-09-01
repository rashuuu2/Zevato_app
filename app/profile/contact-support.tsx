import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Modal, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import Header from '@/components/common/Header';
import Button from '@/components/common/Button';
import ProfileMenuItem from '@/components/profile/ProfileMenuItem';

import { colors } from '@/constants/colors';
import { config } from '@/constants/config';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  time: string;
}

export default function ContactSupportScreen() {
  const [chatVisible, setChatVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'agent',
      text: 'Hello! Welcome to Zevota Priority Support. How can we help you with your appliance service today?',
      time: 'Just now',
    },
  ]);

  const handleCall = () => {
    Alert.alert('Calling Support', `Dialing ${config.supportPhone}...`);
  };

  const handleEmail = () => {
    Alert.alert('Email Support', `Opening email client to ${config.supportEmail}...`);
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: 'user',
      text: inputText.trim(),
      time: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = inputText;
    setInputText('');

    // Simulate Agent Auto-Reply
    setTimeout(() => {
      const agentReply: ChatMessage = {
        id: `m-${Date.now() + 1}`,
        sender: 'agent',
        text: `Thank you for reaching out regarding "${currentInput.slice(0, 30)}...". Our customer delight specialist has been notified and will assist you shortly.`,
        time: 'Just now',
      };
      setMessages((prev) => [...prev, agentReply]);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Contact Support" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Need Immediate Assistance?</Text>
        <Text style={styles.subtitle}>Our customer delight team is available 24/7 for support.</Text>

        <ProfileMenuItem
          icon="call-outline"
          title="Toll-Free Phone Support"
          subtitle={config.supportPhone}
          onPress={handleCall}
        />

        <ProfileMenuItem
          icon="mail-outline"
          title="Email Support"
          subtitle={config.supportEmail}
          onPress={handleEmail}
        />

        <Button
          title="Start Live Support Chat"
          variant="primary"
          size="large"
          onPress={() => setChatVisible(true)}
          style={styles.btn}
        />
      </ScrollView>

      {/* Live Support Chat Modal */}
      <Modal visible={chatVisible} animationType="slide" transparent>
        <SafeAreaView style={styles.chatOverlay} edges={['top', 'bottom']}>
          <View style={styles.chatHeader}>
            <View style={styles.agentInfo}>
              <View style={styles.avatarCircle}>
                <Ionicons name="headset-outline" size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.agentName}>Zevota Care Agent</Text>
                <Text style={styles.agentStatus}>Online • 24/7 Support</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setChatVisible(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.chatBody} contentContainerStyle={styles.chatContent}>
            {messages.map((m) => (
              <View
                key={m.id}
                style={[
                  styles.msgBubble,
                  m.sender === 'user' ? styles.userBubble : styles.agentBubble,
                ]}
              >
                <Text
                  style={[
                    styles.msgText,
                    m.sender === 'user' ? styles.userMsgText : styles.agentMsgText,
                  ]}
                >
                  {m.text}
                </Text>
                <Text
                  style={[
                    styles.msgTime,
                    m.sender === 'user' ? styles.userMsgTime : styles.agentMsgTime,
                  ]}
                >
                  {m.time}
                </Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.chatFooter}>
            <TextInput
              style={styles.chatInput}
              placeholder="Type your message..."
              placeholderTextColor={colors.textMuted}
              value={inputText}
              onChangeText={setInputText}
            />
            <TouchableOpacity style={styles.sendBtn} onPress={handleSendMessage}>
              <Ionicons name="send" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.heading,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  btn: {
    marginTop: spacing.xl,
  },
  chatOverlay: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  agentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  agentName: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  agentStatus: {
    fontSize: typography.fontSize.xs,
    color: colors.success,
  },
  chatBody: {
    flex: 1,
    backgroundColor: colors.background,
  },
  chatContent: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  msgBubble: {
    maxWidth: '80%',
    padding: spacing.sm + 2,
    borderRadius: spacing.radiusMd,
  },
  agentBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
  },
  msgText: {
    fontSize: typography.fontSize.xs + 1,
  },
  agentMsgText: {
    color: colors.text,
  },
  userMsgText: {
    color: '#FFFFFF',
  },
  msgTime: {
    fontSize: typography.fontSize.xs - 2,
    marginTop: 4,
    textAlign: 'right',
  },
  agentMsgTime: {
    color: colors.textMuted,
  },
  userMsgTime: {
    color: '#E0E0E0',
  },
  chatFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.xs,
  },
  chatInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: spacing.radiusMd,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs + 2,
    fontSize: typography.fontSize.sm,
    color: colors.text,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
