
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
    <div className="bg-gray-100 rounded-lg p-8 text-center">
      <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-600 mb-4">Ready to scan signature</p>
      <div className="space-y-2">
        <Button 
          onClick={onStartCamera} 
          className="w-full" 
          disabled={isLoading}
        >
          <Camera className="h-4 w-4 mr-2" />
          {isLoading ? 'Starting Camera...' : 'Start Camera'}
        </Button>
        <Button 
          variant="outline" 
          onClick={onFileUpload}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Image
        </Button>
      </div>
    </div>
  );
};

export default CameraInitialView;
