
import React, { useState, useEffect } from 'react';
import { Database, FileImage, Upload, Camera } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  signatureImage: string;
  dateAdded: string;
}

const SignatureDatabase: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isAddingDoctor, setIsAddingDoctor] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    specialty: '',
    signatureImage: ''
  });

  useEffect(() => {
    // Load doctors from localStorage
    const savedDoctors = localStorage.getItem('doctors');
    if (savedDoctors) {
      setDoctors(JSON.parse(savedDoctors));
    }
  }, []);

  const saveDoctors = (updatedDoctors: Doctor[]) => {
    localStorage.setItem('doctors', JSON.stringify(updatedDoctors));
    setDoctors(updatedDoctors);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewDoctor(prev => ({
          ...prev,
          signatureImage: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addDoctor = () => {
    if (!newDoctor.name || !newDoctor.specialty || !newDoctor.signatureImage) {
      toast.error('Please fill in all fields and upload a signature');
      return;
    }

    const doctor: Doctor = {
      id: Date.now().toString(),
      name: newDoctor.name,
      specialty: newDoctor.specialty,
      signatureImage: newDoctor.signatureImage,
      dateAdded: new Date().toLocaleDateString()
    };

    const updatedDoctors = [...doctors, doctor];
    saveDoctors(updatedDoctors);
    
    setNewDoctor({ name: '', specialty: '', signatureImage: '' });
    setIsAddingDoctor(false);
    toast.success('Doctor added to database successfully!');
  };

  const removeDoctor = (id: string) => {
    const updatedDoctors = doctors.filter(doctor => doctor.id !== id);
    saveDoctors(updatedDoctors);
    toast.success('Doctor removed from database');
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-green-600" />
                <span>Signature Database</span>
              </CardTitle>
              <CardDescription>
                Manage doctor signatures for recognition
              </CardDescription>
            </div>
            <Button onClick={() => setIsAddingDoctor(true)}>
              Add Doctor
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {doctors.length === 0 ? (
            <div className="text-center py-8">
              <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No doctors in database yet</p>
              <p className="text-sm text-gray-500">Add your first doctor signature to get started</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {doctors.map((doctor) => (
                <Card key={doctor.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          src={doctor.signatureImage}
                          alt={`${doctor.name}'s signature`}
                          className="w-24 h-16 object-cover rounded border"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{doctor.name}</h3>
                        <p className="text-sm text-gray-600">{doctor.specialty}</p>
                        <p className="text-xs text-gray-500 mt-1">Added: {doctor.dateAdded}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeDoctor(doctor.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {isAddingDoctor && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle>Add New Doctor</CardTitle>
            <CardDescription>
              Enter doctor details and upload their signature sample
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="doctorName">Doctor Name</Label>
              <Input
                id="doctorName"
                value={newDoctor.name}
                onChange={(e) => setNewDoctor(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Dr. John Smith"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="specialty">Specialty</Label>
              <Input
                id="specialty"
                value={newDoctor.specialty}
                onChange={(e) => setNewDoctor(prev => ({ ...prev, specialty: e.target.value }))}
                placeholder="Cardiology, Neurology, etc."
              />
            </div>

            <div className="space-y-2">
              <Label>Signature Sample</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                {newDoctor.signatureImage ? (
                  <div className="space-y-2">
                    <img
                      src={newDoctor.signatureImage}
                      alt="Signature preview"
                      className="w-full h-32 object-cover rounded border"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setNewDoctor(prev => ({ ...prev, signatureImage: '' }))}
                    >
                      Remove Image
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <FileImage className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Upload signature image</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="signatureUpload"
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('signatureUpload')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-2">
              <Button onClick={addDoctor} className="flex-1">
                Add Doctor
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingDoctor(false);
                  setNewDoctor({ name: '', specialty: '', signatureImage: '' });
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4">
          <h3 className="font-medium text-blue-900 mb-2">Database Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Add multiple signature samples per doctor for better accuracy</li>
            <li>• Use clear, high-quality signature images</li>
            <li>• Include doctor's full name and specialty</li>
            <li>• Regularly update the database with new signatures</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignatureDatabase;
