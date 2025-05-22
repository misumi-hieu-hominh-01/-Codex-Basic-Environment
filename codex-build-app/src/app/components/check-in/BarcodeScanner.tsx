'use client';

import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';

interface BarcodeScannerProps {
  onBarcodeScanned?: (value: string) => void;
}

export function BarcodeScanner({ onBarcodeScanned }: BarcodeScannerProps) {
  const webcamRef = useRef<Webcam>(null);
  const [permission, setPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [lastBarcode, setLastBarcode] = useState<string | null>(null);

  // Request camera permission on mount
  useEffect(() => {
    async function requestPermission() {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        setPermission('granted');
      } catch (err) {
        console.error('Camera permission denied', err);
        setPermission('denied');
      }
    }

    requestPermission();
  }, []);

  // Barcode detection logic
  useEffect(() => {
    if (permission !== 'granted') return;

    let active = true;
    let detector: any;

    async function initDetector() {
      if ('BarcodeDetector' in window) {
        detector = new (window as any).BarcodeDetector({ formats: ['ean_13', 'qr_code', 'code_128'] });
      } else {
        try {
          const mod = await import('@undecaf/barcode-detector-polyfill');
          detector = new mod.BarcodeDetectorPolyfill({ formats: ['ean_13', 'qr_code', 'code_128'] });
        } catch (e) {
          console.error('Failed to load BarcodeDetector polyfill', e);
          return;
        }
      }
      scanFrame();
    }

    async function scanFrame() {
      if (!active || !detector || !webcamRef.current) return;
      const video = webcamRef.current.video;
      if (!video || video.readyState !== 4) {
        requestAnimationFrame(scanFrame);
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        try {
          const bitmap = await createImageBitmap(canvas);
          const barcodes = await detector.detect(bitmap);
          if (barcodes.length > 0) {
            const value = barcodes[0].rawValue;
            if (value && value !== lastBarcode) {
              setLastBarcode(value);
              onBarcodeScanned?.(value);
            }
          }
        } catch (err) {
          console.error('Barcode detection error', err);
        }
      }
      requestAnimationFrame(scanFrame);
    }

    initDetector();
    return () => {
      active = false;
    };
  }, [permission, lastBarcode, onBarcodeScanned]);

  if (permission === 'pending') {
    return <div>Requesting camera permission…</div>;
  }
  if (permission === 'denied') {
    return <div>Camera access denied.</div>;
  }

  return (
    <div>
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/png"
        videoConstraints={{ facingMode: { ideal: 'environment' } }}
        style={{ width: '100%', height: 'auto' }}
      />
      {lastBarcode && <div>Last scanned: {lastBarcode}</div>}
    </div>
  );
}
