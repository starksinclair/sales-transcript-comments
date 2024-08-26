import React, { useState } from "react";
import { Button, Modal, TextField, Box, IconButton } from "@mui/material";
import { AiOutlineRobot } from "react-icons/ai";

interface TranscriptSegment {
  id: string;
  text: string;
}

interface Comment {
  id?: string;
  text: string;
  file: File | null;
  fileUrl: string;
  segmentId: string;
}

interface CommentListProps {
  segment: TranscriptSegment;
  comments: Comment[];
  onEdit: (id: string | undefined, data: Comment) => void;
  onDelete: (id: string | undefined) => void;
}

interface TranscriptProps {
  segments: TranscriptSegment[];
  comments: Comment[];
  onAddComment: (segmentId: string, commentText: string) => void;
  onEditComment: (id: string | undefined, data: Comment) => void;
  onDeleteComment: (id: string | undefined) => void;
}

const Transcript: React.FC<TranscriptProps> = ({
  segments,
  comments,
  onAddComment,
  onEditComment,
  onDeleteComment,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedSegment, setSelectedSegment] =
    useState<TranscriptSegment | null>(null);
  const [newCommentText, setNewCommentText] = useState("");

  const handleOpen = (segment: TranscriptSegment) => {
    setSelectedSegment(segment);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSegment(null);
    setNewCommentText("");
  };

  const handleSave = () => {
    if (selectedSegment) {
      onAddComment(selectedSegment.id, newCommentText);
      handleClose();
    }
  };

  return (
    <div className="space-y-4">
      {segments.map((segment) => (
        <div key={segment.id} className="p-4 bg-gray-100 rounded-md">
          <p>{segment.text}</p>
          <Button variant="outlined" onClick={() => handleOpen(segment)}>
            Add Comment
          </Button>
          <CommentList
            segment={segment}
            comments={comments.filter(
              (comment) => comment.segmentId === segment.id
            )}
            onEdit={onEditComment}
            onDelete={onDeleteComment}
          />
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
          <h2>Add Comment</h2>
          <TextField
            label="Comment Text"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

const CommentList: React.FC<CommentListProps> = ({
  segment,
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

  const handleOpenSummaryModal = async (comment: Comment) => {
    if (!comment) return;

    const transcriptSegment = segment;
    const segmentText = transcriptSegment.text;

    setSelectedComment(comment);
    const prompt = `Summarize the following comment in the context of the transcript segment:\n\nTranscript Segment: "${segmentText}"\nComment: "${comment.text}"`;
    const response = await fetch("/api/", {
      // Replace with your actual Gemini API endpoint
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt, // Send the prompt to the AI
      }),
    });
    const data = await response.json();
    console.log(data);
    setSummary(data.message);
    setOpenSummaryModal(true);
  };

  const handleSave = () => {
    if (selectedComment) {
      onEdit(selectedComment.id, {
        text: selectedComment.text,
        file: selectedComment.file,
        fileUrl: selectedComment.fileUrl,
        segmentId: selectedComment.segmentId,
      });
      handleClose();
    }
  };
  console.log("comments", comments);

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
      <Modal open={openSummaryModal} onClose={() => setOpenSummaryModal(false)}>
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
          <div className="modal-content">
            <h2>Comment Summary</h2>
            <p>{summary}</p>
            <Button onClick={() => setOpenSummaryModal(false)}>Close</Button>
          </div>
        </Box>
      </Modal>
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
    </div>
  );
};

export default Transcript;
