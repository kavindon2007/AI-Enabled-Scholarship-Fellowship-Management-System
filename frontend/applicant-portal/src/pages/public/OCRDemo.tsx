import React, { useState, useRef, useEffect } from 'react';
import { Upload, Camera, FileText, Check, AlertTriangle, RefreshCw, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const OCRDemo: React.FC = () => {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [docType, setDocType] = useState('ST_CERTIFICATE');
  const [useCamera, setUseCamera] = useState(false);
  
  // OCR State
  const [ocrResult, setOcrResult] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  // Stop camera when unmounting
  useEffect(() => {
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setCameraStream(stream);
      setUseCamera(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please check permissions or use file upload.");
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setUseCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setPreview(dataUrl);
        
        // Convert data URL to File object for the mock API
        canvas.toBlob((blob) => {
          if (blob) {
            const capturedFile = new File([blob], "camera-scan.jpg", { type: "image/jpeg" });
            setFile(capturedFile);
          }
        }, 'image/jpeg');
        
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const uploadedFile = e.target.files[0];
      setFile(uploadedFile);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(uploadedFile);
    }
  };

  const runMockOCR = () => {
    if (!file && !preview) return;
    
    setIsScanning(true);
    setOcrResult(null);
    setProgress(0);
    
    // Simulate pipeline phases
    const phases = [
      { p: 10, text: 'Preprocessing image...' },
      { p: 30, text: 'Running EasyOCR...' },
      { p: 60, text: 'Running Tesseract...' },
      { p: 80, text: 'Fusing results & fuzzy matching...' },
      { p: 100, text: 'Extracting fields...' }
    ];
    
    let currentPhase = 0;
    
    const interval = setInterval(() => {
      if (currentPhase < phases.length) {
        setProgress(phases[currentPhase].p);
        setProgressText(phases[currentPhase].text);
        currentPhase++;
      } else {
        clearInterval(interval);
        setIsScanning(false);
        // Set deterministic mock result based on docType
        setOcrResult({
          jobId: 'OCR-' + Math.floor(Math.random() * 1000000),
          processingTime: '1.4s',
          engine: 'Fusion (EasyOCR + Tesseract)',
          overallConfidence: 94.5,
          fields: [
            { key: 'name', label: 'Applicant Name', value: 'JOHN DOE', confidence: 98.2, status: 'HIGH_CONFIDENCE' },
            { key: 'certificate_no', label: 'Certificate No.', value: 'ST/2024/8892', confidence: 92.1, status: 'HIGH_CONFIDENCE' },
            { key: 'issue_date', label: 'Issue Date', value: '12/04/2024', confidence: 85.4, status: 'MEDIUM_CONFIDENCE' },
            { key: 'authority', label: 'Issuing Authority', value: 'TAHSILDAR RANCHI', confidence: 71.0, status: 'LOW_CONFIDENCE' }
          ],
          vision: { signature: true, stamp: true }
        });
      }
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-gov-blue">OCR Document Scan Demo</h1>
        <p className="text-gov-textMuted mt-2">
          Experience our intelligent document processing pipeline. This demo runs a simulated 
          or local OCR extraction adapted from the invoice-extraction-system.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Input */}
        <div className="bg-white rounded-gov shadow-gov border border-gov-border p-6 flex flex-col">
          <h2 className="text-lg font-bold mb-4 border-b pb-2">1. Input Document</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Document Type (AI Hint)</label>
            <select 
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-gov-blue focus:border-gov-blue p-2 border"
            >
              <option value="ST_CERTIFICATE">Scheduled Tribe (ST) Certificate</option>
              <option value="INCOME_CERTIFICATE">Income Certificate</option>
              <option value="MARKSHEET">Academic Marksheet</option>
            </select>
          </div>

          {!useCamera && !preview && (
            <div className="flex-1 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-12 bg-gray-50 text-center">
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-4">Drag and drop a document, or select a file</p>
              <div className="flex space-x-4">
                <label className="bg-white text-gov-blue border border-gov-blue px-4 py-2 rounded cursor-pointer hover:bg-gov-blue-50 transition-colors font-medium text-sm">
                  <span>Browse File</span>
                  <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleFileUpload} />
                </label>
                <button 
                  onClick={startCamera}
                  className="bg-gov-blue text-white px-4 py-2 rounded hover:bg-gov-blue-dark transition-colors flex items-center font-medium text-sm"
                >
                  <Camera className="w-4 h-4 mr-2" /> Use Camera
                </button>
              </div>
            </div>
          )}

          {useCamera && (
            <div className="flex-1 bg-black rounded-lg overflow-hidden relative flex flex-col min-h-[300px]">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover flex-1"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {/* Framing guide */}
              <div className="absolute inset-0 border-4 border-white/30 m-8 rounded border-dashed pointer-events-none flex items-center justify-center">
                <span className="text-white/50 font-bold tracking-widest uppercase">Align Document Here</span>
              </div>
              
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                <button onClick={stopCamera} className="bg-red-500 text-white px-4 py-2 rounded-full font-medium">Cancel</button>
                <button onClick={capturePhoto} className="bg-white text-black px-6 py-2 rounded-full font-bold flex items-center shadow-lg">
                  <Camera className="w-5 h-5 mr-2" /> Capture
                </button>
              </div>
            </div>
          )}

          {preview && !useCamera && (
            <div className="flex-1 flex flex-col">
              <div className="bg-gray-100 rounded-lg overflow-hidden flex-1 relative min-h-[300px] border border-gray-200 flex items-center justify-center">
                <img src={preview} alt="Document Preview" className="max-h-full max-w-full object-contain" />
              </div>
              <div className="mt-4 flex justify-between">
                <button 
                  onClick={() => { setPreview(null); setFile(null); }}
                  className="text-gray-500 hover:text-red-500 text-sm font-medium"
                >
                  Remove / Retake
                </button>
                <button 
                  onClick={runMockOCR}
                  disabled={isScanning}
                  className={`bg-gov-orange text-white px-6 py-2 rounded font-bold shadow-gov flex items-center ${isScanning ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gov-orange-dark'}`}
                >
                  {isScanning ? (
                    <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                  ) : (
                    <><FileText className="w-4 h-4 mr-2" /> Run AI Extraction</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Output */}
        <div className="bg-white rounded-gov shadow-gov border border-gov-border p-6 flex flex-col h-[600px] overflow-y-auto">
          <h2 className="text-lg font-bold mb-4 border-b pb-2 flex justify-between items-center">
            <span>2. Extracted Information</span>
            {ocrResult && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-bold">
                Done ({ocrResult.processingTime})
              </span>
            )}
          </h2>

          {isScanning && (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-full max-w-xs mb-4">
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gov-blue transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 animate-pulse">{progressText}</p>
            </div>
          )}

          {!isScanning && !ocrResult && (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <Eye className="w-12 h-12 mb-4 opacity-50" />
              <p>Extraction results will appear here</p>
            </div>
          )}

          {!isScanning && ocrResult && (
            <div className="space-y-6">
              {/* Meta information */}
              <div className="grid grid-cols-2 gap-4 text-xs p-3 bg-gray-50 rounded border border-gray-100">
                <div>
                  <span className="text-gray-500 block">Engine</span>
                  <span className="font-semibold text-gray-800">{ocrResult.engine}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Overall Confidence</span>
                  <span className="font-semibold text-gray-800">{ocrResult.overallConfidence}%</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Visual Signals</span>
                  <span className="font-semibold text-gray-800 flex items-center mt-1">
                    {ocrResult.vision.signature && <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded mr-2">Signature</span>}
                    {ocrResult.vision.stamp && <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">Stamp</span>}
                  </span>
                </div>
              </div>

              {/* Extracted Fields */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-500">Document Fields</h3>
                
                {ocrResult.fields.map((field: any, idx: number) => (
                  <div key={idx} className="border border-gray-200 rounded p-3 hover:border-gov-blue transition-colors group">
                    <div className="flex justify-between items-start mb-1">
                      <label className="text-sm font-medium text-gray-600">{field.label}</label>
                      <div className="flex items-center space-x-2">
                        {field.status === 'HIGH_CONFIDENCE' && <Check className="w-4 h-4 text-green-500" />}
                        {field.status === 'MEDIUM_CONFIDENCE' && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                        {field.status === 'LOW_CONFIDENCE' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                        <span className="text-xs text-gray-400">{field.confidence}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <input 
                        type="text" 
                        defaultValue={field.value}
                        className={`font-mono text-sm w-full bg-transparent outline-none border-b border-transparent focus:border-gov-blue ${field.status === 'LOW_CONFIDENCE' ? 'text-red-700 font-bold' : 'text-gray-900'}`}
                      />
                      <button className="text-xs text-gov-blue opacity-0 group-hover:opacity-100 transition-opacity ml-2 whitespace-nowrap">Edit</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-200 flex justify-end space-x-4">
                <button className="text-gray-600 font-medium text-sm hover:text-gov-blue">View JSON</button>
                <button className="bg-gov-green text-white px-4 py-2 rounded font-bold text-sm shadow-gov hover:bg-green-700 transition-colors">
                  Confirm & Save to Application
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
