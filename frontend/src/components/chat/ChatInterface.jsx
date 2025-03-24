import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  Tooltip,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import SearchIcon from "@mui/icons-material/Search";
import ReactMarkdown from "react-markdown";
import chatService from "../../services/chatService";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

// Rest of the file remains the same

const ChatInterface = ({ documentId, documentTitle }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState(null);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Load chat history
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setLoadingHistory(true);
        setError(null);
        const history = await chatService.getChatHistory(documentId);
        setMessages(history);
      } catch (err) {
        console.error("Error fetching chat history:", err);
        setError("Failed to load chat history. Please try again.");
      } finally {
        setLoadingHistory(false);
      }
    };

    if (documentId) {
      fetchChatHistory();
    }
  }, [documentId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || loading) return;

    const userMessage = newMessage.trim();
    setNewMessage("");

    // Optimistically add user message to UI
    setMessages((prev) => [
      ...prev,
      {
        _id: `temp-${Date.now()}`,
        user_message: userMessage,
        ai_response: "",
        used_tools: [],
        isTemp: true,
      },
    ]);

    try {
      setLoading(true);
      const response = await chatService.sendMessage(documentId, userMessage);

      // Replace temp message with actual response
      setMessages((prev) => prev.filter((msg) => !msg.isTemp).concat(response));
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");

      // Remove temp message on error
      setMessages((prev) => prev.filter((msg) => !msg.isTemp));
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = async () => {
    try {
      setLoading(true);
      await chatService.clearChatHistory(documentId);
      setMessages([]);
      setClearDialogOpen(false);
    } catch (err) {
      console.error("Error clearing chat:", err);
      setError("Failed to clear chat history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      {/* Chat header */}
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid rgba(0,0,0,0.1)",
          bgcolor: "primary.main",
          color: "white",
        }}
      >
        <Typography variant='h6' noWrap>
          Chat with Document: {documentTitle}
        </Typography>
      </Box>

      {/* Error alert */}
      {error && (
        <Alert severity='error' onClose={() => setError(null)} sx={{ m: 1 }}>
          {error}
        </Alert>
      )}

      {/* Messages area */}
      <Box
        sx={{
          p: 2,
          flexGrow: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          bgcolor: "#f5f5f5",
          maxHeight: "60vh",
          minHeight: "300px",
        }}
      >
        {loadingHistory ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : messages.length === 0 ? (
          <Box sx={{ textAlign: "center", opacity: 0.7, my: 4 }}>
            <Typography variant='body1'>
              No messages yet. Start by asking a question about this document.
            </Typography>
          </Box>
        ) : (
          messages.map((message, index) => (
            <React.Fragment key={message._id || `msg-${index}`}>
              {/* User message */}
              <Box
                sx={{
                  alignSelf: "flex-end",
                  bgcolor: "primary.main",
                  color: "white",
                  p: 2,
                  borderRadius: 2,
                  maxWidth: "80%",
                  wordBreak: "break-word",
                }}
              >
                <Typography variant='body1'>{message.user_message}</Typography>
              </Box>

              {/* AI response */}
              <Box
                sx={{
                  alignSelf: "flex-start",
                  bgcolor: "white",
                  p: 2,
                  borderRadius: 2,
                  maxWidth: "80%",
                  minWidth: "200px",
                  boxShadow: 1,
                  opacity: message.isTemp ? 0.7 : 1,
                }}
              >
                {message.isTemp ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={20} />
                    <Typography variant='body2' color='text.secondary'>
                      Generating response...
                    </Typography>
                  </Box>
                ) : (
                  <>
                    <Box className='markdown-content' sx={{ pb: 1 }}>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw, rehypeSanitize]}
                        components={{
                          // Add custom components for better rendering
                          table: ({ node, ...props }) => (
                            <Paper
                              elevation={0}
                              sx={{ overflow: "hidden", mb: 2, width: "100%" }}
                            >
                              <table
                                {...props}
                                style={{
                                  width: "100%",
                                  borderCollapse: "collapse",
                                }}
                              />
                            </Paper>
                          ),
                          th: ({ node, ...props }) => (
                            <th
                              {...props}
                              style={{
                                backgroundColor: "#f5f7fa",
                                fontWeight: "bold",
                                padding: "8px 10px",
                                border: "1px solid #e0e0e0",
                                textAlign: "left",
                              }}
                            />
                          ),
                          td: ({ node, ...props }) => (
                            <td
                              {...props}
                              style={{
                                padding: "8px 10px",
                                border: "1px solid #e0e0e0",
                              }}
                            />
                          ),
                          // Limited heading sizes in chat messages
                          h1: ({ node, ...props }) => (
                            <Typography
                              variant='h6'
                              color='primary'
                              gutterBottom
                              sx={{ mt: 1, fontWeight: "bold" }}
                              {...props}
                            />
                          ),
                          h2: ({ node, ...props }) => (
                            <Typography
                              variant='subtitle1'
                              gutterBottom
                              sx={{ mt: 1, fontWeight: "bold" }}
                              {...props}
                            />
                          ),
                          h3: ({ node, ...props }) => (
                            <Typography
                              variant='subtitle2'
                              gutterBottom
                              sx={{ mt: 0.5, fontWeight: "bold" }}
                              {...props}
                            />
                          ),
                          // Make links open in new tab
                          a: ({ node, children, ...props }) => (
                            <a
                              target='_blank'
                              rel='noopener noreferrer'
                              aria-label={
                                typeof children === "string"
                                  ? children
                                  : "External link"
                              }
                              {...props}
                            >
                              {children}
                            </a>
                          ),
                          // Format lists better
                          ul: ({ node, ...props }) => (
                            <Box
                              component='ul'
                              sx={{ pl: 2, my: 1 }}
                              {...props}
                            />
                          ),
                          ol: ({ node, ...props }) => (
                            <Box
                              component='ol'
                              sx={{ pl: 2, my: 1 }}
                              {...props}
                            />
                          ),
                          li: ({ node, ...props }) => (
                            <Box component='li' sx={{ my: 0.5 }} {...props} />
                          ),
                        }}
                      >
                        {message.ai_response}
                      </ReactMarkdown>
                    </Box>

                    {message.used_tools?.length > 0 &&
                      message.used_tools[0]?.tool_name === "search" && (
                        <Box
                          sx={{
                            mt: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            fontSize: "0.75rem",
                            color: "text.secondary",
                          }}
                        >
                          <SearchIcon fontSize='inherit' />
                          <Typography variant='caption'>
                            Web search was used to enhance response
                          </Typography>
                        </Box>
                      )}
                  </>
                )}
              </Box>
            </React.Fragment>
          ))
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input area */}
      <Box
        sx={{ p: 2, borderTop: "1px solid rgba(0,0,0,0.1)", bgcolor: "white" }}
      >
        <form
          onSubmit={handleSendMessage}
          style={{ display: "flex", gap: "8px" }}
        >
          <TextField
            fullWidth
            variant='outlined'
            placeholder='Ask about this document...'
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={loading || loadingHistory}
            size='small'
          />
          <Tooltip title='Send message'>
            <span>
              <Button
                variant='contained'
                color='primary'
                type='submit'
                disabled={!newMessage.trim() || loading || loadingHistory}
                endIcon={
                  loading ? (
                    <CircularProgress size={20} color='inherit' />
                  ) : (
                    <SendIcon />
                  )
                }
              >
                Send
              </Button>
            </span>
          </Tooltip>
          <Tooltip title='Clear chat history'>
            <span>
              <IconButton
                color='error'
                disabled={messages.length === 0 || loading || loadingHistory}
                onClick={() => setClearDialogOpen(true)}
              >
                <DeleteSweepIcon />
              </IconButton>
            </span>
          </Tooltip>
        </form>
      </Box>

      {/* Clear chat confirmation dialog */}
      <Dialog open={clearDialogOpen} onClose={() => setClearDialogOpen(false)}>
        <DialogTitle>Clear Chat History</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to clear all chat messages? This cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleClearChat} color='error'>
            Clear
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ChatInterface;
