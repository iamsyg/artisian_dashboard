"use client";

import React, { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

const AudioRecorderButton: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // ✅ Create Supabase client inside component
  const supabase = createClient();

  // Start Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      console.log("Recording started...");
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  // Stop Recording and Upload
  const stopRecording = async () => {
    const mediaRecorder = mediaRecorderRef.current;
    if (!mediaRecorder) return;

    mediaRecorder.stop();
    setIsRecording(false);

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const fileName = `recording-${Date.now()}.webm`;

      console.log("Recording stopped. Uploading to Supabase...");

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("audio-records") // <-- Ensure this bucket exists
        .upload(fileName, audioBlob, {
          contentType: "audio/webm",
          upsert: true,
        });

      if (error) {
        console.error("Upload failed:", error.message);
      } else {
        console.log("Upload successful:", data);
      }
    };
  };

  // Toggle recording state
  const handleButtonClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <button
      type="button"
      onClick={handleButtonClick}
      className={`px-4 py-2 rounded-md border transition ${
        isRecording
          ? "bg-red-600 border-red-700 hover:bg-red-700"
          : "bg-gray-800 border-gray-600 hover:bg-gray-700 text-white"
      }`}
    >
      {isRecording ? "Stop Recording" : "Record Audio"}
    </button>
  );
};

export default AudioRecorderButton;
