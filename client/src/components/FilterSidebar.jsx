import React, { useState } from "react";
import { Filter, X, ChevronDown } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

const FilterSidebar = ({
  showFilterPhone,
  setShowFilterPhone,
  filters,
  setFilters,
}) => {
  
  const niches = [
  { value: "lifestyle", label: "Lifestyle" },
  { value: "fitness", label: "Fitness" },
  { value: "food", label: "Food" },
  { value: "travel", label: "Travel" },
  { value: "tech", label: "Technology" },
  { value: "gaming", label: "Gaming" },
  { value: "fashion", label: "Fashion" },
  { value: "beauty", label: "Beauty" },
  { value: "business", label: "Business" },
  { value: "education", label: "Education" },
  { value: "entertainment", label: "Entertainment" },
  { value: "music", label: "Music" },
  { value: "art", label: "Art" },
  { value: "sports", label: "Sports" },
  { value: "health", label: "Health" },
  { value: "finance", label: "Finance" },
];


  const currency = import.meta.env.VITE_CURRENCY || "$";

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // 🔍 SEARCH STATE
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const onChangeSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() !== "") {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
      navigate("/marketplace");
    }
  };

  // 🔧 COLLAPSIBLE SECTIONS
  const [expandedSections, setExpandedSections] = useState({
    platform: true,
    price: true,
    followers: true,
    niche: true,
    status: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // 🔁 UPDATE FILTERS
  const onFiltersChange = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  // 📌 Platforms
  const platforms = [
    { value: "instagram", label: "Instagram" },
    { value: "tiktok", label: "TikTok" },
    { value: "youtube", label: "YouTube" },
    { value: "twitch", label: "Twitch" },
    { value: "twitter", label: "Twitter" },
    { value: "facebook", label: "Facebook" },
    { value: "linkedin", label: "LinkedIn" },
  ];
  
  const onClearFilters = () => {
    if(search){
      navigate("/marketplace");
    }
    setFilters({
      platform: null,
      minFollowers: 0,
      niche: null, 
      verified: false,
      monetized: false,
      maxPrice: 100000,
    });
  }
  return (
    <div
      className={`${
        showFilterPhone ? "max-sm:fixed" : "max-sm:hidden"
      } max-sm:inset-0 z-[100] max-sm:h-screen max-sm:overflow-scroll 
      bg-white rounded-lg shadow-sm border border-gray-200 h-fit sticky 
      top-24 md:min-w-[300px]`}
    >
      {/* HEADER */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-gray-700">
            <Filter className="size-4" />
            <h3 className="font-semibold">Filters</h3>
          </div>

          <div className="flex items-center gap-2">
            <X
              className="size-6 text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 
              rounded transition-colors cursor-pointer"
              onClick={onClearFilters}
            />

            <button
              onClick={() => setShowFilterPhone(false)}
              className="sm:hidden text-sm border text-gray-700 px-3 py-1 rounded"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* SCROLLABLE FILTERS */}
      <div className="p-4 space-y-6 sm:max-h-[calc(100vh-200px)] overflow-y-scroll no-scrollbar">

        {/* 🔍 SEARCH BAR */}
        <div>
          <input
            type="text"
            placeholder="Search by username, platform, niche, etc."
            className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md outline-indigo-500"
            onChange={onChangeSearch}
            value={search}
          />
        </div>

        {/* 📌 PLATFORM FILTER */}
        <div>
          <button
            onClick={() => toggleSection("platform")}
            className="flex items-center justify-between w-full mb-3"
          >
            <label className="font-medium">Platform</label>
            <ChevronDown
              className={`size-4 transition-transform ${
                expandedSections.platform ? "rotate-180" : ""
              }`}
            />
          </button>

          {expandedSections.platform && (
            <div className="space-y-2">
              {platforms.map((platform, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-gray-700 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={filters.platform?.includes(platform.value) || false}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      const current = filters.platform || [];

                      const updated = checked
                        ? [...current, platform.value]
                        : current.filter((p) => p !== platform.value);

                      onFiltersChange({
                        platform: updated.length > 0 ? updated : null,
                      });
                    }}
                  />
                  <span>{platform.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* price range */}
        <div>
          <button
            onClick={() => toggleSection("price")}
            className="flex items-center justify-between w-full mb-3"
          >
            <label className="font-medium">Price Range</label>
            <ChevronDown
              className={`size-4 transition-transform ${
                expandedSections.price ? "rotate-180" : ""
              }`}
            />
          </button>

          {expandedSections.price && (
            <div className="space-y-3">
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="100"
                  value={filters.maxPrice || 100000}
                  onChange={(e)=>onFiltersChange({...filters, maxPrice: parseInt(e.target.value)})}
                  className="w-full h-2 bg-grey-200 rounded-lg appearance-none cursor-pointer
                  accent-indigo-600"
                />
                <div className="flex items-center justify-between text-sm text-gray-600">
                     <span>{currency}0</span>
                     <span>{currency}{(filters.maxPrice || 100000).toLocaleString()}</span>
                </div>
            </div>
          )}
        </div>
        
        {/* Followers range */}
        <div>
          <button
            onClick={() => toggleSection("followers")}
            className="flex items-center justify-between w-full mb-3"
          >
            <label className="font-medium">Minimum Followers</label>
            <ChevronDown
              className={`size-4 transition-transform ${
                expandedSections.followers ? "rotate-180" : ""
              }`}
            />
          </button>

          {expandedSections.followers && (
            <select 
            value={filters.minFollowers?.toString() || "" }
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  minFollowers: e.target.value === "" ? null : parseInt(e.target.value)
                })
              }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 
            outline-indigo-700 ">
              <option value="0">Select minimum followers</option>
              <option value="1000">1k+</option>
              <option value="5000">5k+</option>
              <option value="10000">10k+</option>
              <option value="50000">50k+</option>
              <option value="100000">100k+</option>
              <option value="500000">500k+</option>
              <option value="1000000">1M+</option>
            </select>
          )}
        </div>

        {/* niche filter */}
        <div>
          <button
            onClick={() => toggleSection("niche")}
            className="flex items-center justify-between w-full mb-3"
          >
            <label className="font-medium">Niche</label>
            <ChevronDown
              className={`size-4 transition-transform ${
                expandedSections.niche ? "rotate-180" : ""
              }`}
            />
          </button>

          {expandedSections.niche && (
            <select 
            value={filters.niche || "" }
            onChange={(e)=> onFiltersChange({...filters , niche : e.target.value || null})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 
            outline-indigo-700 ">
              <option value="">Select Niches</option>
              {niches.map((niche) => (
                <option key={niche.value} value={niche.value}>{niche.label}</option>
              ))}
            </select>
          )}
        </div>

        {/* verification status */}
        <div>
          <button
            onClick={() => toggleSection("status")}
            className="flex items-center justify-between w-full mb-3"
          >
            <label className="font-medium">Account status</label>
            <ChevronDown
              className={`size-4 transition-transform ${
                expandedSections.status ? "rotate-180" : ""
              }`}
            />
          </button>

          {expandedSections.status && (
           <div className="space-y-3">
             <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" checked = {filters.verified || false}
                onChange={(e)=>onFiltersChange({...filters , verified: e.target.checked})}
                />
                <span className="text-sm text-gray-700">Verifies Accounts Only</span>
             </label>
             <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" checked = {filters.monetized || false}
                onChange={(e)=>onFiltersChange({...filters , monetized: e.target.checked})}
                />
                <span className="text-sm text-gray-700">Monetized Accounts Only</span>
             </label>
           </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
