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
  Divider,
  Paper,
} from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ChatIcon from "@mui/icons-material/Chat";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
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
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

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
        return <ReceiptLongIcon />;
      case "invoice":
        return <RequestQuoteIcon />;
      case "receipt":
        return <ReceiptIcon />;
      case "menu":
        return <RestaurantMenuIcon />;
      case "form":
        return <AssignmentIcon />;
      case "letter":
        return <ContactMailIcon />;
      case "resume":
      case "cv":
        return <BadgeIcon />;
      case "contract":
        return <GavelIcon />;
      case "report":
        return <SummarizeIcon />;
      default:
        return <ArticleIcon />;
    }
  }

  // If no doc_type is available, fall back to file extension
  const extension = document.filename?.split(".").pop()?.toLowerCase() || "";

  switch (extension) {
    case "pdf":
      return <PictureAsPdfIcon />;
    case "doc":
    case "docx":
      return <DescriptionOutlinedIcon />;
    case "txt":
      return <TextSnippetIcon />;
    default:
      return <InsertDriveFileIcon />;
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

// Helper function to get the status text and color
const getStatusInfo = (status) => {
  switch (status) {
    case "processed":
      return { text: "Processed", color: "success" };
    case "processing":
      return { text: "Processing", color: "warning" };
    case "failed":
      return { text: "Failed", color: "error" };
    case "unknown":
    case undefined:
    case null:
      return { text: "Unknown", color: "default" };
    default:
      return { text: status || "Unknown", color: "default" };
  }
};

const DocumentCard = ({
  document,
  onDelete,
  loading = false,
  searchQuery = "",
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Menu handlers
  const handleMenuOpen = (event) => {
    // Critical fix: Stop propagation to prevent card click
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setAnchorEl(null);
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
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

  // Prevent default for all card action clicks to avoid navigation
  const handleCardActionClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
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
          overflow: "hidden",
          position: "relative",
          transition: "all 0.3s ease",
          border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
          backgroundColor: theme.palette.background.paper,
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 4px 20px rgba(0, 0, 0, 0.25)"
              : "0 4px 20px rgba(0, 0, 0, 0.08)",
        }}
      >
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Skeleton variant='circular' width={48} height={48} />
            <Box sx={{ ml: 2, flexGrow: 1 }}>
              <Skeleton variant='text' width='70%' height={28} />
              <Skeleton variant='text' width='40%' height={20} />
            </Box>
          </Box>
          <Skeleton
            variant='rectangular'
            height={24}
            width='50%'
            sx={{ mb: 2, borderRadius: 2 }}
          />
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <Skeleton
              variant='rectangular'
              height={20}
              width={70}
              sx={{ borderRadius: 10 }}
            />
            <Skeleton
              variant='rectangular'
              height={20}
              width={60}
              sx={{ borderRadius: 10 }}
            />
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ p: 2 }}>
          <Skeleton
            variant='rectangular'
            height={36}
            width={120}
            sx={{ borderRadius: 18 }}
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
  const statusInfo = getStatusInfo(document.status);
  const docTypeColor = getDocTypeColor(document.doc_type);

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Card
        elevation={hovered ? 8 : 1}
        component={Link}
        to={hasValidId ? `/documents/${document.id}` : "#"}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 3,
          overflow: "hidden",
          position: "relative",
          transition: "all 0.3s ease",
          border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
          textDecoration: "none",
          backgroundImage: `linear-gradient(135deg, ${alpha(
            docTypeColor,
            0.03
          )} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
          boxShadow:
            theme.palette.mode === "dark"
              ? `0 4px 20px rgba(0, 0, 0, 0.3), 0 0 15px ${alpha(
                  docTypeColor,
                  0.1
                )}`
              : `0 4px 20px rgba(0, 0, 0, 0.08), 0 0 15px ${alpha(
                  docTypeColor,
                  0.1
                )}`,
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            backgroundColor: docTypeColor,
            opacity: 0.9,
          },
          "&:hover": {
            borderColor: alpha(docTypeColor, 0.3),
            boxShadow:
              theme.palette.mode === "dark"
                ? `0 10px 30px rgba(0, 0, 0, 0.4), 0 0 30px ${alpha(
                    docTypeColor,
                    0.25
                  )}`
                : `0 10px 30px rgba(0, 0, 0, 0.12), 0 0 30px ${alpha(
                    docTypeColor,
                    0.25
                  )}`,
          },
          backdropFilter: "blur(8px)",
        }}
      >
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2.5 }}>
            {/* Document Icon */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 48,
                height: 48,
                borderRadius: "14px",
                backgroundColor: alpha(docTypeColor, 0.12),
                color: docTypeColor,
                flexShrink: 0,
                boxShadow: `0 2px 10px ${alpha(docTypeColor, 0.2)}`,
                transition: "all 0.3s ease",
                transform: hovered ? "translateY(-2px)" : "none",
                backdropFilter: "blur(10px)",
              }}
            >
              {getFileIcon(document)}
            </Box>

            {/* Document Title and Date */}
            <Box sx={{ ml: 2, flexGrow: 1, overflow: "hidden" }}>
              <Typography
                variant='h6'
                component='div'
                noWrap
                title={document.filename || "Unnamed document"}
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  lineHeight: 1.3,
                }}
              >
                {truncateText(document.filename || "Unnamed document", 24)}
              </Typography>
              <Typography
                variant='caption'
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  color: theme.palette.text.secondary,
                  mt: 0.5,
                }}
              >
                <CalendarTodayIcon fontSize='inherit' />
                {formatDate(document.uploaded_at)}
              </Typography>
            </Box>
          </Box>

          {/* Document Type */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography
                variant='subtitle2'
                component='span'
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: "10px",
                  backgroundColor: alpha(docTypeColor, 0.12),
                  color: docTypeColor,
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  display: "inline-flex",
                  alignItems: "center",
                  boxShadow: `0 2px 5px ${alpha(docTypeColor, 0.15)}`,
                  transition: "all 0.3s ease",
                }}
              >
                {formatDocType(document.doc_type)}
              </Typography>

              {/* <Chip
                size='small'
                label={statusInfo.text}
                color={statusInfo.color}
                variant='outlined'
                sx={{
                  borderRadius: "10px",
                  height: "24px",
                  fontSize: "0.7rem",
                  fontWeight: 500,
                  "& .MuiChip-label": {
                    px: 1,
                  },
                  boxShadow: `0 1px 3px ${alpha(
                    theme.palette.common.black,
                    0.08
                  )}`,
                }}
              /> */}
            </Box>

            {/* File Size */}
            {document.file_size && (
              <Typography
                variant='caption'
                sx={{
                  color: alpha(theme.palette.text.secondary, 0.8),
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                File size: {(document.file_size / 1024 / 1024).toFixed(2)} MB
              </Typography>
            )}
          </Box>
          {document.extracted_text &&
            searchQuery &&
            document.extracted_text
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) &&
            !document.filename
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) && (
              <Typography
                variant='caption'
                sx={{
                  display: "inline-block",
                  px: 1,
                  py: 0.5,
                  mt: 1,
                  borderRadius: "4px",
                  backgroundColor: alpha(theme.palette.info.main, 0.1),
                  color: theme.palette.info.main,
                  fontWeight: 500,
                }}
              >
                Content match
              </Typography>
            )}
        </CardContent>

        <Divider />

        <CardActions
          sx={{
            p: 0,
            position: "relative",
            backgroundColor: alpha(theme.palette.background.default, 0.4),
            backdropFilter: "blur(5px)",
          }}
          onClick={handleCardActionClick} // Stop propagation on card actions
        >
          <Button
            component={Link}
            to={hasValidId ? `/documents/${document.id}` : "#"}
            size='medium'
            startIcon={<VisibilityOutlinedIcon />}
            endIcon={
              <ArrowForwardIcon
                sx={{
                  transition: "transform 0.2s ease-in-out",
                  transform: hovered ? "translateX(3px)" : "none",
                }}
              />
            }
            disabled={!hasValidId}
            onClick={(e) => e.stopPropagation()} // Critical: Stop propagation
            sx={{
              m: 2,
              borderRadius: "50px",
              px: 2.5,
              py: 1,
              textTransform: "none",
              fontWeight: 600,
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
              color: theme.palette.primary.main,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              boxShadow: `0 2px 5px ${alpha(theme.palette.primary.main, 0.1)}`,
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.12),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                boxShadow: `0 3px 10px ${alpha(
                  theme.palette.primary.main,
                  0.2
                )}`,
              },
            }}
          >
            View Document
          </Button>

          <Box sx={{ flexGrow: 1 }} />

          <Tooltip title='More actions'>
            <IconButton
              aria-label='document actions'
              disabled={!hasValidId}
              onClick={handleMenuOpen} // Using our fixed handler
              edge='end'
              sx={{
                m: 2,
                color: theme.palette.text.secondary,
                backgroundColor: alpha(theme.palette.background.paper, 0.5),
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  boxShadow: `0 2px 8px ${alpha(
                    theme.palette.primary.main,
                    0.15
                  )}`,
                },
                transition: "all 0.2s ease",
                backdropFilter: "blur(5px)",
                boxShadow:
                  theme.palette.mode === "dark"
                    ? `0 2px 8px rgba(0, 0, 0, 0.2)`
                    : `0 2px 8px rgba(0, 0, 0, 0.05)`,
              }}
            >
              <MoreVertIcon />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            onClick={(e) => e.stopPropagation()} // Important: Stop propagation here too
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            PaperProps={{
              elevation: 3,
              sx: {
                borderRadius: 2,
                minWidth: 180,
                overflow: "visible",
                mt: 1,
                backdropFilter: "blur(10px)",
                boxShadow:
                  theme.palette.mode === "dark"
                    ? `0 4px 20px rgba(0, 0, 0, 0.3)`
                    : `0 4px 20px rgba(0, 0, 0, 0.1)`,
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: -5,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
          >
            <MenuItem
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleMenuClose(e);
              }}
              component={Link}
              to={hasValidId ? `/documents/${document.id}` : "#"}
              disabled={!hasValidId}
              sx={{
                py: 1.5,
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                },
              }}
            >
              <VisibilityOutlinedIcon fontSize='small' sx={{ mr: 1.5 }} />
              View Document
            </MenuItem>
            <MenuItem
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleMenuClose(e);
              }}
              component={Link}
              to={hasValidId ? `/documents/${document.id}` : "#"}
              state={{ tabIndex: 1 }}
              disabled={!hasValidId}
              sx={{
                py: 1.5,
                "&:hover": {
                  backgroundColor: alpha(theme.palette.info.main, 0.08),
                },
              }}
            >
              <ChatIcon fontSize='small' sx={{ mr: 1.5 }} />
              Chat with Document
            </MenuItem>
            <Divider sx={{ my: 1 }} />
            <MenuItem
              onClick={handleDeleteClick}
              sx={{
                py: 1.5,
                color: theme.palette.error.main,
                "&:hover": {
                  backgroundColor: alpha(theme.palette.error.main, 0.08),
                },
              }}
            >
              <DeleteIcon fontSize='small' sx={{ mr: 1.5 }} />
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
        onClick={(e) => e.stopPropagation()} // Stop propagation
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: 3,
            px: 1,
            py: 1,
            backdropFilter: "blur(10px)",
            boxShadow:
              theme.palette.mode === "dark"
                ? `0 10px 30px rgba(0, 0, 0, 0.4)`
                : `0 10px 30px rgba(0, 0, 0, 0.15)`,
          },
        }}
      >
        <DialogTitle id='alert-dialog-title' sx={{ pb: 1, pt: 2 }}>
          Delete Document
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Are you sure you want to delete "
            {document.filename || "this document"}"? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button
            onClick={handleDeleteCancel}
            color='inherit'
            variant='outlined'
            sx={{
              borderRadius: "50px",
              px: 2.5,
              textTransform: "none",
              fontWeight: 500,
              boxShadow: `0 2px 5px ${alpha(theme.palette.common.black, 0.05)}`,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color='error'
            variant='contained'
            disableElevation
            autoFocus
            sx={{
              borderRadius: "50px",
              px: 2.5,
              textTransform: "none",
              fontWeight: 600,
              boxShadow: `0 2px 8px ${alpha(theme.palette.error.main, 0.3)}`,
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default DocumentCard;
