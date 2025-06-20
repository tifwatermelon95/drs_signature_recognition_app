
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
  const [isLoading, setIsLoading] = useState(false);

  const startCamera = useCallback(async () => {
    setIsLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play().then(() => {
              setIsStreaming(true);
              setIsLoading(false);
              toast.success('Camera started successfully!');
            }).catch((error) => {
              console.error('Error playing video:', error);
              setIsLoading(false);
              toast.error('Error starting camera preview');
            });
          }
        };
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsLoading(false);
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          toast.error('Camera access denied. Please allow camera permissions and try again.');
        } else if (error.name === 'NotFoundError') {
          toast.error('No camera found on this device.');
        } else {
          toast.error('Unable to access camera: ' + error.message);
        }
      } else {
        toast.error('Unable to access camera. Please check permissions.');
      }
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  }, []);

  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current && isStreaming) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      if (context && video.videoWidth > 0 && video.videoHeight > 0) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw the current video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to base64 image
        const imageUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(imageUrl);
        onImageCapture(imageUrl);
        stopCamera();
        toast.success('Signature captured successfully!');
      } else {
        toast.error('Unable to capture image. Please ensure camera is working properly.');
      }
    } else {
      toast.error('Camera not ready. Please wait for camera to start.');
    }
  }, [onImageCapture, stopCamera, isStreaming]);

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
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Ready to scan signature</p>
                <div className="space-y-2">
                  <Button 
                    onClick={startCamera} 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {isLoading ? 'Starting Camera...' : 'Start Camera'}
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
                  onClick={captureImage} 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={!isStreaming}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Take Photo
                </Button>
                <Button variant="outline" onClick={stopCamera}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {capturedImage && (
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Captured Signature:</p>
                <img
                  src={capturedImage}
                  alt="Captured signature"
                  className="w-full max-h-64 object-contain border border-gray-200 rounded"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={retakePhoto} variant="outline" className="flex-1">
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
            <li>• Hold the device steady while capturing</li>
            <li>• Make sure the signature fills most of the frame</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default CameraCapture;
