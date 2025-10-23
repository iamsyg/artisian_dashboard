"use client";

import React, { useState } from "react";
import AudioRecorderButton from "./AudioRecorderButton";
import { createClient } from "@/lib/supabase/client";

interface AudioDescriptionRecorderProps {
  initialDescription?: string;
  onChange?: (description: string) => void; // notify parent of changes
}

const AudioDescriptionRecorder: React.FC<AudioDescriptionRecorderProps> = ({
  initialDescription = "",
  onChange,
}) => {
  const [description, setDescription] = useState(initialDescription);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const supabase = createClient();

  // Transcribe audio
  const transcribeAudio = async (audioUrl: string) => {
    setIsTranscribing(true);
    try {
      const response = await fetch(
        "https://502dbab6233b.ngrok-free.app/speech-to-text",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ audio_url: audioUrl, language_code: "en-US" }),
        }
      );

      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

      const data = await response.json();
      setDescription(data.transcript);
      onChange?.(data.transcript); // notify parent
      console.log("✅ Transcript:", data.transcript);
    } catch (error) {
      console.error("❌ Failed to transcribe:", error);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleUploadComplete = async (fileName: string) => {
    const publicUrl = supabase.storage
      .from("audio-records")
      .getPublicUrl(fileName).data.publicUrl;

    if (publicUrl) {
      await transcribeAudio(publicUrl);
    } else {
      console.error("Failed to get public URL for audio file");
    }
  };

  const handleTextareaChange = (value: string) => {
    setDescription(value);
    onChange?.(value); // notify parent
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      {/* Audio Recorder Button */}
      <AudioRecorderButton onUploadComplete={handleUploadComplete} />

      {/* OR Separator */}
      <div className="text-center font-semibold text-gray-500">OR</div>

      {/* Description Box */}
      <textarea
        value={description}
        onChange={(e) => handleTextareaChange(e.target.value)}
        placeholder="Write your description here..."
        className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={5}
      />

      {/* Optional: show transcription loading */}
      {isTranscribing && <div className="text-gray-500">Transcribing audio...</div>}
    </div>
  );
};

export default AudioDescriptionRecorder;
