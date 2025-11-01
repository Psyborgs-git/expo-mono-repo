import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, ActivityIndicator } from 'react-native';
import Genau, { GenauMessage, GenauConfig } from '@bdt/genau';

/**
 * Example usage of the Genau module
 * 
 * This component demonstrates:
 * - Initializing the LLM
 * - Checking model availability
 * - Generating responses
 * - Streaming responses
 * - Managing conversation history
 */
export default function GenauExample() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [messages, setMessages] = useState<GenauMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeGenau();

    // Subscribe to streaming events
    const streamSubscription = Genau.on('streamChunk', (event) => {
      setStreamingText((prev) => prev + event.data.text);
      
      if (event.data.isComplete) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: streamingText + event.data.text,
          },
        ]);
        setStreamingText('');
        setLoading(false);
      }
    });

    const errorSubscription = Genau.on('streamError', (event) => {
      setError(event.error);
      setLoading(false);
    });

    return () => {
      streamSubscription.remove();
      errorSubscription.remove();
    };
  }, []);

  const initializeGenau = async () => {
    try {
      const config: GenauConfig = {
        // Use appropriate model ID for your platform
        // iOS: 'mlx-community/Llama-3.2-1B-Instruct-4bit'
        // Android: 'gemini-nano'
        modelId: 'gemini-nano',
        maxTokens: 512,
        temperature: 0.7,
        topP: 0.9,
      };

      await Genau.initialize(config);
      setIsInitialized(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize');
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !isInitialized) return;

    const userMessage: GenauMessage = {
      role: 'user',
      content: input.trim(),
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      // Option 1: Non-streaming generation
      const response = await Genau.generate([...messages, userMessage]);
      
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response.text,
        },
      ]);
      setLoading(false);

      // Option 2: Streaming generation (uncomment to use)
      // await Genau.generateStream([...messages, userMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
      setLoading(false);
    }
  };

  const handleClear = async () => {
    setMessages([]);
    setStreamingText('');
    await Genau.clearConversation();
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#f5f5f5' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        Genau LLM Example
      </Text>

      {!isInitialized ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 16 }}>Initializing LLM...</Text>
        </View>
      ) : (
        <>
          <ScrollView 
            style={{ 
              flex: 1, 
              backgroundColor: 'white', 
              padding: 12, 
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            {messages.map((message, index) => (
              <View
                key={index}
                style={{
                  marginBottom: 12,
                  padding: 12,
                  borderRadius: 8,
                  backgroundColor: message.role === 'user' ? '#e3f2fd' : '#f5f5f5',
                }}
              >
                <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>
                  {message.role === 'user' ? 'You' : 'Assistant'}
                </Text>
                <Text>{message.content}</Text>
              </View>
            ))}
            
            {streamingText && (
              <View
                style={{
                  marginBottom: 12,
                  padding: 12,
                  borderRadius: 8,
                  backgroundColor: '#f5f5f5',
                }}
              >
                <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>
                  Assistant (streaming...)
                </Text>
                <Text>{streamingText}</Text>
              </View>
            )}

            {loading && !streamingText && (
              <ActivityIndicator style={{ marginTop: 16 }} />
            )}
          </ScrollView>

          {error && (
            <View
              style={{
                padding: 12,
                backgroundColor: '#ffebee',
                borderRadius: 8,
                marginBottom: 16,
              }}
            >
              <Text style={{ color: '#c62828' }}>{error}</Text>
            </View>
          )}

          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
            <TextInput
              style={{
                flex: 1,
                padding: 12,
                backgroundColor: 'white',
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#ddd',
              }}
              value={input}
              onChangeText={setInput}
              placeholder="Type your message..."
              multiline
              maxLength={500}
              editable={!loading}
            />
            <Button
              title="Send"
              onPress={handleSend}
              disabled={loading || !input.trim()}
            />
          </View>

          <Button
            title="Clear Conversation"
            onPress={handleClear}
            disabled={loading || messages.length === 0}
          />
        </>
      )}
    </View>
  );
}
