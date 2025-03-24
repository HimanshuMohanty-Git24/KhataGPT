import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Collapse, Tooltip, 
  useTheme, alpha, 
  Paper 
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CheckIcon from '@mui/icons-material/Check';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

// Helper function to format time
const formatTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ChatBubble = ({ message }) => {
  const theme = useTheme();
  const [copied, setCopied] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const isUser = message.role === 'user';
  const hasSources = message.sources && message.sources.length > 0;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const toggleSources = () => {
    setShowSources(!showSources);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start',
        maxWidth: '100%',
        mb: 2,
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 0.5,
          pl: isUser ? 0 : 1,
          pr: isUser ? 1 : 0
        }}
      >
        <Box
          sx={{
            backgroundColor: isUser 
              ? alpha(theme.palette.primary.main, 0.1) 
              : alpha(theme.palette.secondary.main, 0.1),
            borderRadius: '50%',
            width: 28,
            height: 28,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mr: 1,
          }}
        >
          {isUser ? (
            <PersonIcon fontSize="small" color="primary" />
          ) : (
            <SmartToyIcon fontSize="small" color="secondary" />
          )}
        </Box>
        <Typography variant="body2" color="textSecondary">
          {isUser ? 'You' : 'KhathaGPT'}
        </Typography>
        <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
          {formatTime(message.timestamp)}
        </Typography>
      </Box>
      
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          maxWidth: '85%',
        }}
      >
        <Paper
          elevation={1}
          sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: isUser 
              ? alpha(theme.palette.primary.main, 0.08) 
              : theme.palette.background.default,
            border: `1px solid ${isUser 
              ? alpha(theme.palette.primary.main, 0.2) 
              : theme.palette.divider}`,
            maxWidth: '100%',
            position: 'relative',
            '& pre': {
              backgroundColor: theme.palette.mode === 'dark' 
                ? alpha('#000', 0.3) 
                : alpha('#f5f5f5', 0.8),
              padding: '12px',
              borderRadius: '4px',
              overflowX: 'auto',
              '& code': {
                fontFamily: 'monospace',
              },
            },
            '& code': {
              backgroundColor: theme.palette.mode === 'dark' 
                ? alpha('#000', 0.3) 
                : alpha('#f5f5f5', 0.8),
              padding: '2px 4px',
              borderRadius: '4px',
              fontFamily: 'monospace',
            },
            '& a': {
              color: theme.palette.primary.main,
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
            '& table': {
              borderCollapse: 'collapse',
              width: '100%',
              marginBottom: '16px',
              '& th, & td': {
                border: `1px solid ${theme.palette.divider}`,
                padding: '8px',
                textAlign: 'left',
              },
              '& th': {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                fontWeight: 'bold',
              },
            },
            '& ul, & ol': {
              paddingLeft: '24px',
              marginBottom: '16px',
            },
            '& blockquote': {
              borderLeft: `4px solid ${theme.palette.primary.main}`,
              margin: '0 0 16px',
              padding: '0 16px',
              color: theme.palette.text.secondary,
            },
          }}
        >
          <Box sx={{ maxWidth: '100%', overflowWrap: 'break-word', wordWrap: 'break-word' }}>
            <ReactMarkdown
              children={message.content}
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
              components={{
                p: ({ node, ...props }) => <Typography variant="body1" gutterBottom {...props} />,
                h1: ({ node, ...props }) => <Typography variant="h5" gutterBottom {...props} />,
                h2: ({ node, ...props }) => <Typography variant="h6" gutterBottom {...props} />,
                h3: ({ node, ...props }) => <Typography variant="subtitle1" fontWeight="bold" gutterBottom {...props} />,
                h4: ({ node, ...props }) => <Typography variant="subtitle2" fontWeight="bold" gutterBottom {...props} />,
                h5: ({ node, ...props }) => <Typography variant="body1" fontWeight="bold" gutterBottom {...props} />,
                h6: ({ node, ...props }) => <Typography variant="body2" fontWeight="bold" gutterBottom {...props} />,
              }}
            />
          </Box>

          {hasSources && (
            <Box sx={{ mt: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  borderTop: `1px solid ${theme.palette.divider}`,
                  pt: 1,
                }}
                onClick={toggleSources}
              >
                <FormatQuoteIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="textSecondary">
                  {message.sources.length} source{message.sources.length !== 1 ? 's' : ''}
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                {showSources ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
              </Box>
              
              <Collapse in={showSources}>
                <Box sx={{ mt: 1 }}>
                  {message.sources.map((source, index) => (
                    <Box 
                      key={index}
                      sx={{
                        p: 1,
                        mt: 1,
                        borderRadius: 1,
                        backgroundColor: alpha(theme.palette.background.paper, 0.5),
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Typography variant="body2" component="div">
                        <Box component="span" sx={{ fontWeight: 'bold' }}>
                          Source {index + 1}:
                        </Box>{' '}
                        {source.text || 'No text available'}
                      </Typography>
                      {source.page && (
                        <Typography variant="caption" color="textSecondary">
                          Page: {source.page}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              </Collapse>
            </Box>
          )}
          
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              opacity: 0,
              transition: 'opacity 0.2s',
              '&:hover': {
                opacity: 1,
              },
            }}
            className="message-actions"
          >
            <Tooltip title={copied ? "Copied!" : "Copy message"}>
              <IconButton size="small" onClick={handleCopy}>
                {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ChatBubble;