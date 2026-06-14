import { useState, useRef, useEffect } from 'react';
import { Camera } from 'lucide-react';
import ProductUpload from '../ProductUpload';
import HealthCard from '../HealthCard';

/**
 * Multi-angle Camera Inspection Tab
 * Captures: front, top, bottom, left, right images
 */
export default function CameraInspectionTab({ onItemScanned }) {
  const [latestCard, setLatestCard] = useState(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraOpen, setCameraOpen] = useState(false);

  const [images, setImages] = useState({
    front: null,
    top: null,
    bottom: null,
    left: null,
    right: null,
  });

  const [currentView, setCurrentView] = useState("front");

  const views = ["front", "top", "bottom", "left", "right"];

  /**
   * Start / stop camera
   */
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    if (cameraOpen) {
      startCamera();
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [cameraOpen]);

  /**
   * Capture current view image
   */
  const captureImage = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/png");

    setImages((prev) => ({
      ...prev,
      [currentView]: imageData,
    }));
  };

  /**
   * Move to next view
   */
  const nextView = () => {
    const index = views.indexOf(currentView);
    if (index < views.length - 1) {
      setCurrentView(views[index + 1]);
    }
  };

  const handleComplete = (card) => {
    setLatestCard(card);
    if (onItemScanned) onItemScanned(card);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-amazon-orange/10 p-2 rounded-lg">
          <Camera size={22} className="text-amazon-orange" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-amazon-navy-dark">
            Camera Inspection
          </h2>
          <p className="text-sm text-gray-500">
            Capture multi-angle product images for AI grading
          </p>
        </div>
      </div>

      {/* Camera Section */}
      <div className="bg-white border rounded-lg p-4">

        <h3 className="font-bold mb-2">
          Multi-Angle Product Capture
        </h3>

        {!cameraOpen ? (
          <button
            onClick={() => setCameraOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Start Camera
          </button>
        ) : (
          <div className="space-y-3">

            {/* Current view indicator */}
            <p className="text-sm font-medium">
              Capture:{" "}
              <span className="text-blue-600 uppercase">
                {currentView}
              </span>
            </p>

            {/* Live camera */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded border"
            />

            {/* Controls */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={captureImage}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Capture {currentView}
              </button>

              <button
                onClick={nextView}
                className="bg-gray-600 text-white px-4 py-2 rounded"
              >
                Next View
              </button>

              <button
                onClick={() => setCameraOpen(false)}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Close Camera
              </button>
            </div>

            {/* Preview Grid */}
            <div className="grid grid-cols-5 gap-2 mt-3">
              {views.map((v) => (
                <div key={v} className="text-center">
                  <p className="text-xs capitalize">{v}</p>

                  {images[v] ? (
                    <img
                      src={images[v]}
                      alt={v}
                      className="w-full h-16 object-cover border rounded"
                    />
                  ) : (
                    <div className="w-full h-16 border rounded bg-gray-100" />
                  )}
                </div>
              ))}
            </div>

          </div>
        )}
      </div>

      {/* Existing Upload Flow (unchanged) */}
      <ProductUpload onComplete={handleComplete} />

      {/* Health Card */}
      {latestCard && (
        <div>
          <h3 className="text-base font-bold mb-3 text-amazon-navy-dark">
            Latest Product Health Card
          </h3>
          <HealthCard card={latestCard} />
        </div>
      )}

    </div>
  );
}