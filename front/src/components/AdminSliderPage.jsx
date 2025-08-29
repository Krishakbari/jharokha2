import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../constant";

const AdminSliderPage = () => {
  const [sliders, setSliders] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    redirectTo: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // Fetch all sliders
  const fetchSliders = async () => {
    try {
      const res = await axios.get(`${API}/slider`);
      setSliders(res.data);
    } catch (err) {
      console.error("Error fetching sliders:", err);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Submit new or edited slider
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editMode && !formData.image)
      return alert("Please select an image for new slider!");

    const data = new FormData();
    data.append("title", formData.title);
    data.append("subtitle", formData.subtitle);
    data.append("redirectTo", formData.redirectTo);
    if (formData.image) data.append("image", formData.image);

    try {
      setLoading(true);
      if (editMode) {
        await axios.put(`${API}/slider/${editId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Slider updated successfully!");
      } else {
        await axios.post(`${API}/slider`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Slider created successfully!");
      }
      resetForm();
      fetchSliders();
    } catch (err) {
      console.error("Error saving slider:", err);
      alert("Failed to save slider");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: "", subtitle: "", redirectTo: "", image: null });
    setEditMode(false);
    setEditId(null);
  };

  // Edit slider
  const handleEdit = (slider) => {
    setFormData({
      title: slider.title,
      subtitle: slider.subtitle,
      redirectTo: slider.redirectTo,
      image: null,
    });
    setEditMode(true);
    setEditId(slider._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete slider
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this slider?")) return;
    try {
      await axios.delete(`${API}/slider/${id}`);
      alert("Slider deleted!");
      fetchSliders();
    } catch (err) {
      console.error("Error deleting slider:", err);
      alert("Failed to delete slider");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Sliders</h1>

      {/* Slider Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 mb-8"
      >
        <h2 className="text-lg font-semibold mb-4">
          {editMode ? "Edit Slider" : "Add New Slider"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Slider Title"
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            placeholder="Slider Subtitle"
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="redirectTo"
            value={formData.redirectTo}
            onChange={handleChange}
            placeholder="Redirect URL"
            required
            className="border p-2 rounded"
          />
          <input
            type="file"
            name="image"
            onChange={handleChange}
            accept="image/*"
            className="border p-2 rounded"
          />
        </div>
        <div className="mt-4 flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading
              ? "Saving..."
              : editMode
              ? "Update Slider"
              : "Add Slider"}
          </button>
          {editMode && (
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Sliders List */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Existing Sliders</h2>
        {sliders.length === 0 ? (
          <p>No sliders found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sliders.map((slider) => (
              <div
                key={slider._id}
                className="border rounded-lg overflow-hidden shadow-md"
              >
                <img
                  src={`${API}${slider.image}`}
                  alt={slider.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold">{slider.title}</h3>
                  <p className="text-sm text-gray-600">{slider.subtitle}</p>
                  <p className="text-xs text-blue-600">
                    Redirect: {slider.redirectTo}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(slider)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(slider._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSliderPage;
