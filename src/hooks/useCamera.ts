
import { useRef, useState, useCallback } from 'react';
import { toast } from "sonner";

export const useCamera = (onImageCapture: (imageUrl: string) => void) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const startCamera = useCallback(async () => {
    setIsLoading(true);
    try {
      // Stop any existing stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      console.log('Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      
      console.log('Camera stream obtained:', stream);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for metadata to load
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          if (videoRef.current) {
            videoRef.current.play()
              .then(() => {
                console.log('Video playing successfully');
                setIsStreaming(true);
                setIsLoading(false);
                toast.success('Camera started successfully!');
              })
              .catch((error) => {
                console.error('Error playing video:', error);
                setIsLoading(false);
                toast.error('Error starting camera preview');
              });
          }
        };

        // Handle video errors
        videoRef.current.onerror = (error) => {
          console.error('Video element error:', error);
          setIsLoading(false);
          toast.error('Video playback error');
        };
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsLoading(false);
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          toast.error('Camera access denied. Please allow camera permissions and refresh the page.');
        } else if (error.name === 'NotFoundError') {
          toast.error('No camera found on this device.');
        } else if (error.name === 'NotReadableError') {
          toast.error('Camera is already in use by another application.');
        } else {
          toast.error('Unable to access camera: ' + error.message);
        }
      } else {
        toast.error('Unable to access camera. Please check permissions.');
      }
    }
  }, []);

  const stopCamera = useCallback(() => {
    console.log('Stopping camera...');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        console.log('Stopping track:', track.kind);
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  }, []);

  const captureImage = useCallback(() => {
    console.log('Attempting to capture image...');
    if (videoRef.current && canvasRef.current && isStreaming) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight);
      
      if (context && video.videoWidth > 0 && video.videoHeight > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageUrl = canvas.toDataURL('image/jpeg', 0.9);
        console.log('Image captured successfully, data URL length:', imageUrl.length);
        onImageCapture(imageUrl);
        stopCamera();
        toast.success('Signature captured successfully!');
      } else {
        console.error('Invalid video dimensions or context');
        toast.error('Unable to capture image. Please ensure camera is working properly.');
      }
    } else {
      console.error('Camera not ready for capture. isStreaming:', isStreaming);
      toast.error('Camera not ready. Please wait for camera to start.');
    }
  }, [onImageCapture, stopCamera, isStreaming]);

  return {
    videoRef,
    canvasRef,
    isStreaming,
    isLoading,
    startCamera,
    stopCamera,
    captureImage
  };
};
