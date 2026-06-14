import { useState } from "react";
import ItemsTab from "../components/vendor/ItemsTab";
import CameraInspection from "./CameraInspection";

export default function AmazonAdminDashboard() {
  const [activeTab, setActiveTab] = useState("items");

  const items = [
    {
      id: "1",
      product_name: "Wireless Earbuds",
      condition_grade: "Open_Box",
      resale_price: 1799,
    },
    {
      id: "2",
      product_name: "Wireless Mouse",
      condition_grade: "Refurbished",
      resale_price: 549,
    },
    {
      id: "3",
      product_name: "USB-C Cable",
      condition_grade: "New",
      resale_price: 299,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-[#131A22] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <h1 className="text-3xl font-bold">
            Amazon Admin Dashboard
          </h1>
          <p className="text-gray-300 text-sm mt-1">
            Manage inspected return items and AI-powered quality assessments
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-[#232F3E] shadow">
        <div className="max-w-7xl mx-auto flex gap-8 px-6">

          <button
            onClick={() => setActiveTab("items")}
            className={`py-4 font-medium transition-colors ${
              activeTab === "items"
                ? "text-[#FF9900] border-b-2 border-[#FF9900]"
                : "text-white"
            }`}
          >
            Items
          </button>

          <button
            onClick={() => setActiveTab("camera")}
            className={`py-4 font-medium transition-colors ${
              activeTab === "camera"
                ? "text-[#FF9900] border-b-2 border-[#FF9900]"
                : "text-white"
            }`}
          >
            Camera Inspection
          </button>

        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">

        {activeTab === "items" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-gray-500 text-sm">Total Items</p>
                <h2 className="text-2xl font-bold">24</h2>
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-gray-500 text-sm">Resale</p>
                <h2 className="text-2xl font-bold text-green-600">8</h2>
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-gray-500 text-sm">Refurbish</p>
                <h2 className="text-2xl font-bold text-blue-600">6</h2>
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-gray-500 text-sm">
                  Recycle / Donate
                </p>
                <h2 className="text-2xl font-bold text-orange-600">
                  10
                </h2>
              </div>

            </div>

            <ItemsTab items={items} />
          </>
        )}

        {activeTab === "camera" && (
          <CameraInspection />
        )}

      </div>
    </div>
  );
}