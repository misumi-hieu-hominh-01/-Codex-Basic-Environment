"use client";

import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import styles from "./BarcodeScanner.module.css";
// Import the barcode-detector polyfill
import "barcode-detector";

interface BarcodeScannerProps {
  onBarcodeScanned?: (value: string) => void;
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

  const confirmBarcode = () => {
    if (!pendingBarcode) return;
    onBarcodeScanned?.(pendingBarcode);
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
        // Directly detect barcodes from the video element
        const barcodes = await barcodeDetector.detect(video);

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
  }, [permission]);

  if (permission === "pending") {
    return <div>Requesting camera permission…</div>;
  }
  if (permission === "denied") {
    return <div>Camera access denied.</div>;
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
      <Modal
        isOpen={!!pendingBarcode}
        onClose={() => {
          setPendingBarcode(null);
          setScanning(true);
        }}
      >
        {pendingBarcode && (
          <div
            onKeyDown={e => {
              if (e.key === "Enter") confirmBarcode();
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "1rem" }}>
              <span style={{ fontSize: "2rem", color: "green" }}>✔</span>
            </div>
            <p style={{ marginBottom: "1rem", textAlign: "center" }}>
              Detected barcode:
              <br />
              <strong>{pendingBarcode}</strong>
            </p>
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
              <Button
                onClick={confirmBarcode}
                autoFocus
              >
                Confirm
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setPendingBarcode(null);
                  setScanning(true);
                }}
              >
                Try Again
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
