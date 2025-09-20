import React, { useRef, useState, useEffect } from "react";

interface UploadPictureProps {
  onFileSelect?: (file: File | null) => void;
}

const UploadPicture: React.FC<UploadPictureProps> = ({ onFileSelect }) => {
  const [devicePhoto, setDevicePhoto] = useState<File | null>(null);
  const [cameraPhoto, setCameraPhoto] = useState<File | null>(null);
  const [devicePreview, setDevicePreview] = useState<string | null>(null);
  const [cameraPreview, setCameraPreview] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  // create/revoke preview URLs for devicePhoto
  useEffect(() => {
    if (!devicePhoto) {
      setDevicePreview(null);
      return;
    }
    const url = URL.createObjectURL(devicePhoto);
    setDevicePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [devicePhoto]);

  // create/revoke preview URLs for cameraPhoto
  useEffect(() => {
    if (!cameraPhoto) {
      setCameraPreview(null);
      return;
    }
    const url = URL.createObjectURL(cameraPhoto);
    setCameraPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [cameraPhoto]);

  // cleanup any open camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const handleDeviceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setDevicePhoto(file);
    onFileSelect?.(file);
  };

  const startCamera = async () => {
    try {
      setShowCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // try to play; ignore play() promise errors
        videoRef.current.play().catch(() => {});
      }
    } catch (err) {
      console.error("Couldn't start camera:", err);
      setShowCamera(false);
      // optionally notify the user here
    }
  };

  const closeCamera = () => {
    setShowCamera(false);
    setCameraPhoto(null);       // ✅ clear camera file
    setCameraPreview(null);     // ✅ clear preview URL
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    // set canvas size to desired output (square)
    const size = 400; // change as needed
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // draw centered crop (attempt to square-crop the center)
    const vw = video.videoWidth || video.clientWidth;
    const vh = video.videoHeight || video.clientHeight;
    const minSide = Math.min(vw, vh);
    const sx = (vw - minSide) / 2;
    const sy = (vh - minSide) / 2;
    ctx.drawImage(video, sx, sy, minSide, minSide, 0, 0, size, size);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `camera-${Date.now()}.png`, { type: blob.type });
      setCameraPhoto(file);
      onFileSelect?.(file);

      // stop camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (videoRef.current) videoRef.current.srcObject = null;
      setShowCamera(false);
    }, "image/png");
  };

  return (
    <div className="flex gap-6">
      {/* Upload from device */}
      <div className="flex flex-col items-center">
        <label
          htmlFor="upload-device"
          className="w-28 h-28 flex items-center justify-center border-2 border-dashed rounded-lg text-white cursor-pointer hover:bg-gray-800 transition text-center overflow-hidden"
        >
          {devicePreview ? (
            <img
              src={devicePreview}
              alt="Device Preview"
              className="object-cover w-full h-full rounded-lg"
            />
          ) : (
            <span className="whitespace-pre-line">Upload{"\n"}from Device</span>
          )}
        </label>
        <input
          id="upload-device"
          type="file"
          accept="image/*"
          onChange={handleDeviceChange}
          className="hidden"
        />
      </div>

      {/* Capture from camera */}
      <div className="flex flex-col items-center">
        {!cameraPhoto ? (
          <button
            type="button"
            onClick={startCamera}
            className="w-28 h-28 border-2 border-dashed rounded-lg text-white hover:bg-gray-800 transition"
          >
            Open Camera
          </button>
        ) : (
          <button
            type="button"
            onClick={startCamera} // clicking preview reopens camera for retake
            className="w-28 h-28 border-2 border-dashed rounded-lg overflow-hidden relative p-0"
            aria-label="Retake photo"
          >
            {cameraPreview && (
                <img
                    src={cameraPreview}
                    alt="Camera Preview"
                    className="object-cover w-full h-full rounded-lg"
                />
            )}
            <span className="absolute top-1 right-1 bg-black bg-opacity-50 text-xs px-1 rounded text-white">
              Retake
            </span>
          </button>
        )}
      </div>

      {/* Camera Preview Modal */}
      {showCamera && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex flex-col items-center justify-center p-4">
          <div className="bg-black p-2 rounded">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-80 h-80 bg-black object-cover"
            />
          </div>

          <canvas ref={canvasRef} className="hidden" />

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={takePhoto}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Take Photo
            </button>
            <button
              type="button"
              onClick={closeCamera}
              className="px-4 py-2 bg-gray-600 text-white rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPicture;

