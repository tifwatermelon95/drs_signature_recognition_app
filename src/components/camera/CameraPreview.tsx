
import React from 'react';
import { Camera } from 'lucide-react';
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
      <div className="relative rounded-lg overflow-hidden bg-black">
        <video
          ref={videoRef}
          className="w-full h-80 object-cover"
          playsInline
          muted
          autoPlay
        />
        <div className="absolute inset-0 border-2 border-dashed border-white/70 m-6 rounded-lg flex items-center justify-center pointer-events-none">
          <div className="text-white text-center bg-black/50 rounded-lg p-3">
            <p className="text-sm font-medium">Position signature here</p>
            <p className="text-xs opacity-75">Ensure good lighting and focus</p>
          </div>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button 
          onClick={onCapture} 
          className="flex-1 bg-green-600 hover:bg-green-700"
          disabled={!isStreaming}
        >
          <Camera className="h-4 w-4 mr-2" />
          Take Photo
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default CameraPreview;
