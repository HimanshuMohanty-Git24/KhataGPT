import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  TextField, 
  IconButton, 
  Typography, 
  Paper, 
  Avatar,
  CircularProgress,
  useTheme,
  Tooltip,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
  alpha
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import SendIcon from '@mui/icons-material/Send';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import HistoryIcon from '@mui/icons-material/History';
import CancelIcon from '@mui/icons-material/Cancel';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import axios from 'axios';
import chatService from '../../services/chatService';

const ChatInterface = ({ documentId, documentName = "Document" }) => {
  const theme = useTheme();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const cancelTokenRef = useRef(null);
  const chatContainerRef = useRef(null);
  
  // Load chat history when component mounts
  useEffect(() => {
    if (documentId) {
      loadChatHistory();
    }
  }, [documentId]);
  
  // Function to load chat history from backend
  const loadChatHistory = async () => {
    try {
      setIsTyping(true);
      setError(null);
      
      console.log('Loading chat history for document:', documentId);
      const history = await chatService.getChatHistory(documentId);
      console.log('Chat history loaded:', history);
      
      if (history && Array.isArray(history)) {
        // Transform the chat history into the format used by the component
        const formattedMessages = history.map(chat => ({
          role: 'user',
          content: chat.user_message,
          timestamp: chat.created_at,
        })).flatMap((userMessage, index) => {
          // For each user message, add the corresponding AI response if available
          if (history[index] && history[index].ai_response) {
            return [
              userMessage,
              {
                role: 'assistant',
                content: history[index].ai_response,
                timestamp: history[index].created_at,
              }
            ];
          }
          return [userMessage];
        });
        
        setMessages(formattedMessages);
      }
    } catch (err) {
      console.error('Error loading chat history:', err);
      setError('Failed to load chat history. Please try refreshing the page.');
    } finally {
      setIsTyping(false);
    }
  };
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);
  
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };
  
  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setInput('');
    
    // Add user message to chat
    const newMessages = [
      ...messages,
      {
        role: 'user',
        content: userMessage,
        timestamp: new Date().toISOString(),
      }
    ];
    setMessages(newMessages);
    
    // Show typing indicator
    setIsTyping(true);
    setError(null);
    
    try {
      console.log('Sending message to document:', documentId, userMessage);
      
      // Send message to API
      const response = await chatService.sendMessage(documentId, userMessage);
      
      console.log('Received chat response:', response);
      
      // Add AI response to chat
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: response.ai_response || 'I couldn\'t process that request. Please try again.',
          timestamp: new Date().toISOString(),
        }
      ]);
    } catch (err) {
      console.error('Error sending message:', err);
      
      // Add error message to chat
      setError('Failed to get a response. Please try again.');
      setMessages([
        ...newMessages,
        {
          role: 'error',
          content: 'Failed to get a response. Please try again.',
          timestamp: new Date().toISOString(),
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isTyping) {
        sendMessage();
      }
    }
  };
  
  const handleClearChat = async () => {
    try {
      await chatService.clearChatHistory(documentId);
      setMessages([]);
      setClearDialogOpen(false);
    } catch (err) {
      console.error('Error clearing chat history:', err);
      setError('Failed to clear chat history. Please try again.');
    }
  };
  
  // Get the proper avatar for each message type
  const getMessageAvatar = (role) => {
    switch (role) {
      case 'user':
        return (
          <Avatar 
            sx={{ 
              bgcolor: theme.palette.primary.main,
              width: 36,
              height: 36
            }}
          >
            <PersonOutlineIcon />
          </Avatar>
        );
      case 'assistant':
        return (
          <Avatar 
            sx={{ 
              bgcolor: theme.palette.info.main,
              width: 36,
              height: 36
            }}
          >
            <SmartToyOutlinedIcon />
          </Avatar>
        );
      case 'error':
        return (
          <Avatar 
            sx={{ 
              bgcolor: theme.palette.error.main,
              width: 36,
              height: 36
            }}
          >
            <ErrorOutlineIcon />
          </Avatar>
        );
      default:
        return null;
    }
  };
  
  const renderMessages = () => {
    return messages.map((message, index) => {
      const isUser = message.role === 'user';
      const isError = message.role === 'error';
      
      return (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: isUser ? 'row-reverse' : 'row',
              alignItems: 'flex-start',
              mb: 3,
              gap: 1.5,
            }}
          >
            {/* Avatar */}
            {getMessageAvatar(message.role)}
            
            {/* Message content */}
            <Box
              sx={{
                maxWidth: 'calc(100% - 50px)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Message header with role name and timestamp */}
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ 
                  mb: 0.5,
                  textAlign: isUser ? 'right' : 'left'
                }}
              >
                {isUser ? 'You' : isError ? 'Error' : 'AI Assistant'}
                {message.timestamp && (
                  <Typography 
                    component="span" 
                    variant="caption" 
                    color="text.disabled"
                    sx={{ ml: 1 }}
                  >
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                )}
              </Typography>
              
              {/* Message bubble */}
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: isUser 
                    ? alpha(theme.palette.primary.main, 0.9)
                    : isError
                      ? alpha(theme.palette.error.main, 0.9)
                      : alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.8 : 1),
                  color: isUser 
                    ? theme.palette.primary.contrastText 
                    : isError
                      ? theme.palette.error.contrastText
                      : theme.palette.text.primary,
                  border: `1px solid ${isUser 
                    ? alpha(theme.palette.primary.dark, 0.2) 
                    : isError 
                      ? alpha(theme.palette.error.dark, 0.2)
                      : theme.palette.divider}`,
                  width: 'fit-content',
                  maxWidth: '100%',
                  overflowWrap: 'break-word',
                  wordBreak: 'break-word',
                  boxShadow: `0 1px 2px ${alpha(theme.palette.common.black, 0.05)}`,
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 10,
                    [isUser ? 'right' : 'left']: -8,
                    width: 0,
                    height: 0,
                    borderTop: '8px solid transparent',
                    borderBottom: '8px solid transparent',
                    [isUser ? 'borderLeft' : 'borderRight']: isUser 
                      ? `8px solid ${alpha(theme.palette.primary.main, 0.9)}` 
                      : isError
                        ? `8px solid ${alpha(theme.palette.error.main, 0.9)}`
                        : `8px solid ${alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.8 : 1)}`,
                  }
                }}
              >
                {isUser || isError ? (
                  <Typography>{message.content}</Typography>
                ) : (
                  <Box className="markdown-content" sx={{ 
                    '& p': { 
                      mt: 0,
                      mb: 1.5,
                      '&:last-child': { mb: 0 }
                    },
                    '& h1, & h2, & h3, & h4, & h5, & h6': { 
                      mt: 2, 
                      mb: 1,
                      fontWeight: 'bold',
                      lineHeight: 1.2
                    },
                    '& h1': { fontSize: '1.5rem' },
                    '& h2': { fontSize: '1.35rem' },
                    '& h3': { fontSize: '1.2rem' },
                    '& h4': { fontSize: '1.1rem' },
                    '& h5': { fontSize: '1rem' },
                    '& h6': { fontSize: '0.9rem' },
                    '& code': {
                      fontFamily: 'monospace',
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'rgba(0, 0, 0, 0.1)',
                      padding: '2px 4px',
                      borderRadius: '3px',
                      fontSize: '0.9em'
                    },
                    '& pre': {
                      mt: 1,
                      mb: 2,
                      borderRadius: 1,
                      overflow: 'auto',
                      '& code': {
                        backgroundColor: 'transparent',
                        padding: 0
                      }
                    },
                    '& blockquote': {
                      borderLeft: `4px solid ${theme.palette.divider}`,
                      pl: 2,
                      ml: 0,
                      my: 2,
                      fontStyle: 'italic'
                    },
                    '& ul, & ol': {
                      pl: 3,
                      mb: 2
                    },
                    '& table': {
                      borderCollapse: 'collapse',
                      width: '100%',
                      mb: 2
                    },
                    '& th, & td': {
                      border: `1px solid ${theme.palette.divider}`,
                      padding: '8px 12px',
                      textAlign: 'left'
                    },
                    '& th': {
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(0, 0, 0, 0.05)',
                      fontWeight: 'bold'
                    },
                    '& a': {
                      color: theme.palette.primary.main,
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    },
                    '& img': {
                      maxWidth: '100%',
                      borderRadius: 1
                    }
                  }}>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                      components={{
                        code({node, inline, className, children, ...props}) {
                          const match = /language-(\w+)/.exec(className || '')
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={materialDark}
                              language={match[1]}
                              PreTag="div"
                              {...props}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          )
                        }
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </Box>
                )}
              </Paper>
            </Box>
          </Box>
        </motion.div>
      );
    });
  };
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: theme.shadows[2]
      }}
    >
      {/* Chat header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pl: 2.5,
          pr: 1.5,
          py: 1.5,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.mode === 'dark' 
            ? alpha(theme.palette.background.paper, 0.6)
            : theme.palette.background.paper,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar 
            sx={{ 
              bgcolor: theme.palette.info.main,
              width: 32,
              height: 32
            }}
          >
            <SmartToyOutlinedIcon fontSize="small" />
          </Avatar>
          <Box>
            <Typography variant="subtitle1" component="div" sx={{ fontWeight: 600 }}>
              {documentName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {messages.length > 0 
                ? `${messages.filter(m => m.role === 'user').length} messages` 
                : 'Start chatting with your document'}
            </Typography>
          </Box>
        </Box>
        
        <Box>
          <Tooltip title="Clear chat history">
            <span>
              <IconButton 
                color="inherit" 
                size="small"
                onClick={() => setClearDialogOpen(true)}
                disabled={messages.length === 0 || isTyping}
                sx={{ 
                  opacity: messages.length === 0 || isTyping ? 0.5 : 1,
                  '&:hover': {
                    color: theme.palette.error.main
                  }
                }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Reload chat history">
            <span>
              <IconButton 
                color="inherit" 
                size="small"
                onClick={loadChatHistory}
                disabled={isTyping}
                sx={{ 
                  opacity: isTyping ? 0.5 : 1
                }}
              >
                <HistoryIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>
      
      {/* Chat messages container */}
      <Box
        ref={chatContainerRef}
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: theme.palette.mode === 'dark' 
            ? alpha(theme.palette.background.default, 0.7)
            : alpha(theme.palette.grey[50], 0.7),
          backgroundImage: theme.palette.mode === 'dark'
            ? 'radial-gradient(circle at center, rgba(55, 65, 81, 0.05) 0%, rgba(17, 24, 39, 0.05) 100%)'
            : 'radial-gradient(circle at center, rgba(243, 244, 246, 0.5) 0%, rgba(249, 250, 251, 0.5) 100%)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 10px 10px',
        }}
      >
        {messages.length === 0 ? (
          <Box 
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
              p: 3
            }}
          >
            <Avatar 
              sx={{ 
                bgcolor: alpha(theme.palette.info.main, 0.1),
                color: theme.palette.info.main,
                width: 60,
                height: 60,
                mb: 2
              }}
            >
              <SmartToyOutlinedIcon sx={{ fontSize: 30 }} />
            </Avatar>
            <Typography variant="h6" color="text.primary" gutterBottom fontWeight={500}>
              Chat with your document
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
              Ask questions about "{documentName}" and get instant answers based on its content.
            </Typography>
          </Box>
        ) : (
          <>
            {renderMessages()}
            
            {/* Typing indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      mb: 3,
                      gap: 1.5,
                    }}
                  >
                    {/* AI Avatar */}
                    <Avatar 
                      sx={{ 
                        bgcolor: theme.palette.info.main,
                        width: 36,
                        height: 36
                      }}
                    >
                      <SmartToyOutlinedIcon />
                    </Avatar>
                    
                    {/* Typing indicator content */}
                    <Box
                      sx={{
                        maxWidth: 'calc(100% - 50px)',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {/* Role name */}
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mb: 0.5 }}
                      >
                        AI Assistant
                      </Typography>
                      
                      {/* Typing indicator bubble */}
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.8 : 1),
                          border: `1px solid ${theme.palette.divider}`,
                          width: 'fit-content',
                          boxShadow: `0 1px 2px ${alpha(theme.palette.common.black, 0.05)}`,
                          position: 'relative',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 10,
                            left: -8,
                            width: 0,
                            height: 0,
                            borderTop: '8px solid transparent',
                            borderBottom: '8px solid transparent',
                            borderRight: `8px solid ${alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.8 : 1)}`,
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <CircularProgress size={16} thickness={5} color="info" />
                          <Typography>Thinking...</Typography>
                        </Box>
                      </Paper>
                    </Box>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Error message */}
            {error && (
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.error.main, 0.1),
                  border: `1px solid ${theme.palette.error.light}`,
                  color: theme.palette.error.main,
                  mb: 2,
                  maxWidth: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <ErrorOutlineIcon color="error" fontSize="small" />
                <Typography variant="body2">{error}</Typography>
                <IconButton 
                  size="small" 
                  color="error" 
                  onClick={() => setError(null)}
                  sx={{ ml: 'auto', p: 0.5 }}
                >
                  <CancelIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
            
            {/* Dummy div for scrolling to bottom */}
            <div ref={messagesEndRef} />
          </>
        )}
      </Box>
      
      {/* Input area */}
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim() && !isTyping) {
            sendMessage();
          }
        }}
        sx={{
          p: 2,
          backgroundColor: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <TextField
          fullWidth
          placeholder="Type your message..."
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={isTyping}
          multiline
          maxRows={4}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Avatar 
                  sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    width: 28,
                    height: 28
                  }}
                >
                  <PersonOutlineIcon fontSize="small" />
                </Avatar>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Send message">
                  <span>
                    <IconButton
                      type="submit"
                      disabled={!input.trim() || isTyping}
                      color="primary"
                      aria-label="send message"
                      sx={{
                        bgcolor: input.trim() && !isTyping ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                        '&:hover': {
                          bgcolor: input.trim() && !isTyping ? alpha(theme.palette.primary.main, 0.2) : 'transparent',
                        }
                      }}
                    >
                      <SendIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </InputAdornment>
            ),
            sx: {
              pl: 1,
              pr: 1
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              backgroundColor: theme.palette.mode === 'dark' 
                ? alpha(theme.palette.background.default, 0.6)
                : alpha(theme.palette.grey[50], 0.8),
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.light,
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
                borderWidth: 2
              }
            },
          }}
        />
      </Box>
      
      {/* Clear chat confirmation dialog */}
      <Dialog
        open={clearDialogOpen}
        onClose={() => setClearDialogOpen(false)}
        aria-labelledby="clear-chat-dialog-title"
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: theme.shadows[10]
          }
        }}
      >
        <DialogTitle id="clear-chat-dialog-title" sx={{ pb: 1 }}>
          Clear Chat History
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to clear all messages from this chat? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setClearDialogOpen(false)}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleClearChat} 
            color="error" 
            variant="contained"
            disableElevation
            autoFocus
          >
            Clear
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChatInterface;