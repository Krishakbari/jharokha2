import React, { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../constant";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [name, setName] = useState("");
  const [subName, setSubName] = useState("");
  const [parentId, setParentId] = useState("");
  const [image, setImage] = useState(null);
  const [subImage, setSubImage] = useState(null);
  
  // Edit modal states
  const [editModal, setEditModal] = useState({ open: false, item: null, type: "" });
  const [editName, setEditName] = useState("");
  const [editParentId, setEditParentId] = useState("");
  const [editImage, setEditImage] = useState(null);

  // Fetch main categories
  const getCategories = async () => {
    try {
      const { data } = await axios.get(`${API}/categories`);
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch subcategories for a given main category (for listing all, we fetch for each)
  const getAllSubcategories = async () => {
    try {
      let allSubs = [];
      for (const cat of categories) {
        const { data } = await axios.get(`${API}/categories/${cat.slug}`);
        allSubs = [...allSubs, ...data];
      }
      setSubcategories(allSubs);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      getAllSubcategories();
    }
  }, [categories]);

  // Create main category
  const handleCreateMain = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (image) formData.append("image", image);

      await axios.post(`${API}/category`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setName("");
      setImage(null);
      getCategories();
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  // Create subcategory
  const handleCreateSub = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", subName);
      formData.append("parentId", parentId);
      if (subImage) formData.append("image", subImage);

      await axios.post(`${API}/category`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSubName("");
      setParentId("");
      setSubImage(null);
      getAllSubcategories();
    } catch (error) {
      console.error("Error creating subcategory:", error);
    }
  };

  // Open edit modal
  const openEditModal = (item, type) => {
    setEditModal({ open: true, item, type });
    setEditName(item.name);
    setEditParentId(item.parent || "");
    setEditImage(null);
  };

  // Close edit modal
  const closeEditModal = () => {
    setEditModal({ open: false, item: null, type: "" });
    setEditName("");
    setEditParentId("");
    setEditImage(null);
  };

  // Handle edit submission
  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", editName);
      
      if (editModal.type === "subcategory") {
        formData.append("parentId", editParentId);
      }
      
      if (editImage) {
        formData.append("image", editImage);
      }

      await axios.put(`${API}/category/${editModal.item._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      closeEditModal();
      getCategories();
      if (editModal.type === "subcategory") {
        getAllSubcategories();
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  // Delete category or subcategory
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await axios.delete(`${API}/category/${id}`);
      getCategories();
      getAllSubcategories();
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  return (
    <div className="p-6 space-y-10 bg-gray-50 min-h-screen">
      {/* ================== MAIN CATEGORY SECTION ================== */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Main Categories</h2>
        
        {/* Create Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Add New Main Category</h3>
          <form onSubmit={handleCreateMain} className="flex gap-4 flex-wrap items-end">
            <div className="flex-1 min-w-64">
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
              <input
                type="text"
                placeholder="Enter category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
            <div className="flex-1 min-w-64">
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <button 
              type="submit" 
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
            >
              Create Category
            </button>
          </form>
        </div>

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-xl mb-2">📂</div>
            <p className="text-gray-500">No main categories found. Create your first category above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div key={category._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  {category.image ? (
                    <img
                      src={`${API}/img/${category.image}`}
                      alt={category.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-gray-400 text-4xl">📂</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-800 mb-3 truncate" title={category.name}>
                    {category.name}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(category, "category")}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
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

      {/* ================== SUBCATEGORY SECTION ================== */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Subcategories</h2>
        
        {/* Create Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Add New Subcategory</h3>
          <form onSubmit={handleCreateSub} className="flex gap-4 flex-wrap items-end">
            <div className="flex-1 min-w-64">
              <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory Name</label>
              <input
                type="text"
                placeholder="Enter subcategory name"
                value={subName}
                onChange={(e) => setSubName(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div className="flex-1 min-w-64">
              <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Main Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-64">
              <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSubImage(e.target.files[0])}
                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
            >
              Create Subcategory
            </button>
          </form>
        </div>

        {/* Subcategories Grid */}
        {subcategories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-xl mb-2">📁</div>
            <p className="text-gray-500">
              {categories.length === 0 
                ? "Create main categories first, then add subcategories." 
                : "No subcategories found. Create your first subcategory above!"
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {subcategories.map((subcategory) => (
              <div key={subcategory._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  {subcategory.image ? (
                    <img
                      src={`${API}/img/${subcategory.image}`}
                      alt={subcategory.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-gray-400 text-4xl">📁</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-800 mb-1 truncate" title={subcategory.name}>
                    {subcategory.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 truncate" title={categories.find((cat) => cat._id === subcategory.parent)?.name || "Unknown"}>
                    Parent: {categories.find((cat) => cat._id === subcategory.parent)?.name || "Unknown"}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(subcategory, "subcategory")}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(subcategory._id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
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

      {/* ================== EDIT MODAL ================== */}
      {editModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Edit {editModal.type === "category" ? "Category" : "Subcategory"}
                </h3>
                <button
                  onClick={closeEditModal}
                  className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleEdit} className="space-y-4">
                {/* Current Image Preview */}
                {editModal.item.image && (
                  <div className="text-center">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Image</label>
                    <img
                      src={`${API}/img/${editModal.item.image}`}
                      alt={editModal.item.name}
                      className="w-24 h-24 object-cover rounded-lg mx-auto border"
                    />
                  </div>
                )}

                {/* Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Parent Category Select (only for subcategories) */}
                {editModal.type === "subcategory" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
                    <select
                      value={editParentId}
                      onChange={(e) => setEditParentId(e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Main Category</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Image Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {editModal.item.image ? "Change Image" : "Add Image"} (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditImage(e.target.files[0])}
                    className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;