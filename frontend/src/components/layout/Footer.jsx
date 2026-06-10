import React from 'react';
import { Sprout } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Sprout className="h-6 w-6 text-green-600" />
            <span className="text-lg font-bold text-slate-800">KrishiMitra</span>
          </div>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} KrishiMitra. Empowering Farmers with AI.
          </p>
        </div>
      </div>
    </footer>
  );
}
