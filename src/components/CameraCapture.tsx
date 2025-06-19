
import React, { useRef, useState, useCallback } from 'react';
import { Camera, Upload, RotateCcw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface CameraCaptureProps {
  onImageCapture: (imageUrl: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onImageCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsStreaming(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Unable to access camera. Please check permissions.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsStreaming(false);
    }
  }, []);

  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        const imageUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageUrl);
        onImageCapture(imageUrl);
        stopCamera();
        toast.success('Signature captured successfully!');
      }
    }
  }, [onImageCapture, stopCamera]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setCapturedImage(imageUrl);
        onImageCapture(imageUrl);
        toast.success('Image uploaded successfully!');
      };
      reader.readAsDataURL(file);
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
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Ready to scan signature</p>
                <div className="space-y-2">
                  <Button onClick={startCamera} className="w-full">
                    <Camera className="h-4 w-4 mr-2" />
                    Start Camera
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                </div>
              </div>
            </div>
          )}

          {isStreaming && (
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  className="w-full h-64 object-cover"
                  playsInline
                  muted
                />
                <div className="absolute inset-0 border-2 border-dashed border-white/50 m-4 rounded-lg flex items-center justify-center">
                  <div className="text-white text-center">
                    <p className="text-sm font-medium">Position signature here</p>
                    <p className="text-xs opacity-75">Ensure good lighting</p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button onClick={captureImage} className="flex-1">
                  <Camera className="h-4 w-4 mr-2" />
                  Capture
                </Button>
                <Button variant="outline" onClick={stopCamera}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {capturedImage && (
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src={capturedImage}
                  alt="Captured signature"
                  className="w-full h-64 object-cover border border-gray-200"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={retakePhoto} variant="outline" className="flex-1">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retake
                </Button>
                <Button className="flex-1">
                  Analyze Signature
                </Button>
              </div>
            </div>
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

      {/* Tips Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4">
          <h3 className="font-medium text-blue-900 mb-2">Scanning Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Ensure good lighting conditions</li>
            <li>• Keep the signature centered and clear</li>
            <li>• Avoid shadows and reflections</li>
            <li>• Hold the device steady</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default CameraCapture;
