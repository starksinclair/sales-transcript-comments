"use client";
import React, { useEffect, useState } from "react";
import Transcript from "./components/Transcript";
import { db } from "./firebase"; // Import your Firebase configuration
import {
  addDoc,
  collection,
  updateDoc,
  doc,
  deleteDoc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";

interface Comment {
  id?: string | undefined;
  text: string;
  file: File | null;
  fileUrl: string;
  segmentId: string;
}
interface TranscriptSegment {
  id: string;
  text: string;
}
const App = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  useEffect(() => {
    // const fetchComments = async () => {
    if (typeof window !== "undefined") {
      // Access window object here
      console.log(window.innerWidth);
    }
    const commentsCollection = collection(db, "comments");
    const unsubscribe = onSnapshot(
      commentsCollection,
      async (querySnapshot) => {
        const data = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            return { ...doc.data(), id: doc.id } as Comment;
          })
        );
        console.log(data);
        setComments(data);
      }
    );
    return () => unsubscribe();
    //   const snapshot = await getDocs(commentsCollection);
    //   const commentsData = snapshot.docs.map((doc) => ({
    //     id: doc.id,
    //     ...doc.data(),
    //   })) as Comment[];
    //   setComments(commentsData);
    // };

    // fetchComments();
  }, []);
  const transcriptSegments: TranscriptSegment[] = [
    {
      id: "1",
      text: "Sales Rep: Good morning! Thank you for joining us today. How can I assist you?",
    },
    {
      id: "2",
      text: "Customer: I'm interested in learning more about your product offerings.",
    },
    {
      id: "3",
      text: "Sales Rep: Absolutely! We have a range of products that can help streamline your operations.",
    },
    { id: "4", text: "Customer: Can you tell me about the pricing options?" },
    {
      id: "5",
      text: "Sales Rep: Sure! We offer several pricing tiers based on the features you need.",
    },
    {
      id: "6",
      text: "Customer: That sounds good. What kind of support do you provide?",
    },
    {
      id: "7",
      text: "Sales Rep: We provide 24/7 customer support and a dedicated account manager.",
    },
    { id: "8", text: "Customer: Great! Can I get a demo of the product?" },
    {
      id: "9",
      text: "Sales Rep: Of course! I can schedule a demo for you this week.",
    },
    { id: "10", text: "Customer: That would be perfect. Thank you!" },
    {
      id: "11",
      text: "Sales Rep: Thank you for your interest! I look forward to speaking with you soon.",
    },
  ];

  const handleAddComment = async (segmentId: string, commentText: string) => {
    const newComment: Comment = {
      // id: String(comments.length + 1), // This will be replaced by Firestore ID
      text: commentText,
      file: null,
      fileUrl: "",
      segmentId: segmentId,
      // id: undefined
    };

    try {
      const docRef = await addDoc(collection(db, "comments"), newComment);
      setComments([...comments, { ...newComment, id: docRef.id }]); // Update with Firestore ID
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  const handleEditComment = async (id: string | undefined, data: Comment) => {
    if (!id) {
      console.error("Comment ID is undefined");
      return;
    }

    try {
      const commentRef = doc(db, "comments", id);
      await updateDoc(commentRef, { ...data });
      console.log("Comment updated successfully");
    } catch (error) {
      console.error("Error updating comment: ", error);
    }
  };

  const handleDeleteComment = async (itemId?: string) => {
    try {
      const comment = comments.find((comment) => comment.id === itemId);
      if (!comment) {
        console.error("Comment not found");
        return;
      }

      // if (comment.fileUrl) {
      //   const storageRef = ref(
      //     getStorage(),
      //     `comments/${comment.id}/${comment.file}`
      //   );
      //   await deleteObject(storageRef);
      // }

      const commentRef = doc(db, "comments", comment.id!);
      await deleteDoc(commentRef);
    } catch (error) {
      console.error("Error deleting comment: ", error);
    }
  };

  return (
    <Transcript
      segments={transcriptSegments}
      comments={comments}
      onAddComment={handleAddComment}
      onEditComment={handleEditComment}
      onDeleteComment={handleDeleteComment}
    />
  );
};

export default App;

// import React, { useState, useEffect } from "react";
// import CommentForm from "./components/CommentForm";
// import CommentList from "./components/CommentList";
// import { db } from "./firebase";
// import {
//   addDoc,
//   collection,
//   deleteDoc,
//   doc,
//   onSnapshot,
//   updateDoc,
// } from "firebase/firestore";
// import {
//   getStorage,
//   ref,
//   uploadBytes,
//   getDownloadURL,
//   deleteObject,
// } from "firebase/storage";

// interface Comment {
//   id?: string;
//   text: string;
//   file: File | null;
//   fileUrl: string;
//   timestamp: string; // Added timestamp for sorting
// }

// const TranscriptComments: React.FC = () => {
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [editingIndex, setEditingIndex] = useState<number | null>(null);
//   const [transcript, setTranscript] = useState<string>(""); // State for transcript text
//   const [summary, setSummary] = useState<string>(""); // State for summary text

//   useEffect(() => {
//     const commentRef = collection(db, "comments");
//     const storage = getStorage();

//     const unsubscribe = onSnapshot(commentRef, async (querySnapshot) => {
//       const data = await Promise.all(
//         querySnapshot.docs.map(async (doc) => {
//           const fileName = doc.data()?.file;
//           const url = fileName
//             ? await getDownloadURL(
//                 ref(storage, `comments/${doc.id}/${fileName}`)
//               )
//             : null;
//           return { ...doc.data(), id: doc.id, fileUrl: url } as Comment;
//         })
//       );
//       console.log(data);
//       setComments(data);
//     });
//     return () => unsubscribe();
//   }, []);

//   const handleAddComment = async ({
//     comment,
//     file,
//   }: {
//     comment: string;
//     file: File | null;
//   }) => {
//     const storage = getStorage();
//     const commentRef = collection(db, "comments");

//     try {
//       const docRef = await addDoc(commentRef, {
//         text: comment,
//         file: file?.name || null,
//         timestamp: new Date().toISOString(), // Add timestamp
//       });
//       if (file) {
//         const storageRef = ref(storage, `comments/${docRef.id}/${file.name}`);
//         await uploadBytes(storageRef, file);
//         const fileUrl = await getDownloadURL(storageRef);
//         await updateDoc(doc(db, "comments", docRef.id), { fileUrl });
//       }
//     } catch (error) {
//       console.error("Error adding comment: ", error);
//     }
//   };

//   const handleEditComment = async (id: string | undefined, data: Comment) => {
//     if (!id) {
//       console.error("Comment ID is undefined");
//       return;
//     }

//     const comment = comments.find((comment) => comment.id === id);
//     if (!comment) {
//       console.error("Comment not found");
//       return;
//     }

//     try {
//       const commentRef = doc(db, "comments", id);
//       await updateDoc(commentRef, { ...data });
//       console.log("Comment updated successfully");
//     } catch (error) {
//       console.error("Error updating comment: ", error);
//     }
//   };

//   const handleDeleteComment = async (itemId: string) => {
//     try {
//       const comment = comments.find((comment) => comment.id === itemId);
//       if (!comment) {
//         console.error("Comment not found");
//         return;
//       }

//       if (comment.fileUrl) {
//         const storageRef = ref(
//           getStorage(),
//           `comments/${comment.id}/${comment.file}`
//         );
//         await deleteObject(storageRef);
//       }

//       const commentRef = doc(db, "comments", comment.id!);
//       await deleteDoc(commentRef);
//     } catch (error) {
//       console.error("Error deleting comment: ", error);
//     }
//   };

//   const handleGenerateSummary = async () => {
//     try {
//       const response = await fetch("YOUR_LLM_API_ENDPOINT", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ transcript, comments }),
//       });
//       const data = await response.json();
//       setSummary(data.summary); // Assuming the API returns a summary field
//     } catch (error) {
//       console.error("Error generating summary: ", error);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-4">Transcript Comments</h1>
//       <textarea
//         value={transcript}
//         onChange={(e) => setTranscript(e.target.value)}
//         placeholder="Enter the sales transcript here..."
//         className="w-full p-2 border rounded mb-4"
//       />
//       <button
//         onClick={handleGenerateSummary}
//         className="mb-4 p-2 bg-blue-500 text-white rounded"
//       >
//         Generate Summary
//       </button>
//       {summary && <div className="mb-4 p-2 bg-gray-200 rounded">{summary}</div>}
//       <CommentForm
//         onSubmit={handleAddComment}
//         initialComment={
//           editingIndex !== null ? comments[editingIndex].text : ""
//         }
//         initialFile={editingIndex !== null ? comments[editingIndex].file : null}
//       />
//       <CommentList
//         comments={comments}
//         onEdit={handleEditComment}
//         onDelete={handleDeleteComment}
//       />
//     </div>
//   );
// };

// export default TranscriptComments;
