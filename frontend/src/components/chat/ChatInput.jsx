import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  IconButton, 
  Tooltip, 
  CircularProgress, 
  useTheme, 
  alpha 
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';

const ChatInput = ({ 
  onSendMessage, 
  isLoading = false, 
  onStop, 
  disableAttachments = true,
  placeholder = "Type your message..." 
}) => {
  const theme = useTheme();
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const inputRef = useRef(null);
  
  // Initialize speech recognition if supported by browser
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
        
        setMessage(transcript);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error', event);
        setIsRecording(false);
      };
      
      recognitionInstance.onend = () => {
        setIsRecording(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);
  
  const handleChange = (e) => {
    setMessage(e.target.value);
  };
  
  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
      
      // Focus the input after sending
      setTimeout(() => {
        inputRef.current?.focus();
      }, 10);
    }
  };
  
  const handleKeyDown = (e) => {
    // Send message on Enter without shift key
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  
  const toggleRecording = () => {
    if (!recognition) return;
    
    if (isRecording) {
      recognition.stop();
    } else {
      setMessage('');
      recognition.start();
    }
    
    setIsRecording(!isRecording);
  };
  
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 1,
        width: '100%',
        position: 'relative',
      }}
    >
      {/* Attachment button (disabled by default) */}
      {!disableAttachments && (
        <Tooltip title="Attach file">
          <IconButton 
            color="primary"
            sx={{ height: 40, width: 40 }}
            disabled
          >
            <AttachFileIcon />
          </IconButton>
        </Tooltip>
      )}
      
      {/* Message input */}
      <TextField
        fullWidth
        multiline
        maxRows={4}
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        inputRef={inputRef}
        disabled={isLoading}
        variant="outlined"
        sx={{
          '.MuiOutlinedInput-root': {
            borderRadius: 3,
            backgroundColor: theme.palette.mode === 'dark' 
              ? alpha(theme.palette.background.paper, 0.6) 
              : theme.palette.background.paper,
            pr: 1,
          },
        }}
        InputProps={{
          endAdornment: (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              {!isLoading && (
                <>
                  {/* Emoji button (placeholder for future implementation) */}
                  <Tooltip title="Add emoji">
                    <IconButton 
                      color="primary"
                      size="small"
                      disabled
                    >
                      <EmojiEmotionsOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  
                  {/* Voice input button */}
                  {recognition && (
                    <Tooltip title={isRecording ? "Stop recording" : "Voice input"}>
                      <IconButton
                        color={isRecording ? "error" : "primary"}
                        size="small"
                        onClick={toggleRecording}
                      >
                        <MicIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </>
              )}
            </Box>
          ),
        }}
      />
      
      {/* Send/Stop button */}
      {isLoading ? (
        <Tooltip title="Stop generating">
          <IconButton 
            color="error" 
            onClick={onStop}
            sx={{
              height: 40,
              width: 40,
              backgroundColor: alpha(theme.palette.error.main, 0.1),
              '&:hover': {
                backgroundColor: alpha(theme.palette.error.main, 0.2),
              }
            }}
          >
            <StopIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Send message">
          <span>
            <IconButton
              color="primary"
              type="submit"
              disabled={!message.trim()}
              sx={{
                height: 40,
                width: 40,
                backgroundColor: message.trim() ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                '&:hover': {
                  backgroundColor: message.trim() ? alpha(theme.palette.primary.main, 0.2) : 'transparent',
                }
              }}
            >
              <SendIcon />
            </IconButton>
          </span>
        </Tooltip>
      )}
    </Box>
  );
};

export default ChatInput;