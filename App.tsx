import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { Button } from './components/Button';
import { generateMerchMockup } from './services/geminiService';
import { AppState, PresetPrompt } from './types';

const PRESET_PROMPTS: PresetPrompt[] = [
  { label: 'White T-Shirt', text: 'Place this logo on a high-quality plain white t-shirt on a model', icon: '👕' },
  { label: 'Black Hoodie', text: 'Apply this design to a black hoodie folded on a wooden table', icon: '🧥' },
  { label: 'Coffee Mug', text: 'Show this logo on a ceramic coffee mug in a cozy cafe setting', icon: '☕' },
  { label: 'Tote Bag', text: 'Print this design on a canvas tote bag hanging on a shoulder', icon: '👜' },
  { label: 'Neon Sign', text: 'Turn this logo into a glowing neon sign on a brick wall at night', icon: '💡' },
  { label: 'Sticker', text: 'Turn this into a die-cut sticker on a laptop', icon: '🏷️' },
];

function App() {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelected = useCallback((base64: string) => {
    setSourceImage(base64);
    setGeneratedImage(null);
    setAppState(AppState.IDLE);
    setError(null);
  }, []);

  const handleGenerate = async () => {
    if (!sourceImage || !prompt.trim()) return;

    setAppState(AppState.GENERATING);
    setError(null);
    setGeneratedImage(null); // Clear previous result while generating new one

    try {
      const result = await generateMerchMockup(sourceImage, prompt);
      setGeneratedImage(result);
      setAppState(AppState.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate mockup. Please try again.');
      setAppState(AppState.ERROR);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `nano-mockup-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleClear = () => {
      setSourceImage(null);
      setGeneratedImage(null);
      setPrompt('');
      setAppState(AppState.IDLE);
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <div className="bg-indigo-600 p-2 rounded-lg">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                    NanoMockup Studio
                </h1>
            </div>
            <div className="text-xs text-slate-500 border border-slate-800 px-2 py-1 rounded">
                Powered by Gemini 2.5 Flash Image
            </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
            
          {/* LEFT COLUMN: Controls */}
          <div className="lg:col-span-4 flex flex-col space-y-6">
            
            {/* Step 1: Upload */}
            <section className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">1. Upload Asset</h2>
                    {sourceImage && (
                        <button onClick={handleClear} className="text-xs text-red-400 hover:text-red-300">Reset All</button>
                    )}
                </div>
                <ImageUploader 
                    onImageSelected={handleImageSelected} 
                    currentImage={sourceImage} 
                />
            </section>

            {/* Step 2: Prompt */}
            <section className="space-y-3 flex-grow">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">2. Configure Mockup</h2>
              
              <div className="space-y-4">
                <div>
                    <label className="block text-xs text-slate-500 mb-1.5">Describe your product shot</label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="E.g., A vintage distressed logo on a weathered brick wall..."
                        className="w-full h-32 bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none transition-all placeholder:text-slate-600"
                    />
                </div>

                {/* Quick Presets */}
                <div>
                    <label className="block text-xs text-slate-500 mb-2">Quick Presets</label>
                    <div className="grid grid-cols-2 gap-2">
                        {PRESET_PROMPTS.map((p) => (
                            <button
                                key={p.label}
                                onClick={() => setPrompt(p.text)}
                                className="flex items-center space-x-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-left transition-colors text-xs"
                            >
                                <span className="text-base">{p.icon}</span>
                                <span className="font-medium text-slate-300">{p.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
              </div>
            </section>

            {/* Action Bar - Sticky on mobile */}
            <div className="sticky bottom-4 lg:relative lg:bottom-0 pt-4 border-t border-slate-800 bg-slate-900 lg:bg-transparent z-10">
                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                        {error}
                    </div>
                )}
                <Button 
                    onClick={handleGenerate} 
                    disabled={!sourceImage || !prompt}
                    isLoading={appState === AppState.GENERATING}
                    className="w-full py-4 text-base shadow-lg shadow-indigo-500/20"
                >
                    {appState === AppState.GENERATING ? 'Generating Mockup...' : 'Generate Mockup'}
                </Button>
            </div>
          </div>

          {/* RIGHT COLUMN: Preview */}
          <div className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden relative min-h-[500px] flex flex-col">
            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-slate-950/80 to-transparent z-10 flex justify-between items-start pointer-events-none">
                <span className="px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-xs font-medium text-slate-400 backdrop-blur-md">
                    Preview
                </span>
                {generatedImage && (
                    <div className="pointer-events-auto flex space-x-2">
                         <Button 
                            variant="secondary" 
                            onClick={() => setGeneratedImage(null)} // "Close" preview effectively by showing placeholder
                            className="text-xs py-1.5"
                        >
                            Discard
                        </Button>
                        <Button 
                            variant="primary" 
                            onClick={handleDownload}
                            className="text-xs py-1.5"
                        >
                            Download High-Res
                        </Button>
                    </div>
                )}
            </div>

            <div className="flex-grow flex items-center justify-center p-8">
                {appState === AppState.GENERATING ? (
                    <div className="text-center space-y-6 animate-pulse">
                        <div className="w-24 h-24 mx-auto bg-indigo-500/20 rounded-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-indigo-500 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-slate-200">Creating your mockup...</h3>
                            <p className="text-slate-500 text-sm mt-1">Applying lighting, texture, and perspective.</p>
                        </div>
                    </div>
                ) : generatedImage ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                         <img 
                            src={generatedImage} 
                            alt="Generated Mockup" 
                            className="max-w-full max-h-[70vh] object-contain shadow-2xl rounded-lg"
                        />
                    </div>
                ) : (
                    <div className="text-center max-w-sm mx-auto">
                        <div className="w-20 h-20 mx-auto bg-slate-900 rounded-2xl flex items-center justify-center mb-6 border border-slate-800 rotate-3">
                             <svg className="w-10 h-10 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-slate-300">No Mockup Generated Yet</h3>
                        <p className="text-slate-500 text-sm mt-2">Upload a logo and enter a prompt to see your product preview here.</p>
                    </div>
                )}
            </div>
            
            {/* Disclaimer Footer */}
            <div className="bg-slate-950 p-4 border-t border-slate-800 text-center">
                <p className="text-xs text-slate-600">
                    Images are generated by AI and may contain artifacts. Designed for visualization purposes.
                </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;