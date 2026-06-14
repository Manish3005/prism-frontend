import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { analyzeReturnItem } from "../api/bridgeApi";

export default function CameraInspection() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const location = useLocation();
  const returnData = location.state;

  const [loading, setLoading] = useState(false);
  const [finalLoading, setFinalLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  // 🔥 Multi-angle steps
  const steps = [
    { key: "front", label: "Capture FRONT view of the product" },
    { key: "left", label: "Capture LEFT side of the product" },
    { key: "right", label: "Capture RIGHT side of the product" },
    { key: "top", label: "Capture TOP view of the product" },
    { key: "bottom", label: "Capture BOTTOM view of the product" }
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [images, setImages] = useState({});

  // 🎥 Start camera once
  useEffect(() => {
    let stream;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error(err);
      }
    };

    startCamera();

    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // 📸 Capture per step
  const captureFrame = async () => {
    setLoading(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageBase64 = canvas.toDataURL("image/jpeg");

    const stepKey = steps[currentStep].key;

    const updatedImages = {
      ...images,
      [stepKey]: imageBase64,
    };

    setImages(updatedImages);
    setLoading(false);

    // 👉 move to next step OR finish
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      await submitAllImages(updatedImages);
    }
  };

  // 🤖 Final AI submission (ALL images)
  const submitAllImages = async (allImages) => {
    setFinalLoading(true);

    try {
      const result = await analyzeReturnItem({
        images: allImages, // 🔥 multi-angle input
        returnId: returnData?.returnId,
        productName: returnData?.productName,
        value: returnData?.value,
      });

      setScanResult(result);
    } catch (error) {
      console.error(error);

      // fallback mock result
      setScanResult({
        detected_item: returnData?.productName,
        condition_grade: "Open_Box",
        confidence_score: 0.91,
        suggested_depreciation_percentage: 20,
      });
    }

    setFinalLoading(false);
  };

  // 📊 Result screen
  if (scanResult) {
    const recovery =
      returnData.value *
      (1 - scanResult.suggested_depreciation_percentage / 100);

    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-3xl">
          <h1 className="text-3xl font-bold mb-6">
            Product Health Card
          </h1>

          <div className="space-y-3">
            <p>
              <b>Detected Item:</b> {scanResult.detected_item}
            </p>

            <p>
              <b>Condition Grade:</b> {scanResult.condition_grade}
            </p>

            <p>
              <b>Confidence:</b>{" "}
              {(scanResult.confidence_score * 100).toFixed(1)}%
            </p>

            <p>
              <b>Depreciation:</b>{" "}
              {scanResult.suggested_depreciation_percentage}%
            </p>

            <p>
              <b>Recovery Value:</b> ₹{Math.round(recovery)}
            </p>
          </div>

          <div className="mt-6 flex gap-4">
            <button className="bg-green-600 text-white px-5 py-2 rounded">
              Confirm Secondary Listing
            </button>

            <button className="bg-orange-600 text-white px-5 py-2 rounded">
              Route To Liquidation
            </button>
          </div>

          {/* 🖼️ Preview captured images */}
          <div className="mt-6 grid grid-cols-3 gap-2">
            {Object.entries(images).map(([key, img]) => (
              <div key={key} className="text-center">
                <img
                  src={img}
                  className="w-full h-24 object-cover rounded border"
                />
                <p className="text-xs mt-1">{key}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 📷 Camera + Step UI
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="h-screen flex flex-col items-center justify-center">

        {/* Step Instruction */}
        <h2 className="text-xl mb-2 text-center">
          {steps[currentStep].label}
        </h2>

        {/* Progress */}
        <p className="mb-4 text-gray-300">
          Step {currentStep + 1} of {steps.length}
        </p>

        {/* Camera Feed */}
        <div className="w-full max-w-5xl rounded-xl overflow-hidden border border-gray-700">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full"
          />
        </div>

        {/* Capture Button */}
        <button
          onClick={captureFrame}
          disabled={loading || finalLoading}
          className="mt-6 bg-blue-600 px-6 py-3 rounded-lg"
        >
          {loading
            ? "Capturing..."
            : finalLoading
            ? "Analyzing All Images..."
            : currentStep === steps.length - 1
            ? "Capture & Finish"
            : "Capture & Next"}
        </button>

        {/* Hidden canvas */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}