// components/Scanner.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";

const Scanner: React.FC = () => {
  const [videoInputDevices, setVideoInputDevices] = useState<MediaDeviceInfo[]>(
    []
  );
  const [selectedDeviceId, setSelectedDeviceId] = useState<
    string | undefined
  >();
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const resultRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    codeReaderRef.current = codeReader;
    codeReader
      .listVideoInputDevices()
      .then((devices) => {
        setVideoInputDevices(devices);
        setSelectedDeviceId(devices[0]?.deviceId);
      })
      .catch((err) => console.error(err));

    return () => {
      codeReader.reset();
    };
  }, []);

  const handleStart = () => {
    if (selectedDeviceId && videoRef.current) {
      console.log("tset",videoRef)
      codeReaderRef.current?.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        (result: any, err) => {
          if (result) {
            resultRef.current!.textContent = result.text;
          }
          if (err && !(err instanceof NotFoundException)) {
            console.error(err);
            resultRef.current!.textContent = err.toString();
          }
        }
      );
    }
  };

  const handleReset = () => {
    codeReaderRef.current?.reset();
    if (resultRef.current) {
      resultRef.current.textContent = "";
    }
  };

  const askCameraPermission =
  async (): Promise<MediaStream | null> => await navigator.mediaDevices.getUserMedia({ video: true });

  return (
    <main className="wrapper py-8 ">
      <section className="container mx-auto" id="demo-content">
        <h1 className="text-2xl font-bold mb-4 ">Barcode/QRcode Scanner</h1>
        <div className="flex gap-2">
        </div>
        <div className="flex gap-2 mt-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleStart}
          >
            Start
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>

        <div className="mt-4">
          <video
            ref={videoRef}
            width="300"
            height="200"
            className="border border-gray-400"
          ></video>
        </div>

        {videoInputDevices.length == 0 && (<div>not found device</div>)}
        {videoInputDevices.length > 0 && (
          <div className="mt-4">
            <label className="block mb-2">Change video source:</label>
            <select
              className="p-2 border border-gray-300"
              onChange={(e) => setSelectedDeviceId(e.target.value)}
              value={selectedDeviceId}
            >
              {videoInputDevices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <label className="block mt-5">Result:</label>
        <pre
          ref={resultRef}
          className="p-4 bg-gray-50 border border-gray-800"
        ></pre>
      </section>

      <footer className="footer mt-8">
        <section className="container mx-auto">
          <p>
            Copyright{" "}
            <a
              className="text-blue-500 underline"
              href="https://humanica.com"
              target="_blank"
            >
              Humanica
            </a>
          </p>
        </section>
      </footer>
    </main>
  );
};

export default Scanner;
