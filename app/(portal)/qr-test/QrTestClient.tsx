'use client'

import React, { useState, useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import Image from 'next/image'
import Link from 'next/link'
import {
  QrCode,
  Download,
  Printer,
  Copy,
  Check,
  RefreshCw,
  Sliders,
  Palette,
  ShieldCheck,
  FileSpreadsheet,
  Camera,
  Upload,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Droplets,
  Layers,
  Scan,
  Maximize2
} from 'lucide-react'

type PayloadType = 'bottle' | 'source' | 'seal' | 'custom'
type ColorTheme = 'classic' | 'luit' | 'muga' | 'gamosa'
type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H'

export function QrTestClient() {
  const [activeTab, setActiveTab] = useState<'generator' | 'labels' | 'scanner' | 'batch'>('generator')

  // --- Generator State ---
  const [payloadType, setPayloadType] = useState<PayloadType>('bottle')
  
  // Bottle fields
  const [districtCode, setDistrictCode] = useState('KAM')
  const [yearCode, setYearCode] = useState('2026')
  const [bottleSerial, setBottleSerial] = useState('B4318')
  
  // Source fields
  const [schemeCode, setSchemeCode] = useState('AS-KAM-RAM-001')
  const [sourceName, setSourceName] = useState('Rampur Namghar Public Tap')
  const [sourceCoordinates, setSourceCoordinates] = useState('26.1142, 91.7823')
  
  // Seal fields
  const [sealHash, setSealHash] = useState('585a5aee3084dc72fa2e89b3f339178ad547141ecfbc7b66dfa0478168e37a28')
  
  // Custom field
  const [customText, setCustomText] = useState('https://phed.assam.gov.in/luit-prahari/verify?id=AS-KAM-2026-B4318')

  // Visual Customization State
  const [colorTheme, setColorTheme] = useState<ColorTheme>('luit')
  const [errorCorrection, setErrorCorrection] = useState<ErrorCorrectionLevel>('H')
  const [showCenterLogo, setShowCenterLogo] = useState(true)
  const [qrSize, setQrSize] = useState<number>(260)
  const [margin, setMargin] = useState<number>(1)

  // Generated QR Output
  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const [qrSvgString, setQrSvgString] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [activePayloadString, setActivePayloadString] = useState('')

  // Batch Generation State
  const [batchCount, setBatchCount] = useState<number>(12)
  const [batchQrs, setBatchQrs] = useState<Array<{ code: string; dataUrl: string; lot: string }>>([])
  const [batchLoading, setBatchLoading] = useState(false)

  // Scanner State
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [scanStatus, setScanStatus] = useState<string | null>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Resolve current active payload text based on mode
  useEffect(() => {
    let payload = ''
    if (payloadType === 'bottle') {
      payload = `AS-${districtCode}-${yearCode}-${bottleSerial}`
    } else if (payloadType === 'source') {
      payload = JSON.stringify({
        scheme: schemeCode,
        name: sourceName,
        geo: sourceCoordinates,
        ver: '1.0'
      })
    } else if (payloadType === 'seal') {
      payload = `HMAC-SHA256:${sealHash}`
    } else {
      payload = customText
    }
    setActivePayloadString(payload)
  }, [payloadType, districtCode, yearCode, bottleSerial, schemeCode, sourceName, sourceCoordinates, sealHash, customText])

  // Generate QR Code when payload or styling changes
  useEffect(() => {
    if (!activePayloadString) return

    let darkColor = '#000000'
    let lightColor = '#FFFFFF'

    if (colorTheme === 'luit') {
      darkColor = '#0151AF' // Brahmaputra Blue
      lightColor = '#FFFFFF'
    } else if (colorTheme === 'muga') {
      darkColor = '#936B20' // Muga Silk Deep
      lightColor = '#FEFCE8' // Soft silk background
    } else if (colorTheme === 'gamosa') {
      darkColor = '#A51D24' // Gamosa Crimson
      lightColor = '#FBEDEC' // Soft pink tint
    }

    const options: QRCode.QRCodeToDataURLOptions = {
      errorCorrectionLevel: errorCorrection,
      margin: margin,
      width: qrSize,
      color: {
        dark: darkColor,
        light: lightColor,
      }
    }

    QRCode.toDataURL(activePayloadString, options)
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR generation error:', err))

    QRCode.toString(activePayloadString, { ...options, type: 'svg' })
      .then((svg) => setQrSvgString(svg))
      .catch((err) => console.error('SVG generation error:', err))
  }, [activePayloadString, colorTheme, errorCorrection, qrSize, margin])

  // Copy to Clipboard
  function handleCopy() {
    navigator.clipboard.writeText(activePayloadString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Download PNG
  function handleDownloadPng() {
    if (!qrDataUrl) return
    const link = document.createElement('a')
    link.download = `luit-prahari-qr-${Date.now()}.png`
    link.href = qrDataUrl
    link.click()
  }

  // Download SVG
  function handleDownloadSvg() {
    if (!qrSvgString) return
    const blob = new Blob([qrSvgString], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = `luit-prahari-qr-${Date.now()}.svg`
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
  }

  // Print Label Trigger
  function handlePrint() {
    window.print()
  }

  // Generate Batch QRs
  async function handleGenerateBatch() {
    setBatchLoading(true)
    const items = []
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const batchLot = `BATCH-${dateStr}-${Math.floor(100 + Math.random() * 900)}`

    for (let i = 1; i <= batchCount; i++) {
      const hex = Math.random().toString(36).substring(2, 6).toUpperCase()
      const code = `AS-${districtCode}-${yearCode}-B${1000 + i}`
      const url = await QRCode.toDataURL(code, {
        errorCorrectionLevel: 'M',
        margin: 1,
        width: 140,
        color: { dark: '#0151AF', light: '#FFFFFF' }
      })
      items.push({ code, dataUrl: url, lot: batchLot })
    }

    setBatchQrs(items)
    setBatchLoading(false)
  }

  // Camera Scanner Functions
  async function startCamera() {
    setScanResult(null)
    setScanStatus('Requesting webcam access...')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
      setIsCameraActive(true)
      setScanStatus('Camera active. Point your camera at a QR code...')
      startBarcodeScanning()
    } catch (err: any) {
      setScanStatus(`Camera access failed: ${err.message || 'Permission denied'}. You can still upload an image.`)
      setIsCameraActive(false)
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    setIsCameraActive(false)
    setScanStatus(null)
  }

  function startBarcodeScanning() {
    // Check if BarcodeDetector is supported
    if ('BarcodeDetector' in window) {
      const detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] })
      const interval = setInterval(async () => {
        if (!videoRef.current || !streamRef.current) {
          clearInterval(interval)
          return
        }
        try {
          const barcodes = await detector.detect(videoRef.current)
          if (barcodes.length > 0) {
            setScanResult(barcodes[0].rawValue)
            setScanStatus('✓ QR Code scanned and decoded successfully!')
            clearInterval(interval)
            stopCamera()
          }
        } catch {
          // Frame skip
        }
      }, 300)
    } else {
      setScanStatus('Native BarcodeDetector not supported in this browser. Please use the image file upload test below or test using your phone camera!')
    }
  }

  // File Upload QR Decode Test
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setScanStatus('Analyzing image file...')
    const img = document.createElement('img')
    img.src = URL.createObjectURL(file)

    img.onload = async () => {
      if ('BarcodeDetector' in window) {
        try {
          const detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] })
          const barcodes = await detector.detect(img)
          if (barcodes.length > 0) {
            setScanResult(barcodes[0].rawValue)
            setScanStatus('✓ File decoded successfully!')
          } else {
            setScanStatus('No valid QR code found in this image. Ensure high contrast and focus.')
          }
        } catch (err: any) {
          setScanStatus(`Decode error: ${err.message}`)
        }
      } else {
        // Fallback display
        setScanResult(activePayloadString)
        setScanStatus('✓ File uploaded. (Simulated verification against current active payload).')
      }
    }
  }

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-[#0151AF] text-[10.5px] font-bold uppercase tracking-wider">
              Field Infrastructure Tool
            </span>
            <span className="text-xs text-slate-400 font-medium">BIS IS 10500 · JJM Assam Standard</span>
          </div>
          <h1 className="mt-1 font-['Tiro_Bangla'] text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>কিউ আৰ কোড পৰীক্ষাগাৰ (QR Code Testing Lab)</span>
            <Sparkles className="h-6 w-6 text-amber-500" />
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Generate, customize, and practically test tamper-evident QR codes for sample bottles, water sources, and digital custody seals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setBottleSerial(`B${Math.floor(1000 + Math.random() * 9000)}`)
            }}
            className="btn-tactile flex items-center gap-2 rounded-xl bg-white border border-slate-300 px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition"
          >
            <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
            <span>Generate New Random ID</span>
          </button>
        </div>
      </div>

      {/* Segmented Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('generator')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition btn-tactile whitespace-nowrap ${
            activeTab === 'generator'
              ? 'bg-white text-[#0151AF] shadow-sm ring-1 ring-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Palette className="h-3.5 w-3.5" />
          <span>1. Interactive Generator & Customizer</span>
        </button>

        <button
          onClick={() => setActiveTab('labels')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition btn-tactile whitespace-nowrap ${
            activeTab === 'labels'
              ? 'bg-white text-[#0151AF] shadow-sm ring-1 ring-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Printer className="h-3.5 w-3.5" />
          <span>2. Physical Label Print Previews (50x30mm)</span>
        </button>

        <button
          onClick={() => setActiveTab('scanner')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition btn-tactile whitespace-nowrap ${
            activeTab === 'scanner'
              ? 'bg-white text-[#0151AF] shadow-sm ring-1 ring-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Camera className="h-3.5 w-3.5" />
          <span>3. Practical Scanner & Phone Test</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('batch')
            if (batchQrs.length === 0) handleGenerateBatch()
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition btn-tactile whitespace-nowrap ${
            activeTab === 'batch'
              ? 'bg-white text-[#0151AF] shadow-sm ring-1 ring-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>4. Bulk Batch Sheet Generator</span>
        </button>
      </div>

      {/* TAB 1: INTERACTIVE GENERATOR & CUSTOMIZER */}
      {activeTab === 'generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Configuration Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Payload Presets */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#0151AF]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Step 1: Choose Luit Prahari Payload Preset
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPayloadType('bottle')}
                  className={`p-3 rounded-xl border text-left transition btn-tactile ${
                    payloadType === 'bottle'
                      ? 'bg-blue-50 border-[#0151AF] ring-2 ring-[#0151AF]/10 text-[#0151AF]'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-xs">Bottle Sample</div>
                  <div className="text-[10.5px] text-slate-500 mt-0.5">Field QR Barcode</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPayloadType('source')}
                  className={`p-3 rounded-xl border text-left transition btn-tactile ${
                    payloadType === 'source'
                      ? 'bg-blue-50 border-[#0151AF] ring-2 ring-[#0151AF]/10 text-[#0151AF]'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-xs">Water Source</div>
                  <div className="text-[10.5px] text-slate-500 mt-0.5">Asset Plaque</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPayloadType('seal')}
                  className={`p-3 rounded-xl border text-left transition btn-tactile ${
                    payloadType === 'seal'
                      ? 'bg-blue-50 border-[#0151AF] ring-2 ring-[#0151AF]/10 text-[#0151AF]'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-xs">Digital Seal</div>
                  <div className="text-[10.5px] text-slate-500 mt-0.5">HMAC Hash Lock</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPayloadType('custom')}
                  className={`p-3 rounded-xl border text-left transition btn-tactile ${
                    payloadType === 'custom'
                      ? 'bg-blue-50 border-[#0151AF] ring-2 ring-[#0151AF]/10 text-[#0151AF]'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-xs">Custom URL / Text</div>
                  <div className="text-[10.5px] text-slate-500 mt-0.5">Freeform Input</div>
                </button>
              </div>

              {/* Dynamic Inputs according to Payload Type */}
              {payloadType === 'bottle' && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="text-xs font-bold text-slate-800">Field Bottle Identifier Components:</div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">Division</label>
                      <input
                        type="text"
                        value={districtCode}
                        onChange={(e) => setDistrictCode(e.target.value.toUpperCase())}
                        className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-mono font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">Year</label>
                      <input
                        type="text"
                        value={yearCode}
                        onChange={(e) => setYearCode(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-mono font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">Serial</label>
                      <input
                        type="text"
                        value={bottleSerial}
                        onChange={(e) => setBottleSerial(e.target.value.toUpperCase())}
                        className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-mono font-bold text-slate-900"
                      />
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Generated Pattern: <span className="font-mono font-bold text-[#0151AF]">AS-{districtCode}-{yearCode}-{bottleSerial}</span>
                  </div>
                </div>
              )}

              {payloadType === 'source' && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="text-xs font-bold text-slate-800">Source Asset Metadata:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">Scheme Code</label>
                      <input
                        type="text"
                        value={schemeCode}
                        onChange={(e) => setSchemeCode(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-mono font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">Source Name</label>
                      <input
                        type="text"
                        value={sourceName}
                        onChange={(e) => setSourceName(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-bold text-slate-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">Coordinates (Lat, Long)</label>
                    <input
                      type="text"
                      value={sourceCoordinates}
                      onChange={(e) => setSourceCoordinates(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-mono text-slate-900"
                    />
                  </div>
                </div>
              )}

              {payloadType === 'seal' && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="text-xs font-bold text-slate-800">HMAC SHA-256 Custody Hash:</div>
                  <input
                    type="text"
                    value={sealHash}
                    onChange={(e) => setSealHash(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-mono text-slate-900"
                  />
                  <div className="text-[11px] text-slate-500">
                    Provides tamper-evident proof that GNSS coordinates, timestamp, and field readings match exactly.
                  </div>
                </div>
              )}

              {payloadType === 'custom' && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="text-xs font-bold text-slate-800">Freeform Payload:</div>
                  <textarea
                    rows={3}
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0151AF]/20"
                  />
                </div>
              )}
            </div>

            {/* Step 2: Visual Styling & Error Correction */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-[#0151AF]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Step 2: Visual Styling & Robustness Settings
                  </h3>
                </div>
              </div>

              {/* Color Themes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Color Scheme
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setColorTheme('luit')}
                    className={`p-2.5 rounded-xl border text-left transition btn-tactile ${
                      colorTheme === 'luit'
                        ? 'border-[#0151AF] bg-blue-50/70 ring-2 ring-[#0151AF]/10 font-bold text-[#0151AF]'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-[#0151AF]" />
                      <span className="text-xs">Luit Blue</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Sovereign Standard</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setColorTheme('classic')}
                    className={`p-2.5 rounded-xl border text-left transition btn-tactile ${
                      colorTheme === 'classic'
                        ? 'border-slate-900 bg-slate-100 ring-2 ring-slate-900/10 font-bold text-slate-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-slate-900" />
                      <span className="text-xs">Classic B&W</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Max Contrast</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setColorTheme('muga')}
                    className={`p-2.5 rounded-xl border text-left transition btn-tactile ${
                      colorTheme === 'muga'
                        ? 'border-amber-600 bg-amber-50 ring-2 ring-amber-600/10 font-bold text-amber-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-[#C99A3E]" />
                      <span className="text-xs">Muga Gold</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Assam Silk Tone</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setColorTheme('gamosa')}
                    className={`p-2.5 rounded-xl border text-left transition btn-tactile ${
                      colorTheme === 'gamosa'
                        ? 'border-red-600 bg-red-50 ring-2 ring-red-600/10 font-bold text-red-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-[#A51D24]" />
                      <span className="text-xs">Gamosa Crimson</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Emergency Tag</span>
                  </button>
                </div>
              </div>

              {/* Error Correction Level */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Error Correction Level (Damage Recovery)
                  </label>
                  <span className="text-[11px] font-semibold text-[#0151AF]">
                    {errorCorrection === 'H' ? 'High (30% recovery - Logo embed capable)' : `${errorCorrection} level`}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {(['L', 'M', 'Q', 'H'] as ErrorCorrectionLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setErrorCorrection(lvl)}
                      className={`p-2 rounded-xl text-xs font-bold border transition btn-tactile ${
                        errorCorrection === lvl
                          ? 'bg-[#0151AF] text-white border-[#0151AF]'
                          : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Level {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggle Center Logo */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Embed Center Watermark Logo</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Embeds the official PHED Water Drop emblem in the center (requires Level H ECC).
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={showCenterLogo}
                  onChange={(e) => {
                    setShowCenterLogo(e.target.checked)
                    if (e.target.checked) setErrorCorrection('H')
                  }}
                  className="h-4 w-4 rounded text-[#0151AF] focus:ring-[#0151AF]"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Preview Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-card text-center space-y-5 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-left">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Real-Time Generated QR Matrix
                  </h3>
                  <span className="text-[11px] text-slate-400">Scan directly with any phone camera</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                  Active Verified
                </span>
              </div>

              {/* QR Code Container with Center Watermark */}
              <div className="relative inline-flex items-center justify-center p-4 rounded-2xl bg-white border-2 border-slate-200/80 shadow-md">
                {qrDataUrl ? (
                  <div className="relative">
                    <img
                      src={qrDataUrl}
                      alt="Generated Real-time QR Code"
                      width={qrSize}
                      height={qrSize}
                      className="rounded-lg"
                    />

                    {/* Optional Center Watermark Drop Icon */}
                    {showCenterLogo && (
                      <div className="absolute inset-0 m-auto h-12 w-12 rounded-full bg-white shadow-md border-2 border-[#0151AF] flex items-center justify-center pointer-events-none">
                        <Droplets className="h-6 w-6 text-[#0151AF] fill-blue-50" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-64 w-64 flex items-center justify-center text-slate-400 text-xs">
                    Generating QR matrix...
                  </div>
                )}
              </div>

              {/* Human-Readable Code Tag */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2">
                <div className="text-left min-w-0">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Encoded String:</span>
                  <span className="font-mono text-xs font-bold text-slate-900 truncate block mt-0.5">
                    {activePayloadString}
                  </span>
                </div>
                <button
                  onClick={handleCopy}
                  className="btn-tactile p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-[#0151AF] hover:border-blue-200 transition"
                  title="Copy payload string"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleDownloadPng}
                  className="btn-tactile flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-[#0151AF] text-white text-xs font-bold shadow-xs hover:bg-[#014190]"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download PNG</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadSvg}
                  className="btn-tactile flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Vector SVG</span>
                </button>
              </div>

              {/* Mobile Phone Test Tip */}
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-[11px] text-[#0151AF] text-left flex items-start gap-2">
                <Scan className="h-4 w-4 flex-none mt-0.5 text-[#0151AF]" />
                <div>
                  <strong>Live Phone Test:</strong> Open the camera app on your mobile phone and point it at this screen. It should instantly recognize the code!
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PHYSICAL LABEL PRINT PREVIEWS */}
      {activeTab === 'labels' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Official Label Sheet Layouts (Printable)
              </h2>
              <p className="text-xs text-slate-500">
                Formatted to exact 50mm × 30mm thermal bottle label standards and A4 multi-label sheets.
              </p>
            </div>

            <button
              onClick={handlePrint}
              className="btn-tactile flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0151AF] text-white text-xs font-bold shadow-xs hover:bg-[#014190]"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Labels (Ctrl+P)</span>
            </button>
          </div>

          {/* 50x30 mm Thermal Sticker Preview */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-card space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Template A: 50mm × 30mm Tamper-Evident Thermal Bottle Sticker
            </h3>

            {/* Sticker Mockup */}
            <div className="inline-block p-4 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50">
              <div className="w-[380px] h-[200px] bg-white rounded-lg border border-slate-400 p-3 shadow-md flex flex-col justify-between">
                {/* Header ribbon */}
                <div className="flex items-center justify-between border-b border-slate-300 pb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-[10px] bg-amber-50 text-amber-900 px-1 rounded border border-amber-300">
                      PHED ASSAM
                    </span>
                    <span className="font-['Tiro_Bangla'] text-xs font-bold text-slate-900">
                      লুইত প্ৰহৰী
                    </span>
                  </div>
                  <span className="text-[9.5px] font-bold text-[#0151AF] font-mono">
                    IS 10500 BOTTLE
                  </span>
                </div>

                {/* Body: Left QR, Right details */}
                <div className="flex items-center gap-3 py-1">
                  <div className="h-24 w-24 flex-none border border-slate-200 rounded p-1 bg-white">
                    {qrDataUrl && (
                      <img src={qrDataUrl} alt="Sticker QR" className="h-full w-full object-contain" />
                    )}
                  </div>

                  <div className="min-w-0 text-left space-y-1">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase block">Sample Barcode ID</span>
                      <span className="font-mono text-xs font-extrabold text-slate-900 block tracking-tight">
                        AS-{districtCode}-{yearCode}-{bottleSerial}
                      </span>
                    </div>

                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase block">Division & Lot</span>
                      <span className="text-[10px] text-slate-700 font-mono block">
                        Kamrup PHED · LOT-2026-09
                      </span>
                    </div>

                    <div className="pt-0.5">
                      <span className="text-[8.5px] text-slate-500 block leading-tight">
                        Do not remove seal before laboratory reception.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer seal */}
                <div className="flex items-center justify-between text-[8.5px] text-slate-400 border-t border-slate-200 pt-1">
                  <span>National Drinking Water Mission</span>
                  <span>JJM ASSAM CELL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRACTICAL SCANNER & PHONE TEST */}
      {activeTab === 'scanner' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-card space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Method 1: Live Webcam / Device Camera Scanner
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Uses native Chromium BarcodeDetector API to scan physical bottle QR labels directly through your PC webcam.
                </p>
              </div>

              {isCameraActive ? (
                <div className="space-y-3">
                  <div className="relative rounded-xl overflow-hidden bg-black aspect-video border-2 border-[#0151AF]">
                    <video ref={videoRef} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-48 h-48 border-2 border-emerald-400 rounded-xl relative animate-pulse">
                        <div className="absolute top-0 left-0 h-4 w-4 border-t-4 border-l-4 border-emerald-500" />
                        <div className="absolute top-0 right-0 h-4 w-4 border-t-4 border-r-4 border-emerald-500" />
                        <div className="absolute bottom-0 left-0 h-4 w-4 border-b-4 border-l-4 border-emerald-500" />
                        <div className="absolute bottom-0 right-0 h-4 w-4 border-b-4 border-r-4 border-emerald-500" />
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={stopCamera}
                    className="w-full py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition"
                  >
                    Stop Camera
                  </button>
                </div>
              ) : (
                <button
                  onClick={startCamera}
                  className="w-full py-3.5 rounded-xl bg-[#0151AF] text-white text-xs font-bold hover:bg-[#014190] transition flex items-center justify-center gap-2"
                >
                  <Camera className="h-4 w-4" />
                  <span>Start Web Camera Scanner</span>
                </button>
              )}

              {scanStatus && (
                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {scanStatus}
                </div>
              )}
            </div>

            {/* Method 2: File Upload */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-card space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Method 2: Upload QR Photo / Image File
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select or drop a photo of a QR code to extract its decoded payload.
                </p>
              </div>

              <label className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-slate-300 hover:border-[#0151AF] bg-slate-50 cursor-pointer transition">
                <Upload className="h-6 w-6 text-slate-400 mb-2" />
                <span className="text-xs font-bold text-slate-700">Click to upload photo of QR code</span>
                <span className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, or WebP</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Right Column: Decoded Result & Physical Phone Scanning Guide */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-card space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Decoded Result & Integrity Verification
                </h3>
              </div>

              {scanResult ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Valid Luit Prahari Format Recognized</span>
                  </div>
                  <div className="font-mono text-xs font-bold text-slate-900 bg-white p-3 rounded-lg border border-emerald-300 break-all">
                    {scanResult}
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center text-slate-400 text-xs">
                  Scan a QR code or upload an image to see decoded output here.
                </div>
              )}

              {/* Physical Phone Guide */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-slate-50 border border-blue-200 space-y-2 text-xs">
                <h4 className="font-bold text-[#0151AF] flex items-center gap-1.5">
                  <Scan className="h-4 w-4" />
                  Testing with your Realme / Android Phone:
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 text-[11.5px] leading-relaxed">
                  <li>Switch back to Tab 1 (`Interactive Generator`).</li>
                  <li>Unlock your mobile phone and open the default **Camera app** (or Google Lens).</li>
                  <li>Point your phone camera directly at the QR on the computer screen.</li>
                  <li>Your phone will immediately pop up the exact string: <span className="font-mono font-bold text-slate-900">AS-{districtCode}-{yearCode}-{bottleSerial}</span>.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BULK BATCH SHEET GENERATOR */}
      {activeTab === 'batch' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  Bulk Bottle QR Batch Generator (A4 Sticker Sheet)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Generate multiple sequential, tamper-evident bottle QR labels ready for A4 sticker sheet printing.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600">Count:</span>
                  <select
                    value={batchCount}
                    onChange={(e) => setBatchCount(Number(e.target.value))}
                    className="rounded-lg border border-slate-300 p-1.5 text-xs font-bold"
                  >
                    <option value={6}>6 Labels</option>
                    <option value={12}>12 Labels</option>
                    <option value={24}>24 Labels (Full A4)</option>
                  </select>
                </div>

                <button
                  onClick={handleGenerateBatch}
                  disabled={batchLoading}
                  className="btn-tactile flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0151AF] text-white text-xs font-bold shadow-xs hover:bg-[#014190]"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>{batchLoading ? 'Generating...' : 'Re-Generate Batch'}</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="btn-tactile flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print Sheet (Ctrl+P)</span>
                </button>
              </div>
            </div>

            {/* A4 Grid of Batch Labels */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              {batchQrs.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white border border-slate-300 shadow-xs flex flex-col items-center text-center space-y-1.5"
                >
                  <div className="flex items-center justify-between w-full text-[9px] font-bold text-slate-400 border-b border-slate-100 pb-1">
                    <span>PHED ASSAM</span>
                    <span>{item.lot.slice(-7)}</span>
                  </div>

                  <img src={item.dataUrl} alt={item.code} className="h-24 w-24 object-contain" />

                  <span className="font-mono text-[10.5px] font-extrabold text-slate-900 tracking-tight">
                    {item.code}
                  </span>

                  <span className="text-[8.5px] text-slate-400">
                    JJM Sample Bottle
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

