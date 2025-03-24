import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  IconButton, 
  Tooltip, 
  // eslint-disable-next-line
  Divider, 
  useTheme, 
  alpha,
  CircularProgress,
  // eslint-disable-next-line
  Button
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { motion, AnimatePresence } from 'framer-motion';
// eslint-disable-next-line
import ReactMarkdown from 'react-markdown';
// eslint-disable-next-line
import remarkGfm from 'remark-gfm';
// eslint-disable-next-line
import rehypeRaw from 'rehype-raw';
// eslint-disable-next-line
import rehypeSanitize from 'rehype-sanitize';
import ChatBubble from './ChatBubble';
import axios from 'axios';

const ChatInterface = ({ documentId, documentName = 'Document' }) => {
  const theme = useTheme();
  const messagesEndRef = useRef(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I'm your document assistant. Ask me anything about "${documentName}".`,
      timestamp: new Date().toISOString(),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
  const chatContainerRef = useRef(null);
  const cancelTokenRef = useRef(null);

  // Initialize speech recognition if supported
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      
      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setInput(transcript);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error', event);
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (isAutoScrollEnabled && messagesEndRef.current) {
      scrollToBottom();
    }
  }, [messages, isAutoScrollEnabled]);

  // Detect scroll position to disable auto-scroll when user scrolls up
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = chatContainer;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setIsAutoScrollEnabled(isNearBottom);
    };

    chatContainer.addEventListener('scroll', handleScroll);
    return () => chatContainer.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const toggleSpeechRecognition = () => {
    if (!recognition) return;
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setError(null);
    
    // Cancel any previous ongoing requests
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel('New message sent');
    }
    
    // Create a new cancel token for this request
    cancelTokenRef.current = axios.CancelToken.source();
    
    try {
      const response = await axios.post(
        `http://localhost:8000/chat/${documentId}/`, 
        { 
          query: input 
        },
        {
          cancelToken: cancelTokenRef.current.token
        }
      );
      
      const responseMessage = {
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date().toISOString(),
        sources: response.data.sources || []
      };
      
      setMessages(prev => [...prev, responseMessage]);
    } catch (err) {
      if (!axios.isCancel(err)) {
        console.error('Error sending message:', err);
        setError('Failed to get a response. Please try again.');
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const stopResponse = () => {
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel('User stopped response');
      setIsTyping(false);
    }
  };

  const handleScrollToBottom = () => {
    scrollToBottom();
    setIsAutoScrollEnabled(true);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
      }}
    >
      {/* Chat Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(10px)',
        }}
      >
        <Typography variant="h6">
          Chat with: {documentName}
        </Typography>
      </Box>
      
      {/* Messages Container */}
      <Box
        ref={chatContainerRef}
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChatBubble message={message} />
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  alignSelf: 'flex-start',
                  p: 2,
                  borderRadius: 2,
                  maxWidth: '80%',
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                }}
              >
                <CircularProgress size={20} thickness={4} sx={{ mr: 2 }} />
                <Typography>AI is thinking...</Typography>
              </Box>
            </motion.div>
          )}
          
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  alignSelf: 'center',
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.error.main, 0.1),
                  color: theme.palette.error.main,
                }}
              >
                <Typography>{error}</Typography>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div ref={messagesEndRef} />
      </Box>
      
      {/* Scroll to Bottom Button (only visible when auto-scroll is disabled) */}
      {!isAutoScrollEnabled && (
        <Box 
          sx={{ 
            position: 'absolute', 
            bottom: 80, 
            right: 20,
            zIndex: 2 
          }}
        >
          <Tooltip title="Scroll to bottom">
            <IconButton
              onClick={handleScrollToBottom}
              sx={{
                backgroundColor: theme.palette.background.paper,
                boxShadow: theme.shadows[3],
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}
      
      {/* Input Area */}
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: alpha(theme.palette.background.paper, 0.9),
          backdropFilter: 'blur(10px)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 1,
          }}
        >
          <TextField
            fullWidth
            placeholder="Ask something about this document..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            multiline
            maxRows={4}
            variant="outlined"
            sx={{
              '.MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: theme.palette.background.default,
              },
            }}
          />
          
          {isTyping ? (
            <Tooltip title="Stop generating">
              <IconButton color="error" onClick={stopResponse}>
                <StopIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <>
              {recognition && (
                <Tooltip title={isListening ? "Stop listening" : "Voice input"}>
                  <IconButton 
                    color={isListening ? "primary" : "default"} 
                    onClick={toggleSpeechRecognition}
                  >
                    {isListening ? <AutorenewIcon className="rotating" /> : <MicIcon />}
                  </IconButton>
                </Tooltip>
              )}
              
              <Tooltip title="Send message">
                <IconButton 
                  color="primary" 
                  onClick={sendMessage} 
                  disabled={!input.trim()}
                >
                  <SendIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default ChatInterface;