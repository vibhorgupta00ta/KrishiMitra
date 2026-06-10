import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { UploadCloud, Image as ImageIcon, ScanSearch, CheckCircle2, AlertTriangle, Bug } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function DiseaseDetection() {
  const { t, i18n } = useTranslation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
        setResult(null);
        setError('');
      } else {
        setError(t('disease_err_not_image') || 'Please select a valid image file.');
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError('');
    } else {
      setError(t('disease_err_not_image') || 'Please drop a valid image file.');
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDetect = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('language', i18n.language);

    try {
      const userStr = localStorage.getItem('krishimitra_user');
      const token = userStr ? JSON.parse(userStr).token : null;

      const response = await axios.post('http://localhost:5000/api/disease/detect', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || t('disease_err_detect') || 'Failed to detect disease. Make sure the ML service is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-4 flex items-center justify-center gap-3">
            <Bug className="w-8 h-8 text-green-600" />
            {t('disease_title') || 'Crop Disease Detection (CNN)'}
          </h1>
          <p className="text-slate-600">
            {t('disease_subtitle') || 'Upload a picture of a diseased crop leaf, and our Convolutional Neural Network will identify the issue.'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle>{t('disease_upload_title') || 'Upload Leaf Image'}</CardTitle>
              <CardDescription>{t('disease_upload_desc') || 'Supported formats: JPG, PNG, JPEG'}</CardDescription>
            </CardHeader>
            <CardContent>
              {error && <Alert variant="error" className="mb-4">{error}</Alert>}

              {!preview ? (
                <div 
                  className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all min-h-[300px]"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <UploadCloud className="w-16 h-16 text-slate-400 mb-4" />
                  <p className="text-slate-700 font-medium mb-1">{t('disease_drag_drop') || 'Drag and drop an image here'}</p>
                  <p className="text-slate-500 text-sm">{t('disease_or_click') || 'or click to browse'}</p>
                  <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="relative w-full h-64 bg-slate-100 rounded-xl overflow-hidden mb-6 border border-slate-200">
                    <img src={preview} alt="Leaf Preview" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex gap-4 w-full">
                    <Button variant="outline" className="flex-1" onClick={clearSelection} disabled={loading}>
                      {t('disease_btn_clear') || 'Clear'}
                    </Button>
                    <Button className="flex-1" onClick={handleDetect} disabled={loading}>
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <ScanSearch className="w-4 h-4 animate-spin" /> 
                          {t('disease_btn_analyzing') || 'Analyzing...'}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <ScanSearch className="w-4 h-4" /> 
                          {t('disease_btn_detect') || 'Detect Disease'}
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>{t('disease_result_title') || 'Analysis Result'}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-b-xl border-t border-slate-100">
              {loading ? (
                <div className="text-center animate-pulse">
                  <ScanSearch className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <p className="text-slate-600">{t('disease_analyzing_msg') || 'Running image through CNN model...'}</p>
                </div>
              ) : result ? (
                <div className="w-full text-center animate-in zoom-in duration-300">
                  {result.disease === 'Healthy_Leaf' || result.disease === 'स्वस्थ पत्ता' ? (
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertTriangle className="w-10 h-10 text-red-600" />
                    </div>
                  )}
                  
                  <h3 className="text-sm text-slate-500 uppercase tracking-wider font-semibold mb-1">
                    {t('disease_detected') || 'Detected Condition'}
                  </h3>
                  <p className={`text-3xl font-bold mb-2 ${result.disease === 'Healthy_Leaf' ? 'text-green-700' : 'text-red-700'}`}>
                    {result.disease.replace(/_/g, ' ')}
                  </p>
                  
                  <div className="inline-block bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm mt-4">
                    <span className="text-slate-600 text-sm mr-2">{t('disease_confidence') || 'AI Confidence:'}</span>
                    <span className="font-bold text-slate-900">{result.confidence}%</span>
                  </div>
                </div>
              ) : (
                <div className="text-slate-400 text-center">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p>{t('disease_waiting') || 'Upload an image and click Detect to see the results here.'}</p>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
