import { useMemo, useState } from "react";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AmazonAdminDashboard() {
  const navigate = useNavigate();

  const [rows] = useState([
    {
      returnId: "RET-1001",
      productName: "boAt Airdopes 141",
      value: 1499,
      status: "Pending Inspection",
    },
    {
      returnId: "RET-1002",
      productName: "Noise ColorFit Watch",
      value: 2499,
      status: "Pending Inspection",
    },
    {
      returnId: "RET-1003",
      productName: "Logitech M331 Mouse",
      value: 899,
      status: "Pending Inspection",
    },
  ]);

  const [selected, setSelected] = useState([]);

  const allSelected =
    rows.length > 0 && selected.length === rows.length;

  const toggleAll = () => {
    if (allSelected) {
      setSelected([]);
    } else {
      setSelected(rows.map((r) => r.returnId));
    }
  };

  const toggleRow = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const selectedRows = useMemo(
    () => rows.filter((r) => selected.includes(r.returnId)),
    [rows, selected]
  );

  const openInspection = (row) => {
    navigate("/camera-inspection", {
      state: row,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-5 border-b">
          <h1 className="text-2xl font-bold">
            Amazon Internal Returns Portal
          </h1>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="p-4">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                  />
                </th>

                <th className="text-left p-4">
                  Return Request ID
                </th>

                <th className="text-left p-4">
                  Product Name
                </th>

                <th className="text-left p-4">
                  Value (INR)
                </th>

                <th className="text-left p-4">
                  Status
                </th>

                <th className="text-left p-4">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.returnId}
                  className="border-b"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selected.includes(
                        row.returnId
                      )}
                      onChange={() =>
                        toggleRow(row.returnId)
                      }
                    />
                  </td>

                  <td className="p-4">
                    {row.returnId}
                  </td>

                  <td className="p-4">
                    {row.productName}
                  </td>

                  <td className="p-4">
                    ₹{row.value}
                  </td>

                  <td className="p-4">
                    {row.status}
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() =>
                        openInspection(row)
                      }
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                    >
                      <Eye size={16} />
                      Inspect Item
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRows.length > 0 && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-4 rounded-xl shadow-xl flex gap-4">
          <button className="bg-green-600 px-4 py-2 rounded">
            Batch Approve Secondary Listing
          </button>

          <button className="bg-orange-600 px-4 py-2 rounded">
            Batch Route to Regional Liquidation
          </button>
        </div>
      )}
    </div>
  );
}