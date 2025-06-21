
import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import FileDropZone from '@/components/FileDropZone';
import ConversionPanel from '@/components/ConversionPanel';
import { FileConverter } from '@/utils/fileConverter';

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

const Index = () => {
  const [files, setFiles] = useState<ConversionFile[]>([]);

  const handleFileDrop = (droppedFiles: File[]) => {
    const newFiles: ConversionFile[] = droppedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      file,
      status: 'pending' as const,
      progress: 0,
    }));

    setFiles(prev => [...prev, ...newFiles]);
    toast({
      title: "Dateien hinzugefügt",
      description: `${droppedFiles.length} Datei(en) zum Konvertieren bereit`,
    });
  };

  const handleUrlSubmit = async (url: string) => {
    try {
      toast({
        title: "URL wird geladen...",
        description: url,
      });

      const { file, name } = await FileConverter.downloadFromUrl(url);
      
      const newFile: ConversionFile = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        size: file.size,
        type: file.type,
        file,
        url,
        status: 'pending',
        progress: 0,
      };

      setFiles(prev => [...prev, newFile]);
      toast({
        title: "URL erfolgreich geladen",
        description: `${name} ist bereit zur Konvertierung`,
      });
    } catch (error) {
      toast({
        title: "Fehler beim Laden der URL",
        description: "Die URL konnte nicht geladen werden",
        variant: "destructive",
      });
    }
  };

  const handleFormatChange = (fileId: string, format: string) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId 
        ? { ...file, outputFormat: format }
        : file
    ));
  };

  const handleConvert = async (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file || !file.file || !file.outputFormat) return;

    setFiles(prev => prev.map(f => 
      f.id === fileId 
        ? { ...f, status: 'converting', progress: 0 }
        : f
    ));

    try {
      const outputBlob = await FileConverter.convertFile(
        file.file,
        file.outputFormat,
        (progress) => {
          setFiles(prev => prev.map(f => 
            f.id === fileId 
              ? { ...f, progress: Math.round(progress) }
              : f
          ));
        }
      );

      setFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, status: 'completed', progress: 100, outputBlob }
          : f
      ));

      toast({
        title: "Konvertierung abgeschlossen",
        description: `${file.name} wurde erfolgreich konvertiert`,
      });
    } catch (error) {
      setFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, status: 'error', progress: 0 }
          : f
      ));

      toast({
        title: "Konvertierung fehlgeschlagen",
        description: `Fehler bei der Konvertierung von ${file.name}`,
        variant: "destructive",
      });
    }
  };

  const handleDownload = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file || !file.outputBlob || !file.outputFormat) return;

    const url = URL.createObjectURL(file.outputBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name.split('.')[0]}.${file.outputFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download gestartet",
      description: `${a.download} wird heruntergeladen`,
    });
  };

  const handleRemove = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    toast({
      title: "Datei entfernt",
      description: "Die Datei wurde aus der Liste entfernt",
    });
  };

  const handlePreview = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file || !file.outputBlob) return;

    const url = URL.createObjectURL(file.outputBlob);
    window.open(url, '_blank');
    
    toast({
      title: "Vorschau geöffnet",
      description: "Die konvertierte Datei wird in einem neuen Tab angezeigt",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <Header />
        
        <div className="space-y-12">
          <FileDropZone 
            onFileDrop={handleFileDrop}
            onUrlSubmit={handleUrlSubmit}
          />
          
          {files.length > 0 && (
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
              <ConversionPanel
                files={files}
                onFormatChange={handleFormatChange}
                onConvert={handleConvert}
                onDownload={handleDownload}
                onRemove={handleRemove}
                onPreview={handlePreview}
              />
            </div>
          )}
        </div>
        
        {/* Features Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl">🔒</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Privat & Sicher</h3>
            <p className="text-gray-600 text-sm">Alle Konvertierungen passieren lokal in deinem Browser. Deine Dateien verlassen niemals dein Gerät.</p>
          </div>
          
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl">⚡</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Blitzschnell</h3>
            <p className="text-gray-600 text-sm">Keine Wartezeiten durch Server-Uploads. Konvertiere deine Dateien in Sekunden, nicht Minuten.</p>
          </div>
          
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl">🌍</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Überall verfügbar</h3>
            <p className="text-gray-600 text-sm">Funktioniert in jedem modernen Browser - keine Installation oder Registrierung erforderlich.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
