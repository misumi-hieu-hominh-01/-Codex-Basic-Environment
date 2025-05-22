"use client";

import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { BarcodeConfirmModal } from "./BarcodeConfirmModal";
import styles from "./BarcodeScanner.module.css";
// Import the barcode-detector polyfill
import "barcode-detector";

interface BarcodeScannerProps {
  onBarcodeScanned?: (value: string, quantity: number) => void;
}

export function BarcodeScanner({ onBarcodeScanned }: BarcodeScannerProps) {
  const webcamRef = useRef<Webcam>(null);
  const [permission, setPermission] = useState<
    "pending" | "granted" | "denied"
  >("pending");
  const [lastBarcode, setLastBarcode] = useState<string | null>(null);
  const lastRef = useRef<string | null>(null);
  const [highlight, setHighlight] = useState(false);
  const [pendingBarcode, setPendingBarcode] = useState<string | null>(null);
  const [scanning, setScanning] = useState(true);

  const confirmBarcode = (qty: number) => {
    if (!pendingBarcode) return;
    onBarcodeScanned?.(pendingBarcode, qty);
    setLastBarcode(pendingBarcode);
    lastRef.current = pendingBarcode;
    setPendingBarcode(null);
    setScanning(true);
  };

  // Request camera permission on mount
  useEffect(() => {
    async function requestPermission() {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        setPermission("granted");
      } catch (err) {
        console.error("Camera permission denied", err);
        setPermission("denied");
      }
    }

    requestPermission();
  }, []);

  // Barcode detection logic
  useEffect(() => {
    if (permission !== "granted") return;

    let active = true;
    let barcodeDetector: BarcodeDetector | null = null;

    async function initDetector() {
      try {
        // Check if BarcodeDetector is available and supported
        if (
          "BarcodeDetector" in window &&
          (await BarcodeDetector.getSupportedFormats())
        ) {
          barcodeDetector = new BarcodeDetector({
            formats: ["ean_13", "qr_code", "code_128"],
          });
          scanFrame();
        } else {
          console.error("BarcodeDetector is not supported in this browser");
        }
      } catch (e) {
        console.error("Failed to initialize BarcodeDetector:", e);
      }
    }

    async function scanFrame() {
      if (!active || !barcodeDetector || !webcamRef.current) return;

      if (!scanning) {
        requestAnimationFrame(scanFrame);
        return;
      }

      const video = webcamRef.current.video;
      if (!video || video.readyState !== 4) {
        requestAnimationFrame(scanFrame);
        return;
      }

      try {
        // Create a canvas to capture the current video frame
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          console.error("Could not get canvas context");
          requestAnimationFrame(scanFrame);
          return;
        }

        // Draw the current video frame onto the canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Create an ImageBitmap from the canvas
        const imageBitmap = await createImageBitmap(canvas);

        // Detect barcodes from the ImageBitmap
        const barcodes = await barcodeDetector.detect(imageBitmap);

        if (barcodes.length > 0) {
          const value = barcodes[0].rawValue;
          if (value && value !== lastRef.current) {
            setPendingBarcode(value);
            setScanning(false);
            setHighlight(true);
            setTimeout(() => setHighlight(false), 400);
          }
        }
      } catch (err) {
        console.error("Barcode detection error:", err);
      }

      // Continue scanning
      requestAnimationFrame(scanFrame);
    }

    initDetector();
    return () => {
      active = false;
    };
  }, [permission, scanning]);

  if (permission === "pending") {
    return (
      <div className={styles.statusContainer}>
        <div className={styles.pendingStatus}>
          <div className={styles.spinner}></div>
          <div className={styles.statusMessage}>
            Requesting camera permission…
          </div>
          <div className={styles.statusMessage}>
            Please allow access when prompted
          </div>
        </div>
      </div>
    );
  }
  if (permission === "denied") {
    return (
      <div className={styles.statusContainer}>
        <div className={styles.deniedStatus}>
          <div className={styles.deniedIcon}>✕</div>
          <div className={styles.statusMessage}>Camera access denied</div>
          <div className={styles.statusMessage}>
            Please check your browser permissions and try again
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${highlight ? styles.highlight : ""}`}>
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/png"
        videoConstraints={{ facingMode: { ideal: "environment" } }}
        className={styles.webcam}
      />
      {lastBarcode && (
        <div className={styles.last}>Last scanned: {lastBarcode}</div>
      )}
      <BarcodeConfirmModal
        barcode={pendingBarcode ?? ""}
        isOpen={!!pendingBarcode}
        onClose={() => {
          setPendingBarcode(null);
          setScanning(true);
        }}
        onConfirm={(qty) => confirmBarcode(qty)}
        onTryAgain={() => {
          setPendingBarcode(null);
          setScanning(true);
        }}
      />
    </div>
  );
}
