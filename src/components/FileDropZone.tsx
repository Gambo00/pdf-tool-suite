
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Music, Video, Link } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileDropZoneProps {
  onFileDrop: (files: File[]) => void;
  onUrlSubmit: (url: string) => void;
}

const FileDropZone = ({ onFileDrop, onUrlSubmit }: FileDropZoneProps) => {
  const [urlInput, setUrlInput] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFileDrop(acceptedFiles);
    setDragActive(false);
  }, [onFileDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    multiple: true,
  });

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onUrlSubmit(urlInput.trim());
      setUrlInput('');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* File Drop Zone */}
      <div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer group",
          "bg-gradient-to-br from-blue-50/50 to-purple-50/50 backdrop-blur-sm",
          isDragActive || dragActive
            ? "border-blue-500 bg-blue-50/70 scale-105"
            : "border-gray-300 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50/70 hover:to-purple-50/70"
        )}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <div className={cn(
            "mx-auto w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300",
            "bg-gradient-to-br from-blue-500 to-purple-600 text-white",
            dragActive && "scale-110 rotate-6"
          )}>
            <Upload size={32} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {isDragActive ? "Dateien hier ablegen..." : "Dateien hochladen oder hierher ziehen"}
            </h3>
            <p className="text-gray-600">
              Unterstützt: PDF, Word, Excel, PowerPoint, Bilder, Audio, Video
            </p>
          </div>
          <div className="flex justify-center space-x-4 mt-6">
            <div className="flex items-center space-x-2 text-blue-600">
              <FileText size={20} />
              <span className="text-sm">Dokumente</span>
            </div>
            <div className="flex items-center space-x-2 text-green-600">
              <Music size={20} />
              <span className="text-sm">Audio</span>
            </div>
            <div className="flex items-center space-x-2 text-red-600">
              <Video size={20} />
              <span className="text-sm">Video</span>
            </div>
          </div>
        </div>
      </div>

      {/* URL Input */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
        <form onSubmit={handleUrlSubmit} className="space-y-4">
          <div className="flex items-center space-x-2 mb-3">
            <Link className="text-blue-600" size={20} />
            <h4 className="font-semibold text-gray-800">URL konvertieren</h4>
          </div>
          <div className="flex space-x-3">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/video.mp4 oder YouTube URL..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80"
            />
            <button
              type="submit"
              disabled={!urlInput.trim()}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Laden
            </button>
          </div>
          <p className="text-sm text-gray-500">
            YouTube, Vimeo, Dailymotion und direkte Media-Links werden unterstützt
          </p>
        </form>
      </div>
    </div>
  );
};

export default FileDropZone;
