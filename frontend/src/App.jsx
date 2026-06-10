import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Button } from './components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './components/ui/Card';
import { Sprout } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { DiseaseDetection } from './pages/DiseaseDetection';
import { Chatbot } from './components/chat/Chatbot';

// Temporary Home Page Component
const Home = () => {
  const { t } = useTranslation();
  
  return (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
      <Sprout className="w-10 h-10" />
    </div>
    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4 sm:text-5xl">
      {t('home_title_1')} <span className="text-green-600">{t('app_name')}</span>
    </h1>
    <p className="max-w-2xl text-lg text-slate-600 mb-8">
      {t('home_subtitle')}
    </p>
    <div className="flex space-x-4">
      <Button size="lg" className="rounded-full">{t('home_get_started')}</Button>
      <Button size="lg" variant="outline" className="rounded-full">{t('home_learn_more')}</Button>
    </div>
    
    <div className="grid md:grid-cols-2 gap-8 w-full mt-20 text-left">
       <Card>
         <CardHeader>
           <CardTitle>{t('home_crop_pred_title')}</CardTitle>
           <CardDescription>{t('home_crop_pred_desc')}</CardDescription>
         </CardHeader>
         <CardContent>
           <p className="text-slate-600 mb-4">{t('home_crop_pred_text')}</p>
           <Button variant="outline" className="w-full">{t('home_try_now')}</Button>
         </CardContent>
       </Card>
       <Card>
         <CardHeader>
           <CardTitle>{t('home_disease_title')}</CardTitle>
           <CardDescription>{t('home_disease_desc')}</CardDescription>
         </CardHeader>
         <CardContent>
           <p className="text-slate-600 mb-4">{t('home_disease_text')}</p>
           <Button variant="outline" className="w-full">{t('home_upload_image')}</Button>
         </CardContent>
       </Card>
    </div>
  </div>
  );
};

import { Dashboard } from './pages/Dashboard';
import { CropPrediction } from './pages/CropPrediction';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/crop-prediction" element={<CropPrediction />} />
          <Route path="/detect-disease" element={<DiseaseDetection />} />
          <Route path="*" element={<Home />} />
        </Routes>
        <Chatbot />
      </MainLayout>
    </Router>
  );
}

export default App;
