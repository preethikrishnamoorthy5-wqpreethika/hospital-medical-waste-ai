import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Building2, 
  Weight, 
  RefreshCw, 
  Image as ImageIcon,
  Zap,
  Info,
  Maximize2,
  StopCircle,
  Tag,
  FolderHeart,
  Layers
} from 'lucide-react';
import { HOSPITAL_DEPARTMENTS, PRESET_WASTE_SAMPLES } from '../data/mockData';
import { FEW_SHOT_REFERENCE_EXAMPLES } from '../data/referenceImagesData';
import { classifyMedicalWaste } from '../services/aiVisionService';
import { getBinCategoryForWasteType, WASTE_CATEGORIES } from '../data/medicalWasteCodes';

export default function WasteScanner({ onClassificationComplete, selectedDepartment, setSelectedDepartment }) {
  const [activeMode, setActiveMode] = useState('upload'); // 'upload' | 'camera' | 'reference'
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFileName, setImageFileName] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [customWeight, setCustomWeight] = useState(0.25);
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraError, setCameraError] = useState('');
  const [selectedItemTag, setSelectedItemTag] = useState('');

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Unable to access camera device:', err);
      setCameraError('Camera access denied or unavailable. You can upload an image or select a sample reference below.');
      setActiveMode('upload');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const handleModeChange = (mode) => {
    if (mode === 'camera') {
      setActiveMode('camera');
      startCamera();
    } else {
      stopCamera();
      setActiveMode(mode);
    }
  };

  // Capture snapshot from live video stream
  const captureSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setSelectedImage(dataUrl);
    const nameToUse = selectedItemTag || 'camera-snapshot.jpg';
    setImageFileName(nameToUse);
    setSelectedPresetId(null);
    stopCamera();
    setActiveMode('upload');
    triggerAiClassification(dataUrl, null, nameToUse);
  };

  // Handle local file selection
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const nameToUse = selectedItemTag || file.name;
    setImageFileName(nameToUse);
    setSelectedPresetId(null);

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target.result;
      setSelectedImage(dataUrl);
      triggerAiClassification(dataUrl, null, nameToUse);
    };
    reader.readAsDataURL(file);
  };

  // Handle clicking a few-shot reference image from Desktop\reference
  const handleReferenceSelect = (refExample) => {
    setSelectedImage(refExample.dataUrl || refExample.url);
    setImageFileName(refExample.label);
    setSelectedPresetId(refExample.label);
    triggerAiClassification(refExample.dataUrl || refExample.url, refExample.label, refExample.label);
  };

  // Trigger AI vision classification pipeline with few-shot prompting
  const triggerAiClassification = async (imageDataUrl, presetId, fileName) => {
    setIsScanning(true);
    setScanProgress(20);

    const progressTimer = setInterval(() => {
      setScanProgress(prev => (prev < 90 ? prev + 25 : prev));
    }, 150);

    try {
      const result = await classifyMedicalWaste({
        imageDataUrl,
        presetId,
        fileName: selectedItemTag || fileName
      });

      clearInterval(progressTimer);
      setScanProgress(100);

      setTimeout(() => {
        setIsScanning(false);
        onClassificationComplete({
          ...result,
          imageDataUrl,
          departmentId: selectedDepartment,
          weightKg: customWeight || result.estimatedWeightKg
        });
      }, 400);
    } catch (err) {
      clearInterval(progressTimer);
      setIsScanning(false);
      console.error('Classification failed:', err);
      alert('AI Classification failed. Please retry.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Configuration Bar: Ward Location & Weight */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        {/* Ward Selector Dropdown */}
        <div className="flex-1">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-hospital-600" />
            Source Ward / Department:
          </label>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 text-slate-800 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500 transition-all cursor-pointer"
          >
            {HOSPITAL_DEPARTMENTS.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name} ({dept.floor})
              </option>
            ))}
          </select>
        </div>

        {/* Estimated Weight Selector */}
        <div className="w-full sm:w-48">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
            <Weight className="w-3.5 h-3.5 text-hospital-600" />
            Estimated Quantity / Weight:
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.05"
              min="0.05"
              max="25"
              value={customWeight}
              onChange={(e) => setCustomWeight(parseFloat(e.target.value) || 0.1)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-800 rounded-xl px-3.5 py-2.5 text-sm font-semibold pr-10 focus:ring-2 focus:ring-hospital-500"
            />
            <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-400">
              kg
            </span>
          </div>
        </div>
      </div>

      {/* Main Capture & Upload Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all">
        
        {/* Tab Headers: Upload vs Camera vs Reference Images */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 p-1.5 gap-1.5">
          <button
            onClick={() => handleModeChange('upload')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeMode === 'upload'
                ? 'bg-white text-hospital-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Photo</span>
          </button>

          <button
            onClick={() => handleModeChange('camera')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeMode === 'camera'
                ? 'bg-white text-hospital-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Live Camera</span>
          </button>

          <button
            onClick={() => handleModeChange('reference')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeMode === 'reference'
                ? 'bg-white text-hospital-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FolderHeart className="w-4 h-4 text-emerald-600" />
            <span>Few-Shot References (24)</span>
          </button>
        </div>

        {/* Quick Clinical Item Tag Assistant */}
        <div className="px-6 pt-4 pb-2 border-b border-slate-100 bg-slate-50/40">
          <div className="flex items-center gap-2 mb-1.5">
            <Tag className="w-3.5 h-3.5 text-hospital-600" />
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Item Tag Shortcut (Optional):
            </span>
            {selectedItemTag && (
              <button
                onClick={() => setSelectedItemTag('')}
                className="text-[10px] text-hospital-600 hover:underline font-bold ml-auto"
              >
                Clear Tag
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: 'ðŸ’‰ Syringe & Needle', tag: 'hypodermic syringe with needle', color: 'White' },
              { label: 'ðŸ©¹ Soiled Gauze & Cotton', tag: 'blood-soaked gauze and cotton', color: 'Yellow' },
              { label: 'ðŸ§¤ Nitrile Gloves', tag: 'medical examination gloves', color: 'Red' },
              { label: 'ðŸ§ª Glass Ampoule / Vial', tag: 'pharmaceutical glass ampoule vial', color: 'Blue' },
              { label: 'ðŸ“¦ Clean Cardboard / Paper', tag: 'clean paper packaging cardboard', color: 'Black' }
            ].map(item => {
              const isSelected = selectedItemTag === item.tag;
              return (
                <button
                  key={item.tag}
                  type="button"
                  onClick={() => {
                    const newTag = isSelected ? '' : item.tag;
                    setSelectedItemTag(newTag);
                    if (selectedImage && newTag) {
                      triggerAiClassification(selectedImage, null, newTag);
                    }
                  }}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition-all ${
                    isSelected
                      ? 'bg-hospital-600 text-white border-hospital-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mode 1: File Upload / Drag & Drop */}
        {activeMode === 'upload' && (
          <div className="p-6 sm:p-10 text-center">
            {selectedImage ? (
              <div className="relative max-w-md mx-auto rounded-2xl overflow-hidden border-2 border-hospital-400 bg-slate-900 shadow-lg">
                <img
                  src={selectedImage}
                  alt="Selected Waste"
                  className="w-full h-64 sm:h-80 object-cover"
                />

                {/* Few-Shot AI Multi-Modal Laser Scanner Overlay */}
                {isScanning && (
                  <div className="absolute inset-0 bg-sky-950/40 backdrop-blur-[1px] flex flex-col items-center justify-center">
                    {/* Animated Scanning Line */}
                    <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-sky-400 via-emerald-400 to-sky-400 shadow-[0_0_15px_#38bdf8] animate-scan-line z-20"></div>

                    {/* Reticle / Bounding Box Box */}
                    <div className="w-48 h-48 sm:w-56 sm:h-56 border-2 border-sky-400/80 rounded-2xl relative flex items-center justify-center">
                      <span className="absolute -top-3 -left-3 w-6 h-6 border-t-4 border-l-4 border-emerald-400"></span>
                      <span className="absolute -top-3 -right-3 w-6 h-6 border-t-4 border-r-4 border-emerald-400"></span>
                      <span className="absolute -bottom-3 -left-3 w-6 h-6 border-b-4 border-l-4 border-emerald-400"></span>
                      <span className="absolute -bottom-3 -right-3 w-6 h-6 border-b-4 border-r-4 border-emerald-400"></span>
                      <div className="animate-spin text-sky-300">
                        <RefreshCw className="w-8 h-8" />
                      </div>
                    </div>

                    <div className="mt-4 px-4 py-1.5 rounded-full bg-slate-900/90 border border-sky-400/50 text-white text-xs font-semibold tracking-wide flex items-center gap-2 shadow-lg">
                      <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                      <span>Few-Shot Multimodal Comparison ({scanProgress}%)...</span>
                    </div>
                  </div>
                )}

                {/* Change image action */}
                {!isScanning && (
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-slate-900/80 backdrop-blur-sm px-3 py-2 rounded-xl text-white text-xs">
                    <span className="truncate max-w-[200px]">{imageFileName || 'Selected photo'}</span>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-sky-300 hover:text-sky-200 font-semibold"
                    >
                      Change Photo
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-hospital-500 rounded-3xl p-8 sm:p-12 cursor-pointer bg-slate-50/50 hover:bg-hospital-50/30 transition-all group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-16 h-16 rounded-2xl bg-sky-100 text-hospital-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-hospital-600 group-hover:text-white transition-all shadow-sm">
                  <Upload className="w-8 h-8" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-1">
                  Upload or Take Photo of Medical Waste
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-4">
                  The AI compares your photo directly against the few-shot clinical reference dataset (syringes, gauze, gloves, ampoules, paper).
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-hospital-600 hover:bg-hospital-700 text-white font-semibold text-xs shadow-sm transition-all">
                  <Camera className="w-4 h-4" />
                  <span>Choose File or Snap Camera</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mode 2: Live Camera Stream */}
        {activeMode === 'camera' && (
          <div className="p-6 sm:p-8">
            <div className="relative max-w-lg mx-auto bg-slate-950 rounded-3xl overflow-hidden shadow-xl aspect-[4/3] flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Viewfinder Overlay */}
              <div className="absolute inset-0 pointer-events-none border-2 border-white/20 p-6 flex flex-col justify-between">
                <div className="flex justify-between items-center text-white/70 text-xs font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                    FEW-SHOT BIO-CAM
                  </span>
                  <span>{selectedDepartment}</span>
                </div>

                {/* Center Targeting Box */}
                <div className="self-center w-44 h-44 sm:w-56 sm:h-56 border-2 border-dashed border-sky-400/70 rounded-2xl flex items-center justify-center">
                  <div className="w-3 h-3 bg-sky-400/50 rounded-full"></div>
                </div>

                <div className="text-center text-white/80 text-[11px] font-medium bg-slate-900/60 backdrop-blur-xs py-1 rounded-full">
                  Align waste item inside viewfinder & click Capture
                </div>
              </div>

              {/* Bottom Snap Button */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-4 z-20">
                <button
                  onClick={captureSnapshot}
                  className="w-16 h-16 rounded-full bg-white border-4 border-hospital-600 shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-hospital-600"
                  title="Capture Snapshot"
                >
                  <Camera className="w-7 h-7" />
                </button>
              </div>
            </div>

            {cameraError && (
              <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{cameraError}</span>
              </div>
            )}
          </div>
        )}

        {/* Mode 3: Few-Shot Reference Images Library (From Desktop\reference) */}
        {activeMode === 'reference' && (
          <div className="p-6">
            <div className="text-center mb-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
                <FolderHeart className="w-3.5 h-3.5 text-emerald-600" />
                <span>Reference Dataset from Desktop Folder (24 Images)</span>
              </div>
              <p className="text-xs text-slate-500 max-w-lg mx-auto">
                These are the exact few-shot training images from your computer (<code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">reference/</code>). Click any photo to run the few-shot classifier!
              </p>
            </div>

            {/* Grouped by Bin Category */}
            <div className="space-y-4">
              {['WHITE', 'YELLOW', 'RED', 'BLUE', 'BLACK'].map(categoryKey => {
                const meta = WASTE_CATEGORIES[categoryKey];
                const categoryRefs = FEW_SHOT_REFERENCE_EXAMPLES.filter(r => r.category === categoryKey);

                return (
                  <div key={categoryKey} className="border border-slate-200 rounded-2xl p-3 bg-slate-50/50">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-3 h-3 rounded-full ${
                        categoryKey === 'YELLOW' ? 'bg-yellow-400' :
                        categoryKey === 'RED' ? 'bg-red-500' :
                        categoryKey === 'WHITE' ? 'bg-white border-2 border-slate-400' :
                        categoryKey === 'BLUE' ? 'bg-blue-500' : 'bg-slate-900'
                      }`}></span>
                      <span className="text-xs font-black text-slate-800">
                        {meta.binColor} Bin Category â€” {meta.title}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {categoryRefs.map((example, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleReferenceSelect(example)}
                          className="flex items-center gap-3 p-2 rounded-xl bg-white border border-slate-200 hover:border-hospital-500 hover:shadow-sm cursor-pointer transition-all group"
                        >
                          <img
                            src={example.dataUrl || example.url}
                            alt={example.label}
                            className="w-16 h-16 rounded-lg object-cover border border-slate-100 flex-shrink-0 group-hover:scale-105 transition-all"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-hospital-600">
                              Example #{example.exampleNumber}: {example.binColor} Bin
                            </div>
                            <div className="text-[10px] text-slate-500 line-clamp-2">
                              {example.description}
                            </div>
                            <div className="text-[10px] font-bold text-hospital-600 mt-0.5 flex items-center gap-1">
                              <span>Click to Classify</span>
                              <Zap className="w-2.5 h-2.5" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Hidden canvas for video snapshots */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}