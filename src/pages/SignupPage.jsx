import { useState } from "react";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    role: "customer",
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Signup Data:", formData);

    // API call goes here
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-8">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#232F3E]">
            Create Account
          </h1>
          <p className="text-gray-500 mt-2">
            Register as Customer, Vendor, or Amazon Admin
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Role */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Account Type
            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            >
              <option value="customer">Customer</option>
              <option value="vendor">Vendor</option>
              <option value="admin">Amazon Admin</option>
            </select>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
              className="w-full border rounded-lg p-3"
              required
            />
          </div>

          {/* Company only for Vendor */}
          {formData.role === "vendor" && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Company Name
              </label>

              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter company name"
                className="w-full border rounded-lg p-3"
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full border rounded-lg p-3"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full border rounded-lg p-3"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className="w-full border rounded-lg p-3"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#FF9900] hover:bg-[#e68900] text-white font-semibold py-3 rounded-lg"
          >
            Create Account
          </button>

        </form>
      </div>
    </div>
  );
}