import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Box,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  useTheme,
  alpha,
  Skeleton,
} from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ChatIcon from "@mui/icons-material/Chat";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import ArticleIcon from "@mui/icons-material/Article";
import SummarizeIcon from "@mui/icons-material/Summarize";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import BadgeIcon from "@mui/icons-material/Badge";
import GavelIcon from "@mui/icons-material/Gavel";

// Helper function to get document type color
const getDocTypeColor = (docType) => {
  if (!docType) return "#7F8C8D"; // Default gray

  switch (docType.toLowerCase()) {
    case "bill":
      return "#E67E22"; // Orange
    case "invoice":
      return "#9B59B6"; // Purple
    case "receipt":
      return "#2ECC71"; // Green
    case "menu":
      return "#F39C12"; // Yellow/Orange
    case "form":
      return "#3498DB"; // Blue
    case "letter":
      return "#1ABC9C"; // Teal
    case "resume":
    case "cv":
      return "#34495E"; // Dark blue/gray
    case "contract":
      return "#8E44AD"; // Violet
    case "report":
      return "#16A085"; // Green/teal
    default:
      return "#7F8C8D"; // Gray
  }
};

// Helper function to format document type name for display
const formatDocType = (docType) => {
  if (!docType) return "Unknown";
  // Capitalize first letter
  return docType.charAt(0).toUpperCase() + docType.slice(1);
};

// Helper function to determine icon based on file type
const getFileIcon = (document) => {
  // First check document type (more specific)
  if (document.doc_type) {
    const docType = document.doc_type.toLowerCase();

    switch (docType) {
      case "bill":
        return <ReceiptLongIcon sx={{ color: "#E67E22" }} />;
      case "invoice":
        return <RequestQuoteIcon sx={{ color: "#9B59B6" }} />;
      case "receipt":
        return <ReceiptIcon sx={{ color: "#2ECC71" }} />;
      case "menu":
        return <RestaurantMenuIcon sx={{ color: "#F39C12" }} />;
      case "form":
        return <AssignmentIcon sx={{ color: "#3498DB" }} />;
      case "letter":
        return <ContactMailIcon sx={{ color: "#1ABC9C" }} />;
      case "resume":
      case "cv":
        return <BadgeIcon sx={{ color: "#34495E" }} />;
      case "contract":
        return <GavelIcon sx={{ color: "#8E44AD" }} />;
      case "report":
        return <SummarizeIcon sx={{ color: "#16A085" }} />;
      default:
        return <ArticleIcon sx={{ color: "#7F8C8D" }} />;
    }
  }

  // If no doc_type is available, fall back to file extension
  const extension = document.filename?.split(".").pop()?.toLowerCase() || "";

  switch (extension) {
    case "pdf":
      return <PictureAsPdfIcon sx={{ color: "#E74C3C" }} />;
    case "doc":
    case "docx":
      return <DescriptionOutlinedIcon sx={{ color: "#3498DB" }} />;
    case "txt":
      return <TextSnippetIcon sx={{ color: "#7F8C8D" }} />;
    default:
      return <InsertDriveFileIcon sx={{ color: "#7F8C8D" }} />;
  }
};

// Helper function to format date with error handling
const formatDate = (dateString) => {
  if (!dateString) return "Date unavailable";

  try {
    const date = new Date(dateString);
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "Date unavailable";
    }

    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Date unavailable";
  }
};

// Helper function to truncate text
const truncateText = (text, maxLength) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const DocumentCard = ({ document, onDelete, loading = false }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Menu handlers
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (onDelete && document && document.id) onDelete(document.id);
    setDeleteDialogOpen(false);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  // Skeleton loader
  if (loading) {
    return (
      <Card
        elevation={1}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 2,
          overflow: "visible",
          position: "relative",
          transition: "all 0.3s ease",
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          <Skeleton variant='circular' width={40} height={40} sx={{ mb: 1 }} />
          <Skeleton variant='text' height={32} width='80%' sx={{ mb: 1 }} />
          <Skeleton variant='text' height={20} width='60%' sx={{ mb: 2 }} />
          <Skeleton
            variant='rectangular'
            height={60}
            sx={{ borderRadius: 1, mb: 2 }}
          />
          <Box sx={{ display: "flex", gap: 1 }}>
            <Skeleton
              variant='rectangular'
              height={24}
              width={60}
              sx={{ borderRadius: 1 }}
            />
            <Skeleton
              variant='rectangular'
              height={24}
              width={60}
              sx={{ borderRadius: 1 }}
            />
          </Box>
        </CardContent>
        <CardActions sx={{ p: 2, pt: 0 }}>
          <Skeleton
            variant='rectangular'
            height={36}
            width={80}
            sx={{ borderRadius: 1 }}
          />
          <Box sx={{ flexGrow: 1 }} />
          <Skeleton variant='circular' width={36} height={36} />
        </CardActions>
      </Card>
    );
  }

  // If no document provided, return null
  if (!document) {
    return null;
  }

  // Check if document has a valid ID
  const hasValidId = document.id && document.id !== "undefined";

  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        elevation={1}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 2,
          overflow: "visible",
          position: "relative",
          transition: "all 0.3s ease",
          border: `1px solid ${theme.palette.divider}`,
          "&:hover": {
            boxShadow: theme.shadows[8],
            borderColor: "transparent",
          },
        }}
      >
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Box
              sx={{
                mr: 1.5,
                display: "flex",
                p: 1,
                borderRadius: "50%",
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              }}
            >
              {getFileIcon(document)}
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant='h6'
                component='div'
                noWrap
                title={document.filename || "Unnamed document"}
              >
                {truncateText(document.filename || "Unnamed document", 20)}
              </Typography>
              <Typography
                variant='caption'
                color='textSecondary'
                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
              >
                <CalendarTodayIcon fontSize='inherit' />
                {formatDate(document.uploaded_at)}
              </Typography>
            </Box>
          </Box>

          {/* <Typography 
            variant="body2" 
            color="textSecondary" 
            sx={{ 
              mb: 2, 
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              height: '40px'
            }}
          >
            {document.description || 'No description available for this document.'}
          </Typography> */}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
            {/* Document Type Chip - More prominent */}
            <Chip
              size='medium'
              label={formatDocType(document.doc_type) || "Unknown"}
              sx={{
                backgroundColor: alpha(
                  getDocTypeColor(document.doc_type),
                  0.15
                ),
                color: getDocTypeColor(document.doc_type),
                fontWeight: 500,
                borderRadius: "16px",
                alignSelf: "flex-start",
              }}
            />

            {/* Status and File Size Chips - Smaller and less prominent */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Chip
                size='small'
                variant='outlined'
                label={document.status || "unknown"}
                sx={{
                  borderRadius: "12px",
                  height: "24px",
                  fontSize: "0.7rem",
                  backgroundColor:
                    document.status === "processed"
                      ? alpha(theme.palette.success.main, 0.1)
                      : document.status === "processing"
                      ? alpha(theme.palette.warning.main, 0.1)
                      : "transparent",
                  borderColor:
                    document.status === "processed"
                      ? theme.palette.success.main
                      : document.status === "processing"
                      ? theme.palette.warning.main
                      : theme.palette.grey[400],
                  color:
                    document.status === "processed"
                      ? theme.palette.success.main
                      : document.status === "processing"
                      ? theme.palette.warning.main
                      : theme.palette.text.secondary,
                }}
              />
              {document.file_size && (
                <Chip
                  size='small'
                  variant='outlined'
                  label={`${(document.file_size / 1024 / 1024).toFixed(2)} MB`}
                  sx={{
                    borderRadius: "12px",
                    height: "24px",
                    fontSize: "0.7rem",
                  }}
                />
              )}
            </Box>
          </Box>
        </CardContent>

        <CardActions sx={{ p: 2, pt: 0 }}>
          <Button
            component={Link}
            to={hasValidId ? `/documents/${document.id}` : "#"}
            size='small'
            startIcon={<ChatIcon />}
            color='primary'
            variant='contained'
            sx={{ borderRadius: "20px", px: 2 }}
            disabled={!hasValidId}
          >
            Chat
          </Button>

          <Box sx={{ flexGrow: 1 }} />

          <Tooltip title='Actions'>
            <IconButton
              aria-label='document actions'
              disabled={!hasValidId}
              onClick={handleMenuOpen}
            >
              <MoreVertIcon />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            PaperProps={{
              elevation: 3,
              sx: { borderRadius: 2, minWidth: 150 },
            }}
          >
            <MenuItem
              onClick={handleMenuClose}
              component={Link}
              to={hasValidId ? `/documents/${document.id}` : "#"}
              disabled={!hasValidId}
            >
              <ChatIcon fontSize='small' sx={{ mr: 1 }} />
              Chat
            </MenuItem>
            <MenuItem onClick={handleMenuClose} disabled>
              <EditIcon fontSize='small' sx={{ mr: 1 }} />
              Edit
            </MenuItem>
            <MenuItem onClick={handleMenuClose} disabled>
              <FileCopyIcon fontSize='small' sx={{ mr: 1 }} />
              Duplicate
            </MenuItem>
            <MenuItem
              onClick={handleDeleteClick}
              sx={{ color: theme.palette.error.main }}
            >
              <DeleteIcon fontSize='small' sx={{ mr: 1 }} />
              Delete
            </MenuItem>
          </Menu>
        </CardActions>
      </Card>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        PaperProps={{
          elevation: 3,
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle id='alert-dialog-title'>Delete Document</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Are you sure you want to delete "
            {document.filename || "this document"}"? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleDeleteCancel} color='primary'>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color='error'
            variant='contained'
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default DocumentCard;
