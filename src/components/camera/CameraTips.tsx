
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const CameraTips: React.FC = () => {
  return (
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
  );
};

export default CameraTips;
