import React, { useState, useEffect } from "react";
import { initialData } from '../Data/data';

// Helper function for filtering the data
const filterData = (data, filters) => {
  const { name, categories, date, price, minRating } = filters;
  // Function to format date from yyyy-mm-dd to dd-mm-yyyy
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  // Filtering logic
  return data.filter(
    (item) =>
      (!name || item.name.toLowerCase().includes(name.toLowerCase())) &&
      (!categories.length ||
        categories.includes(item.category.toLowerCase())) &&
      (!date || item.date === formatDate(date)) &&
      (price === "Any" ||
        (price === "High" ? item.price >= 500 : item.price < 500)) &&
      (minRating === "Any" || item.rating >= parseFloat(minRating))
  );
};

// Main Table component
function Table() {
  // State for data, categories and filters
  const [data, setData] = useState(initialData);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    categories: [],
    date: "",
    price: "Any",
    minRating: "Any",
  });
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // Initialize categories on first render
  useEffect(() => {
    const uniqueCategories = Array.from(
      new Set(data.map((item) => item.category.toLowerCase()))
    );
    setCategories(uniqueCategories);
  }, [data]);

  // Handle input changes for filters
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const newCategories = [...filters.categories];
      if (newCategories.includes(value)) {
        const index = newCategories.indexOf(value);
        newCategories.splice(index, 1);
      } else {
        newCategories.push(value);
      }
      setFilters({ ...filters, categories: newCategories });
    } else {
      setFilters({ ...filters, [name]: value });
    }
  };

  // Handle delete action
  const handleDelete = (item) => {
    console.log("Deleting:", item);
    const newData = data.filter((d) => d !== item);
    setData(newData);
  };

  // Apply filters to the data
  const filteredData = filterData(data, filters);

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      name: "",
      categories: [],
      date: "",
      price: "Any",
      minRating: "Any",
    });
  };

  // Render table
  return (
    <div
      data-testid="table-component"
      className="h-[600px] p-4 bg-white rounded"
    >
      <div className="flex flex-row justify-between pb-2">
        <div className="flex flex-row space-x-2">
          {["name", "date"].map((field, index) => (
            <input
              key={index}
              data-testid={`filter-${field}`}
              name={field}
              type={field === "date" ? "date" : "text"}
              value={filters[field]}
              onChange={handleChange}
              className="border-2 border-gray-300 rounded"
              placeholder={`Search by ${field}`}
            />
          ))}
          <select
            data-testid="filter-price"
            name="price"
            onChange={handleChange}
            value={filters.price}
            className="border-2 border-gray-300 rounded"
          >
            <option value="Any">Any Price</option>
            <option value="High">High {"(>= 500/-)"}</option>
            <option value="Low">Low {"(< 500/-)"}</option>
          </select>
          <select
            data-testid="filter-rating"
            name="minRating"
            onChange={handleChange}
            value={filters.minRating}
            className="border-2 border-gray-300 rounded"
          >
            <option value="Any">Any Rating</option>
            <option value="4.5">4.5+</option>
            <option value="4">4+</option>
            <option value="3.5">3.5+</option>
            <option value="3">3+</option>
          </select>
          <div className="relative inline-block text-left">
            <button
              data-testid="filter-category-button"
              type="button"
              className="border-2 border-gray-300 rounded p-2"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            >
              Category
            </button>
            {showCategoryDropdown && (
              <div className="origin-top-right absolute mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div
                  className="py-1"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="menu-button"
                  tabIndex="-1"
                >
                  {categories.map((category, index) => (
                    <label key={index} className="block px-4 py-2 text-sm">
                      <input
                        data-testid={`filter-category-${category}`}
                        type="checkbox"
                        name="categories"
                        value={category}
                        checked={filters.categories.includes(category)}
                        onChange={handleChange}
                      />
                      {` ${category}`}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            data-testid="reset-button"
            className="border-2 border-gray-300 rounded p-2"
            onClick={resetFilters}
          >
            Reset Filters
          </button>
        </div>
      </div>
      <table className="min-w-full border-2 border-gray-300 rounded">
        <thead>
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Category</th>
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Rating</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <tr key={index} data-testid="table-row">
                <td className="border px-4 py-2">{item.name}</td>
                <td className="border px-4 py-2">{item.category}</td>
                <td className="border px-4 py-2">{item.date}</td>
                <td className="border px-4 py-2">{item.price}/-</td>
                <td className="border px-4 py-2">{item.rating}</td>
                <td className="border px-4 py-2">
                  <button
                    data-testid="delete-button"
                    onClick={() => handleDelete(item)}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr data-testid="no-data-row">
              <td className="border px-4 py-2 text-center" colSpan="6">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}


export default Table;