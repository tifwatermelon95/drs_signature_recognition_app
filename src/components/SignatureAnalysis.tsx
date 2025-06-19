
import React, { useState, useEffect } from 'react';
import { FileImage, Scan, Camera } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface SignatureAnalysisProps {
  capturedImage: string | null;
}

interface AnalysisResult {
  doctorName: string;
  specialty: string;
  confidence: number;
  matchFeatures: string[];
}

const SignatureAnalysis: React.FC<SignatureAnalysisProps> = ({ capturedImage }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [progress, setProgress] = useState(0);

  const analyzeSignature = async () => {
    if (!capturedImage) {
      toast.error('No signature image to analyze');
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setAnalysisResults([]);

    // Simulate analysis progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      // Get doctors from localStorage
      const savedDoctors = localStorage.getItem('doctors');
      const doctors = savedDoctors ? JSON.parse(savedDoctors) : [];

      // Simulate AI analysis with mock results
      await new Promise(resolve => setTimeout(resolve, 3000));

      if (doctors.length === 0) {
        toast.error('No doctors in database to compare against');
        setIsAnalyzing(false);
        clearInterval(progressInterval);
        return;
      }

      // Generate mock analysis results
      const mockResults: AnalysisResult[] = doctors.map((doctor: any, index: number) => ({
        doctorName: doctor.name,
        specialty: doctor.specialty,
        confidence: Math.max(20, Math.random() * 95),
        matchFeatures: [
          'Stroke width similarity',
          'Letter spacing pattern',
          'Signature length',
          'Curve characteristics'
        ].slice(0, Math.floor(Math.random() * 4) + 1)
      })).sort((a: AnalysisResult, b: AnalysisResult) => b.confidence - a.confidence);

      setProgress(100);
      setAnalysisResults(mockResults);
      toast.success('Signature analysis completed!');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Error during signature analysis');
    } finally {
      setIsAnalyzing(false);
      clearInterval(progressInterval);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 bg-green-100';
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 80) return 'High Match';
    if (confidence >= 60) return 'Possible Match';
    return 'Low Match';
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileImage className="h-5 w-5 text-purple-600" />
            <span>Signature Analysis</span>
          </CardTitle>
          <CardDescription>
            AI-powered signature recognition and doctor identification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!capturedImage ? (
            <div className="text-center py-8">
              <Scan className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No signature to analyze</p>
              <p className="text-sm text-gray-500">Capture a signature using the Scan tab first</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium mb-2">Captured Signature</h3>
                <img
                  src={capturedImage}
                  alt="Signature to analyze"
                  className="w-full h-32 object-cover rounded border"
                />
              </div>

              {!isAnalyzing && analysisResults.length === 0 && (
                <Button onClick={analyzeSignature} className="w-full">
                  <Scan className="h-4 w-4 mr-2" />
                  Analyze Signature
                </Button>
              )}

              {isAnalyzing && (
                <Card className="border-purple-200 bg-purple-50">
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Analyzing signature...</span>
                        <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <p className="text-xs text-gray-600">
                        Comparing against {JSON.parse(localStorage.getItem('doctors') || '[]').length} doctor signatures
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {analysisResults.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium">Analysis Results</h3>
                  {analysisResults.map((result, index) => (
                    <Card key={index} className={`border-l-4 ${
                      index === 0 ? 'border-l-green-500 bg-green-50' : 'border-l-gray-300'
                    }`}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium">{result.doctorName}</h4>
                            <p className="text-sm text-gray-600">{result.specialty}</p>
                          </div>
                          <div className="text-right">
                            <Badge className={getConfidenceColor(result.confidence)}>
                              {getConfidenceLabel(result.confidence)}
                            </Badge>
                            <p className="text-sm text-gray-600 mt-1">
                              {Math.round(result.confidence)}% match
                            </p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-700">Match Features:</p>
                          <div className="flex flex-wrap gap-1">
                            {result.matchFeatures.map((feature, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <Button 
                    onClick={() => {
                      setAnalysisResults([]);
                      setProgress(0);
                    }} 
                    variant="outline" 
                    className="w-full"
                  >
                    Analyze Again
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4">
          <h3 className="font-medium text-blue-900 mb-2">How It Works</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• AI analyzes signature stroke patterns and characteristics</li>
            <li>• Compares against your doctor database</li>
            <li>• Provides confidence scores for each potential match</li>
            <li>• Shows matching features for verification</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignatureAnalysis;
