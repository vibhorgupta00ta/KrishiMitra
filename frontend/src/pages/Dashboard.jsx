import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';
import { Sprout, MapPin, CloudSun, Target, ThermometerSun, Wind, Settings, Leaf } from 'lucide-react';

export function Dashboard() {
  const { t } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [setupMode, setSetupMode] = useState(false);
  const [farmData, setFarmData] = useState({ farmSize: '', soilType: '', state: '', district: '', newCrop: '' });
  const [plantedCrops, setPlantedCrops] = useState([]);
  const [error, setError] = useState('');

  const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('krishimitra_user'));
    return user && user.token ? { Authorization: `Bearer ${user.token}` } : {};
  };

  const fetchDashboardData = async () => {
    try {
      const headers = getAuthHeader();
      
      // Fetch Profile
      const profileRes = await axios.get('http://localhost:5000/api/farmer/profile', { headers });
      setProfile(profileRes.data);
      
      if (profileRes.data.farmDetails) {
        const { farmSize, soilType, state, district, plantedCrops } = profileRes.data.farmDetails;
        setFarmData(prev => ({ ...prev, farmSize, soilType, state, district }));
        setPlantedCrops(plantedCrops || []);
        fetchWeather(district);
      } else {
        setSetupMode(true);
      }

      // Fetch History
      const historyRes = await axios.get('http://localhost:5000/api/crop/history', { headers });
      setHistory(historyRes.data);

    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async (district) => {
    try {
      // Get coordinates for district
      const geoRes = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${district}&count=1`);
      if (geoRes.data.results && geoRes.data.results.length > 0) {
        const { latitude, longitude } = geoRes.data.results[0];
        // Get weather
        const weatherRes = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
        setWeather(weatherRes.data.current_weather);
      }
    } catch (err) {
      console.error("Weather fetch error", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleFarmUpdate = async (e) => {
    e.preventDefault();
    try {
      const headers = getAuthHeader();
      await axios.put('http://localhost:5000/api/farmer/profile', {
        farmSize: farmData.farmSize,
        soilType: farmData.soilType,
        state: farmData.state,
        district: farmData.district,
        plantedCrops
      }, { headers });
      setSetupMode(false);
      fetchDashboardData(); // Refresh all
    } catch (err) {
      setError('Failed to update farm details.');
    }
  };

  const addCrop = () => {
    if (farmData.newCrop && !plantedCrops.includes(farmData.newCrop)) {
      setPlantedCrops([...plantedCrops, farmData.newCrop]);
      setFarmData({ ...farmData, newCrop: '' });
    }
  };

  const removeCrop = (cropToRemove) => {
    setPlantedCrops(plantedCrops.filter(c => c !== cropToRemove));
  };

  if (loading) return <div className="text-center py-20 text-slate-500">Loading Dashboard...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t('dash_hello')} {profile?.name}!</h1>
          <p className="text-slate-500">{t('dash_overview')}</p>
        </div>
        {!setupMode && (
          <Button variant="outline" onClick={() => setSetupMode(true)} className="flex items-center gap-2">
            <Settings className="w-4 h-4" /> Edit Farm
          </Button>
        )}
      </div>

      {error && <Alert variant="error" className="mb-6">{error}</Alert>}

      {setupMode ? (
        <Card className="max-w-2xl mx-auto border-green-200">
          <CardHeader>
            <CardTitle>Farm Details Setup</CardTitle>
            <CardDescription>Tell us about your farm so we can give better suggestions.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFarmUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Farm Size (Acres)" type="number" value={farmData.farmSize} onChange={e => setFarmData({...farmData, farmSize: e.target.value})} required />
                <Input label="Soil Type" value={farmData.soilType} onChange={e => setFarmData({...farmData, soilType: e.target.value})} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="State" value={farmData.state} onChange={e => setFarmData({...farmData, state: e.target.value})} required />
                <Input label="District / City" value={farmData.district} onChange={e => setFarmData({...farmData, district: e.target.value})} required />
              </div>
              
              <div className="pt-4 border-t border-slate-100">
                <label className="block text-sm font-medium text-slate-700 mb-2">Planted Crops</label>
                <div className="flex gap-2 mb-3">
                  <Input placeholder="e.g. Wheat" value={farmData.newCrop} onChange={e => setFarmData({...farmData, newCrop: e.target.value})} />
                  <Button type="button" onClick={addCrop} variant="secondary">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {plantedCrops.map(crop => (
                    <span key={crop} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      {crop}
                      <button type="button" onClick={() => removeCrop(crop)} className="text-green-600 hover:text-green-900">&times;</button>
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                {profile?.farmDetails && <Button type="button" variant="outline" onClick={() => setSetupMode(false)}>Cancel</Button>}
                <Button type="submit">Save Farm Details</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Farm Details Card */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-green-800 flex items-center gap-2 text-lg">
                <MapPin className="w-5 h-5" /> {t('dash_farm_details')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mt-2">
                <div className="flex justify-between border-b border-green-200/50 pb-2">
                  <span className="text-slate-600">{t('dash_total_land')}</span>
                  <span className="font-semibold text-slate-900">{profile?.farmDetails?.farmSize} {t('dash_acres')}</span>
                </div>
                <div className="flex justify-between border-b border-green-200/50 pb-2">
                  <span className="text-slate-600">Location</span>
                  <span className="font-semibold text-slate-900">{profile?.farmDetails?.district}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Soil</span>
                  <span className="font-semibold text-slate-900">{profile?.farmDetails?.soilType}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Planted Crops Card */}
          <Card className="border-blue-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-blue-800 flex items-center gap-2 text-lg">
                <Sprout className="w-5 h-5" /> {t('dash_currently_planted')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {plantedCrops.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {plantedCrops.map(crop => (
                    <span key={crop} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1">
                      <Leaf className="w-3 h-3" /> {crop}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm mt-2">No crops currently planted.</p>
              )}
            </CardContent>
          </Card>

          {/* Weather Card */}
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-orange-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-orange-800 flex items-center gap-2 text-lg">
                <CloudSun className="w-5 h-5" /> {t('dash_weather')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {weather ? (
                <div className="mt-2 text-center">
                  <div className="text-4xl font-black text-orange-600 mb-2">{weather.temperature}°C</div>
                  <div className="flex justify-center items-center gap-4 text-sm text-orange-800 font-medium">
                    <span className="flex items-center gap-1"><Wind className="w-4 h-4" /> {weather.windspeed} km/h</span>
                  </div>
                  <p className="text-xs text-orange-600/70 mt-3">{t('dash_weather_desc')} {profile?.farmDetails?.district}</p>
                </div>
              ) : (
                <p className="text-slate-500 text-sm mt-2">Weather data unavailable.</p>
              )}
            </CardContent>
          </Card>

          {/* Suggested Crops Card */}
          <Card className="border-purple-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-purple-800 flex items-center gap-2 text-lg">
                <Target className="w-5 h-5" /> {t('dash_suggested_crops')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {history.length > 0 ? (
                <div className="mt-2">
                  <p className="text-sm text-slate-500 mb-1">Latest AI Recommendation</p>
                  <div className="text-2xl font-bold text-purple-700 bg-purple-100 inline-block px-4 py-2 rounded-lg">
                    {history[0].predictedCrop}
                  </div>
                  <p className="text-xs text-slate-400 mt-4">{t('dash_based_on_history')}</p>
                </div>
              ) : (
                <div className="mt-2 text-center">
                  <p className="text-slate-500 text-sm mb-3">{t('dash_no_suggestions')}</p>
                  <Button variant="outline" size="sm" onClick={() => window.dispatchEvent(new Event('openAIChatbot'))} className="text-purple-700 border-purple-200 hover:bg-purple-50">
                    {t('dash_get_ai_suggestion')}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      )}
    </div>
  );
}
