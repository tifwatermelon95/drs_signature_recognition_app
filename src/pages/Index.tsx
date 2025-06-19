
import React, { useState } from 'react';
import { Camera, Database, Scan, FileImage } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CameraCapture from "@/components/CameraCapture";
import SignatureDatabase from "@/components/SignatureDatabase";
import SignatureAnalysis from "@/components/SignatureAnalysis";

const Index = () => {
  const [activeView, setActiveView] = useState<'scan' | 'database' | 'analysis'>('scan');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Scan className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MedSign Scanner</h1>
                <p className="text-sm text-gray-600">Hospital Signature Recognition</p>
              </div>
            </div>
            <div className="text-xs text-gray-500 bg-green-100 px-2 py-1 rounded-full">
              Pharmacy Assistant
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={activeView === 'scan' ? 'default' : 'outline'}
            onClick={() => setActiveView('scan')}
            className="flex items-center justify-center space-x-2 py-3"
          >
            <Camera className="h-4 w-4" />
            <span>Scan</span>
          </Button>
          <Button
            variant={activeView === 'database' ? 'default' : 'outline'}
            onClick={() => setActiveView('database')}
            className="flex items-center justify-center space-x-2 py-3"
          >
            <Database className="h-4 w-4" />
            <span>Database</span>
          </Button>
          <Button
            variant={activeView === 'analysis' ? 'default' : 'outline'}
            onClick={() => setActiveView('analysis')}
            className="flex items-center justify-center space-x-2 py-3"
          >
            <FileImage className="h-4 w-4" />
            <span>Analysis</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        {activeView === 'scan' && (
          <CameraCapture onImageCapture={setCapturedImage} />
        )}
        {activeView === 'database' && (
          <SignatureDatabase />
        )}
        {activeView === 'analysis' && (
          <SignatureAnalysis capturedImage={capturedImage} />
        )}
      </div>

      {/* Quick Stats */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="grid grid-cols-3 gap-4">
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-blue-600">0</div>
              <div className="text-sm text-gray-600">Signatures Scanned</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-gray-600">Doctors in Database</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-purple-600">0%</div>
              <div className="text-sm text-gray-600">Match Accuracy</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
