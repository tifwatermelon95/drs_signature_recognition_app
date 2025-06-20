
import React from 'react';
import { Camera, Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface CameraInitialViewProps {
  onStartCamera: () => void;
  onFileUpload: () => void;
  isLoading: boolean;
}

const CameraInitialView: React.FC<CameraInitialViewProps> = ({
  onStartCamera,
  onFileUpload,
  isLoading
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
      <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Take a Photo</h3>
      <p className="text-gray-600 mb-6">Capture a signature or upload an existing image</p>
      <div className="space-y-3">
        <Button 
          onClick={onStartCamera} 
          size="lg"
          className="w-full bg-blue-600 hover:bg-blue-700" 
          disabled={isLoading}
        >
          <Camera className="h-5 w-5 mr-2" />
          {isLoading ? 'Starting Camera...' : 'Open Camera'}
        </Button>
        <Button 
          variant="outline" 
          onClick={onFileUpload}
          size="lg"
          className="w-full"
        >
          <Upload className="h-5 w-5 mr-2" />
          Upload from Device
        </Button>
      </div>
    </div>
  );
};

export default CameraInitialView;
