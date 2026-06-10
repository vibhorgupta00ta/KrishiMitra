import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Sprout, Droplets, ThermometerSun, FlaskConical, CloudRain } from 'lucide-react';
import { Alert } from '../components/ui/Alert';
import { useTranslation } from 'react-i18next';

export function CropPrediction() {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    nitrogen: '', phosphorus: '', potassium: '',
    temperature: '', humidity: '', ph: '', rainfall: ''
  });
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPrediction(null);
    
    // Validation removed - all fields are now optional
    // The backend uses Farm Location context for missing fields.

    setLoading(true);
    try {
      const userStr = localStorage.getItem('krishimitra_user');
      const token = userStr ? JSON.parse(userStr).token : null;
      
      const res = await axios.post('http://localhost:5000/api/crop/predict', 
        {
          nitrogen: formData.nitrogen !== '' ? Number(formData.nitrogen) : null,
          phosphorus: formData.phosphorus !== '' ? Number(formData.phosphorus) : null,
          potassium: formData.potassium !== '' ? Number(formData.potassium) : null,
          temperature: formData.temperature !== '' ? Number(formData.temperature) : null,
          humidity: formData.humidity !== '' ? Number(formData.humidity) : null,
          ph: formData.ph !== '' ? Number(formData.ph) : null,
          rainfall: formData.rainfall !== '' ? Number(formData.rainfall) : null,
          language: i18n.language
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setPrediction(res.data.predictedCrop);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get prediction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-4 flex items-center justify-center gap-3">
            <Sprout className="w-8 h-8 text-green-600" />
            {t('crop_pred_title')}
          </h1>
          <p className="text-slate-600">{t('crop_pred_subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>{t('crop_soil_env_data')}</CardTitle>
                <CardDescription>{t('crop_optional_msg')}</CardDescription>
              </CardHeader>
              <CardContent>
                {error && <Alert variant="error" className="mb-4">{error}</Alert>}
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  <div className="grid grid-cols-3 gap-4">
                    <Input label={t('crop_nitrogen')} name="nitrogen" type="number" placeholder="e.g. 90" value={formData.nitrogen} onChange={handleChange} required />
                    <Input label={t('crop_phosphorus')} name="phosphorus" type="number" placeholder="e.g. 42" value={formData.phosphorus} onChange={handleChange} required />
                    <Input label={t('crop_potassium')} name="potassium" type="number" placeholder="e.g. 43" value={formData.potassium} onChange={handleChange} required />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <ThermometerSun className="absolute left-3 top-9 text-orange-400 w-5 h-5 z-10" />
                      <Input label={t('crop_temperature')} name="temperature" type="number" step="0.1" placeholder="20.8" className="pl-10" value={formData.temperature} onChange={handleChange} required />
                    </div>
                    <div className="relative">
                      <Droplets className="absolute left-3 top-9 text-blue-400 w-5 h-5 z-10" />
                      <Input label={t('crop_humidity')} name="humidity" type="number" step="0.1" placeholder="82.0" className="pl-10" value={formData.humidity} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <FlaskConical className="absolute left-3 top-9 text-purple-400 w-5 h-5 z-10" />
                      <Input label={t('crop_ph')} name="ph" type="number" step="0.1" placeholder="6.5" className="pl-10" value={formData.ph} onChange={handleChange} required />
                    </div>
                    <div className="relative">
                      <CloudRain className="absolute left-3 top-9 text-sky-400 w-5 h-5 z-10" />
                      <Input label={t('crop_rainfall')} name="rainfall" type="number" step="0.1" placeholder="202.9" className="pl-10" value={formData.rainfall} onChange={handleChange} required />
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
                    {loading ? t('crop_btn_analyzing') : t('crop_btn_predict')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card className="h-full flex flex-col items-center justify-center text-center p-6 bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
              {prediction ? (
                <div className="animate-in zoom-in duration-500">
                  <div className="w-24 h-24 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <Sprout className="w-12 h-12" />
                  </div>
                  <h3 className="text-xl text-green-800 font-semibold mb-2">{t('crop_recommended')}</h3>
                  <p className="text-5xl font-extrabold text-green-900 tracking-tight capitalize">{prediction}</p>
                  <p className="mt-4 text-sm text-green-700">{t('crop_tailored_msg')}</p>
                </div>
              ) : (
                <div className="text-slate-500">
                  <Sprout className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p>{t('crop_waiting_msg')}</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
