import React, { useState } from "react";
import { Button, Modal, TextField, Box, IconButton } from "@mui/material";
import { AiOutlineRobot } from "react-icons/ai";

interface Comment {
  id?: string;
  text: string;
  file: File | null;
  fileUrl: string;
}

interface CommentListProps {
  comments: Comment[];
  onEdit: (index: string | undefined, data: Comment) => void;
  onDelete: (index: string | undefined) => void;
}

const CommentList: React.FC<CommentListProps> = ({
  comments,
  onEdit,
  onDelete,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [openSummaryModal, setOpenSummaryModal] = useState(false);
  const [summary, setSummary] = useState("");

  const handleOpen = (comment: Comment) => {
    setSelectedComment(comment);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedComment(null);
  };

  const handleSave = () => {
    if (selectedComment) {
      onEdit(selectedComment.id, {
        text: selectedComment.text,
        file: selectedComment.file,
        fileUrl: selectedComment.fileUrl,
      });
      handleClose();
    }
  };

  const handleOpenSummaryModal = async (comment: Comment) => {
    setSelectedComment(comment);
    const response = await fetch("YOUR_GEMINI_API_ENDPOINT", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: comment.text }),
    });
    const data = await response.json();
    setSummary(data.summary);
    setOpenSummaryModal(true);
  };

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="p-4 bg-gray-100 rounded-md">
          <p>{comment.text}</p>
          {comment.file && (
            <a href={comment.fileUrl} download>
              Download Attachment
            </a>
          )}
          <div className="space-x-2 mt-2">
            <Button variant="outlined" onClick={() => handleOpen(comment)}>
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => onDelete(comment.id)}
            >
              Delete
            </Button>
            <IconButton
              onClick={() => handleOpenSummaryModal(comment)}
              className="float-right"
            >
              <AiOutlineRobot />
            </IconButton>
          </div>
        </div>
      ))}

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            outline: 0,
          }}
        >
          <h2>Edit Comment</h2>
          <TextField
            label="Comment Text"
            value={selectedComment?.text || ""}
            onChange={(e) => {
              if (selectedComment) {
                setSelectedComment({
                  ...selectedComment,
                  text: e.target.value,
                });
              }
            }}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Modal>

      <Modal open={openSummaryModal} onClose={() => setOpenSummaryModal(false)}>
        <div className="modal-content">
          <h2>Comment Summary</h2>
          <p>{summary}</p>
          <Button onClick={() => setOpenSummaryModal(false)}>Close</Button>
        </div>
      </Modal>
    </div>
  );
};

export default CommentList;
