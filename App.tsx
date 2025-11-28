import React, { useState, useCallback, useEffect } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { Button } from './components/Button';
import { generateImageEdit } from './services/geminiService';
import { AppState, PresetPrompt } from './types';

// Expanded list of presets for dynamic generation
const ALL_PRESETS: PresetPrompt[] = [
  // Product Mockups
  { label: 'T-Shirt Mockup', text: 'Place this design on a plain white t-shirt worn by a model in a studio setting.', icon: '👕' },
  { label: 'Laptop Sticker', text: 'Show this design as a die-cut sticker on a silver laptop lid.', icon: '💻' },
  { label: 'Coffee Mug', text: 'Apply this logo to a ceramic coffee mug on a wooden table.', icon: '☕' },
  { label: 'Tote Bag', text: 'Display this design printed on a canvas tote bag hanging on a hook.', icon: '👜' },
  { label: 'Phone Case', text: 'Show this pattern on a sleek phone case lying on a marble surface.', icon: '📱' },
  { label: 'Soda Can', text: 'Wrap this design around a cold aluminum soda can with condensation.', icon: '🥤' },
  
  // Artistic Styles
  { label: 'Retro Filter', text: 'Add a vintage 1980s film grain filter and warm color grading to this image.', icon: '📼' },
  { label: 'Cyberpunk', text: 'Transform the environment to a futuristic cyberpunk city with neon lights.', icon: '🌃' },
  { label: 'Pencil Sketch', text: 'Convert this image into a detailed charcoal and pencil sketch.', icon: '✏️' },
  { label: 'Pixel Art', text: 'Convert this image into 16-bit pixel art style.', icon: '👾' },
  { label: 'Watercolor', text: 'Transform this into a soft watercolor painting on textured paper.', icon: '🖌️' },
  { label: 'Neon Sign', text: 'Turn the main subject into a glowing neon sign on a brick wall.', icon: '💡' },
  { label: 'Claymation', text: 'Reimagine this scene in a claymation stop-motion style.', icon: '🗿' },
  { label: 'LEGO Style', text: 'Rebuild this entire scene using plastic toy bricks.', icon: '🧱' },
  { label: 'Vaporwave', text: 'Apply a vaporwave aesthetic with pink and teal colors and glitch effects.', icon: '🌴' },
  { label: 'Noir', text: 'Convert to high-contrast black and white film noir style.', icon: '🕵️' },
  { label: 'Low Poly', text: 'Render the image in a low-poly 3D geometric style.', icon: '🔷' },
  { label: 'Origami', text: 'Reimagine this object as folded origami paper art.', icon: '🦢' },
  { label: 'Oil Painting', text: 'Transform into a classical oil painting with visible brush strokes.', icon: '🎨' },
  { label: 'Ice Sculpture', text: 'Turn the subject into a carved translucent ice sculpture.', icon: '🧊' }
];

function App() {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [displayedPresets, setDisplayedPresets] = useState<PresetPrompt[]>([]);

  // Shuffle presets on mount
  useEffect(() => {
    shufflePresets();
  }, []);

  const shufflePresets = useCallback(() => {
    const shuffled = [...ALL_PRESETS].sort(() => 0.5 - Math.random());
    setDisplayedPresets(shuffled.slice(0, 6)); // Display 6 random items
  }, []);

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
    setGeneratedImage(null); 

    try {
      const result = await generateImageEdit(sourceImage, prompt);
      setGeneratedImage(result);
      setAppState(AppState.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to process image. Please try again.');
      setAppState(AppState.ERROR);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `nano-edit-${Date.now()}.png`;
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
    <div className="min-h-screen bg-black text-zinc-200 flex flex-col font-sans selection:bg-zinc-800 selection:text-white">
      {/* Header */}
      <header className="border-b border-zinc-900 bg-black/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-zinc-100 rounded flex items-center justify-center">
                    <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <h1 className="text-lg font-bold tracking-tight text-white">
                    Nano Studio
                </h1>
            </div>
            <div className="flex items-center space-x-4">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest border border-zinc-800 px-2 py-1 rounded">
                    Gemini 2.5 Flash Image
                </span>
            </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-[1600px] mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-7rem)] min-h-[600px]">
            
          {/* LEFT COLUMN: Controls */}
          <div className="lg:col-span-4 flex flex-col h-full space-y-6 overflow-y-auto pr-2 custom-scrollbar">
            
            {/* Context/Intro */}
            <div className="space-y-1">
                <h2 className="text-xl font-semibold text-white">Create & Edit</h2>
                <p className="text-sm text-zinc-500">Upload an image and describe how you want to transform it.</p>
            </div>

            {/* Step 1: Upload */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Source</label>
                    {sourceImage && (
                        <button onClick={handleClear} className="text-xs text-zinc-500 hover:text-white transition-colors underline decoration-zinc-700">Clear</button>
                    )}
                </div>
                <ImageUploader 
                    onImageSelected={handleImageSelected} 
                    currentImage={sourceImage} 
                />
            </div>

            {/* Step 2: Prompt */}
            <div className="space-y-3 flex-grow">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Instructions</label>
              
              <div className="space-y-4">
                <div className="relative group">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe your edit... e.g. 'Add a neon glow', 'Place logo on a hoodie', 'Make it sketch style'"
                        className="w-full h-32 bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-sm text-white focus:ring-1 focus:ring-white focus:border-zinc-700 outline-none resize-none transition-all placeholder:text-zinc-600 shadow-inner"
                    />
                    <div className="absolute bottom-3 right-3 pointer-events-none">
                         <svg className={`w-4 h-4 transition-colors ${prompt ? 'text-zinc-400' : 'text-zinc-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                         </svg>
                    </div>
                </div>

                {/* Quick Presets */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Inspirations</label>
                        <button 
                            onClick={shufflePresets}
                            className="flex items-center space-x-1.5 text-xs text-zinc-500 hover:text-white transition-colors group px-2 py-1 rounded hover:bg-zinc-900/50"
                            title="Get new ideas"
                        >
                            <svg className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span className="font-medium">Randomize</span>
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {displayedPresets.map((p, i) => (
                            <button
                                key={`${p.label}-${i}`}
                                onClick={() => setPrompt(p.text)}
                                className="group relative overflow-hidden flex items-center space-x-3 px-3 py-2.5 bg-zinc-900/40 hover:bg-zinc-800 border border-zinc-800/60 hover:border-zinc-600 rounded-lg text-left transition-all duration-200"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                <span className="text-base bg-zinc-950/80 p-1.5 rounded-md border border-zinc-800/50 group-hover:scale-105 transition-transform shadow-sm">{p.icon}</span>
                                <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-100">{p.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 mt-auto">
                {error && (
                    <div className="mb-4 p-3 bg-red-950/30 border border-red-900/50 rounded-md flex items-start gap-3">
                         <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-red-400 text-sm">{error}</span>
                    </div>
                )}
                <Button 
                    onClick={handleGenerate} 
                    disabled={!sourceImage || !prompt}
                    isLoading={appState === AppState.GENERATING}
                    className="w-full py-3 text-sm tracking-wide"
                >
                    {appState === AppState.GENERATING ? 'Processing...' : 'Generate Result'}
                </Button>
            </div>
          </div>

          {/* RIGHT COLUMN: Preview */}
          <div className="lg:col-span-8 bg-zinc-900/30 rounded-xl border border-zinc-800/50 overflow-hidden relative flex flex-col">
            
            {/* Toolbar */}
            <div className="absolute top-4 right-4 z-10 flex space-x-2">
                {generatedImage && (
                    <>
                        <Button 
                            variant="secondary" 
                            onClick={() => setGeneratedImage(null)}
                            className="text-xs py-1.5 h-8 bg-black/50 backdrop-blur-md border border-zinc-700 hover:bg-black"
                        >
                            Back to Original
                        </Button>
                        <Button 
                            variant="primary" 
                            onClick={handleDownload}
                            className="text-xs py-1.5 h-8 shadow-xl shadow-white/5"
                        >
                            Download
                        </Button>
                    </>
                )}
            </div>

            {/* Main Canvas Area */}
            <div className="flex-grow relative flex items-center justify-center p-8 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-5">
                {appState === AppState.GENERATING ? (
                     <div className="relative w-full h-full flex items-center justify-center">
                        {/* Blurred Source Background */}
                        {sourceImage && (
                            <img 
                                src={sourceImage} 
                                alt="Processing Preview" 
                                className="absolute inset-0 w-full h-full object-contain opacity-30 blur-sm grayscale-[30%] transition-all duration-700"
                            />
                        )}
                        
                        {/* Loading Indicator */}
                        <div className="text-center space-y-8 relative z-10">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-zinc-800 border-t-white rounded-full animate-spin mx-auto"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-white tracking-tight">Generating...</h3>
                                <p className="text-zinc-400 text-sm mt-2">Gemini is processing your pixels</p>
                            </div>
                        </div>
                    </div>
                ) : generatedImage ? (
                    <div className="relative w-full h-full flex items-center justify-center animate-in fade-in zoom-in-95 duration-500">
                         <img 
                            src={generatedImage} 
                            alt="Generated Output" 
                            className="max-w-full max-h-full object-contain shadow-2xl shadow-black rounded-lg"
                        />
                    </div>
                ) : sourceImage ? (
                     <div className="relative w-full h-full flex items-center justify-center opacity-40 grayscale">
                        <img 
                            src={sourceImage} 
                            alt="Source Preview" 
                            className="max-w-full max-h-full object-contain"
                        />
                         <div className="absolute inset-0 flex items-center justify-center">
                            <span className="bg-black/80 text-white px-4 py-2 rounded-full text-sm border border-zinc-700 backdrop-blur">
                                Preview Mode
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="text-center max-w-sm mx-auto p-8 rounded-2xl border border-zinc-800/50 bg-zinc-900/20">
                        <div className="w-16 h-16 mx-auto bg-zinc-800/50 rounded-xl flex items-center justify-center mb-6 border border-zinc-700 text-zinc-500">
                             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-base font-medium text-zinc-300">Workspace Empty</h3>
                        <p className="text-zinc-600 text-sm mt-2">Upload an image from the sidebar to start creating.</p>
                    </div>
                )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;