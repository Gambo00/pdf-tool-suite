
import React from 'react';
import { RefreshCw, Zap, Shield, Globe } from 'lucide-react';

const Header = () => {
  return (
    <div className="text-center mb-12">
      <div className="mb-6">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent mb-4">
          UniversalConverter
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Konvertiere deine Dateien kostenlos und sicher direkt in deinem Browser - 
          <span className="font-semibold text-blue-600"> ohne Upload zu Servern</span>
        </p>
      </div>
      
      <div className="flex justify-center space-x-8 mb-8">
        <div className="flex items-center space-x-2 text-green-600">
          <Shield size={20} />
          <span className="text-sm font-medium">100% Sicher</span>
        </div>
        <div className="flex items-center space-x-2 text-blue-600">
          <Zap size={20} />
          <span className="text-sm font-medium">Blitzschnell</span>
        </div>
        <div className="flex items-center space-x-2 text-purple-600">
          <Globe size={20} />
          <span className="text-sm font-medium">Browserbasiert</span>
        </div>
        <div className="flex items-center space-x-2 text-teal-600">
          <RefreshCw size={20} />
          <span className="text-sm font-medium">Alle Formate</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
