import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MessageSquare, X, Send, Mic, MicOff, Volume2, VolumeX, Sprout } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useTranslation } from 'react-i18next';

export function Chatbot() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Set initial greeting based on language
  useEffect(() => {
    if (messages.length === 0) {
      const greeting = i18n.language === 'en' 
        ? "Hello! I am KrishiMitra AI. How can I help you with your farming today?"
        : "नमस्ते! मैं कृषिमित्र AI हूँ। मैं आपकी खेती में कैसे मदद कर सकता हूँ?";
      setMessages([{ sender: 'ai', text: greeting }]);
    }
  }, [i18n.language, messages.length]);

  // Listen for global open event
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('openAIChatbot', handleOpen);
    
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
    
    return () => window.removeEventListener('openAIChatbot', handleOpen);
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => setIsListening(true);
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setTimeout(() => sendMessage(null, transcript), 500);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        if (event.error === 'not-allowed') {
          alert("Microphone access was denied. Please allow it in your browser settings.");
        }
        setIsListening(false);
      };

      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      if (!hasGreeted && messages.length > 0 && voiceEnabled) {
        setHasGreeted(true);
        setTimeout(() => speakText(messages[0].text), 500);
      }
    }
  }, [messages, isOpen, hasGreeted, voiceEnabled]);

  const speakText = (text) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const isHindi = i18n.language === 'hi';
    utterance.lang = isHindi ? 'hi-IN' : 'en-US';
    utterance.rate = 1.0;
    
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice;
    
    if (isHindi) {
      selectedVoice = voices.find(voice => voice.lang.includes('hi') || voice.lang.includes('HI') || voice.name.toLowerCase().includes('hindi'));
      if (!selectedVoice) selectedVoice = voices.find(voice => voice.name === 'Google हिन्दी');
    } else {
      selectedVoice = voices.find(voice => voice.lang.includes('en') || voice.lang.includes('EN') || voice.name.toLowerCase().includes('english'));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      console.error("SpeechSynthesis error:", e);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const toggleListen = () => {
    if (!recognitionRef.current) {
      alert("Voice input is not supported in your current browser.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
      try {
        recognitionRef.current.lang = i18n.language === 'hi' ? 'hi-IN' : 'en-US';
        recognitionRef.current.start();
      } catch (err) {
        console.error("Failed to start mic", err);
      }
    }
  };

  const sendMessage = async (e, overrideText) => {
    e?.preventDefault();
    const textToSend = overrideText || input.trim();
    if (!textToSend || loading) return;

    setMessages(prev => [...prev, { sender: 'user', text: textToSend }]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/ai/chat', { 
        message: textToSend,
        language: i18n.language
      });
      const aiReply = response.data.reply;
      
      setMessages(prev => [...prev, { sender: 'ai', text: aiReply }]);
      speakText(aiReply);
      
    } catch (err) {
      console.error(err);
      const errorMsg = i18n.language === 'hi' ? 'माफ़ करें, अभी मैं जवाब नहीं दे पा रहा हूँ।' : 'Sorry, I cannot respond right now.';
      setMessages(prev => [...prev, { sender: 'ai', text: errorMsg }]);
      speakText(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-700 hover:scale-110 transition-all z-50 animate-bounce"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-green-100 flex flex-col z-50 overflow-hidden" style={{ height: '500px', maxHeight: '80vh' }}>
      <div className="bg-green-600 p-4 text-white flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm">{t('chat_title')}</h3>
            <p className="text-xs text-green-100">{t('chat_subtitle')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setVoiceEnabled(!voiceEnabled)} className="text-white hover:text-green-200 focus:outline-none">
            {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <button onClick={() => setIsOpen(false)} className="text-white hover:text-green-200 focus:outline-none">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
              msg.sender === 'user' 
                ? 'bg-green-600 text-white rounded-br-none' 
                : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-2xl px-4 py-2 text-sm bg-white text-slate-500 border border-slate-100 rounded-bl-none flex gap-1">
              <span className="animate-bounce">.</span><span className="animate-bounce delay-100">.</span><span className="animate-bounce delay-200">.</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-white border-t border-slate-100">
        {isListening && (
          <div className="text-xs text-green-600 mb-2 flex items-center gap-1 animate-pulse">
            <Mic className="w-3 h-3" /> {t('chat_listening')}
          </div>
        )}
        <form onSubmit={sendMessage} className="flex items-center gap-2">
          <button 
            type="button" 
            onClick={toggleListen}
            className={`p-2 rounded-full focus:outline-none transition-colors ${
              isListening ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600 hover:bg-green-100 hover:text-green-600'
            }`}
            title={t('chat_tooltip_mic')}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          
          <input 
            type="text" 
            value={input} 
            onChange={e => setInput(e.target.value)}
            placeholder={t('chat_placeholder')} 
            className="flex-1 border-none focus:ring-0 text-sm bg-transparent"
            disabled={loading}
          />
          
          <button 
            type="submit" 
            disabled={!input.trim() || loading}
            className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
