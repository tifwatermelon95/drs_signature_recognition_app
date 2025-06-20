
import React from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface CapturedImageViewProps {
  imageUrl: string;
  onRetake: () => void;
}

const CapturedImageView: React.FC<CapturedImageViewProps> = ({
  imageUrl,
  onRetake
}) => {
  return (
    <div className="space-y-4">
      <div className="relative rounded-lg overflow-hidden bg-gray-50 p-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Captured Signature:</p>
        <img
          src={imageUrl}
          alt="Captured signature"
          className="w-full max-h-64 object-contain border border-gray-200 rounded"
        />
      </div>
      <div className="flex space-x-2">
        <Button onClick={onRetake} variant="outline" className="flex-1">
          <RotateCcw className="h-4 w-4 mr-2" />
          Retake Photo
        </Button>
        <Button 
          className="flex-1"
          onClick={() => {
            const analysisTab = document.querySelector('[data-tab="analysis"]') as HTMLElement;
            if (analysisTab) {
              analysisTab.click();
            }
          }}
        >
          Analyze Signature
        </Button>
      </div>
    </div>
  );
};

export default CapturedImageView;
