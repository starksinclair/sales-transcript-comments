// components/CommentForm.tsx
import React, { useState, ChangeEvent, FormEvent } from "react";
import { TextField, Button } from "@mui/material";

interface CommentFormProps {
  onSubmit: (data: { comment: string; file: File | null }) => void;
  initialComment?: string;
  initialFile?: File | null;
}

const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  initialComment = "",
  initialFile = null,
}) => {
  const [comment, setComment] = useState<string>(initialComment);
  const [file, setFile] = useState<File | null>(initialFile);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ comment, file });
    setComment("");
    setFile(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextField
        label="Comment"
        variant="outlined"
        fullWidth
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <input type="file" onChange={handleFileChange} />
      <Button variant="contained" color="primary" type="submit">
        Submit
      </Button>
    </form>
  );
};

export default CommentForm;
