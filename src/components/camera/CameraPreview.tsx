
import React from 'react';
import { Camera, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface CameraPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isStreaming: boolean;
  onCapture: () => void;
  onCancel: () => void;
}

const CameraPreview: React.FC<CameraPreviewProps> = ({
  videoRef,
  isStreaming,
  onCapture,
  onCancel
}) => {
  return (
    <div className="space-y-4">
      <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
          autoPlay
        />
        {isStreaming && (
          <div className="absolute inset-4 border-2 border-dashed border-white/70 rounded-lg flex items-center justify-center pointer-events-none">
            <div className="text-white text-center bg-black/50 rounded-lg p-3">
              <p className="text-sm font-medium">Position signature here</p>
              <p className="text-xs opacity-75">Tap the capture button when ready</p>
            </div>
          </div>
        )}
      </div>
      <div className="flex space-x-3">
        <Button 
          onClick={onCapture} 
          size="lg"
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold"
          disabled={!isStreaming}
        >
          <Camera className="h-5 w-5 mr-2" />
          Capture Photo
        </Button>
        <Button variant="outline" onClick={onCancel} size="lg">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CameraPreview;
