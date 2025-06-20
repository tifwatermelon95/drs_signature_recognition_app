
import React, { useRef, useState, useCallback } from 'react';
import { Camera } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useCamera } from "@/hooks/useCamera";
import CameraPreview from "@/components/camera/CameraPreview";
import CapturedImageView from "@/components/camera/CapturedImageView";
import CameraTips from "@/components/camera/CameraTips";
import CameraInitialView from "@/components/camera/CameraInitialView";

interface CameraCaptureProps {
  onImageCapture: (imageUrl: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onImageCapture }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  const {
    videoRef,
    canvasRef,
    isStreaming,
    isLoading,
    startCamera,
    stopCamera,
    captureImage
  } = useCamera((imageUrl) => {
    setCapturedImage(imageUrl);
    onImageCapture(imageUrl);
  });

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setCapturedImage(imageUrl);
        onImageCapture(imageUrl);
        toast.success('Image uploaded successfully!');
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Please select a valid image file.');
    }
  }, [onImageCapture]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Camera className="h-5 w-5 text-blue-600" />
            <span>Capture Signature</span>
          </CardTitle>
          <CardDescription>
            Position the signature clearly in the frame and tap capture
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isStreaming && !capturedImage && (
            <CameraInitialView
              onStartCamera={startCamera}
              onFileUpload={() => fileInputRef.current?.click()}
              isLoading={isLoading}
            />
          )}

          {isStreaming && (
            <CameraPreview
              videoRef={videoRef}
              isStreaming={isStreaming}
              onCapture={captureImage}
              onCancel={stopCamera}
            />
          )}

          {capturedImage && (
            <CapturedImageView
              imageUrl={capturedImage}
              onRetake={retakePhoto}
            />
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <canvas ref={canvasRef} className="hidden" />
        </CardContent>
      </Card>

      <CameraTips />
    </div>
  );
};

export default CameraCapture;
