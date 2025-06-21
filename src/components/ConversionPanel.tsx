
import React, { useState } from 'react';
import { ArrowRight, Download, Settings, Trash2, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConversionFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file?: File;
  url?: string;
  status: 'pending' | 'converting' | 'completed' | 'error';
  progress: number;
  outputFormat?: string;
  outputBlob?: Blob;
}

interface ConversionPanelProps {
  files: ConversionFile[];
  onFormatChange: (fileId: string, format: string) => void;
  onConvert: (fileId: string) => void;
  onDownload: (fileId: string) => void;
  onRemove: (fileId: string) => void;
  onPreview: (fileId: string) => void;
}

const ConversionPanel = ({ 
  files, 
  onFormatChange, 
  onConvert, 
  onDownload, 
  onRemove, 
  onPreview 
}: ConversionPanelProps) => {
  const [selectedFormats, setSelectedFormats] = useState<Record<string, string>>({});

  const getFormatOptions = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return ['jpg', 'png', 'webp', 'gif', 'bmp', 'svg'];
    }
    if (fileType.startsWith('audio/')) {
      return ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a'];
    }
    if (fileType.startsWith('video/')) {
      return ['mp4', 'avi', 'mov', 'mkv', 'webm', 'flv'];
    }
    if (fileType === 'application/pdf') {
      return ['docx', 'txt', 'jpg', 'png'];
    }
    if (fileType.includes('word') || fileType.includes('document')) {
      return ['pdf', 'txt', 'html', 'rtf'];
    }
    return ['pdf', 'txt', 'jpg'];
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFormatChange = (fileId: string, format: string) => {
    setSelectedFormats(prev => ({ ...prev, [fileId]: format }));
    onFormatChange(fileId, format);
  };

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Settings size={48} className="mx-auto" />
        </div>
        <p className="text-gray-500">Keine Dateien zum Konvertieren</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Konvertierung ({files.length})</h3>
      
      {files.map((file) => (
        <div
          key={file.id}
          className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      {file.type.split('/')[1]?.toUpperCase().slice(0, 3) || 'FILE'}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">{file.name}</h4>
                  <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
                </div>
              </div>
              
              {file.status === 'converting' && (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{file.progress}% konvertiert</p>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3 ml-4">
              {/* Format Selection */}
              <select
                value={selectedFormats[file.id] || ''}
                onChange={(e) => handleFormatChange(file.id, e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                disabled={file.status === 'converting'}
              >
                <option value="">Format wählen</option>
                {getFormatOptions(file.type).map((format) => (
                  <option key={format} value={format}>
                    {format.toUpperCase()}
                  </option>
                ))}
              </select>
              
              <ArrowRight size={16} className="text-gray-400" />
              
              {/* Action Buttons */}
              <div className="flex space-x-2">
                {file.status === 'pending' && selectedFormats[file.id] && (
                  <button
                    onClick={() => onConvert(file.id)}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg text-sm font-medium hover:from-green-600 hover:to-blue-600 transition-all duration-200"
                  >
                    Konvertieren
                  </button>
                )}
                
                {file.status === 'completed' && (
                  <>
                    <button
                      onClick={() => onPreview(file.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Vorschau"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => onDownload(file.id)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                    >
                      <Download size={16} className="mr-1" />
                      Download
                    </button>
                  </>
                )}
                
                <button
                  onClick={() => onRemove(file.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Entfernen"
                  disabled={file.status === 'converting'}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
          
          {file.status === 'error' && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">Konvertierung fehlgeschlagen</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ConversionPanel;
