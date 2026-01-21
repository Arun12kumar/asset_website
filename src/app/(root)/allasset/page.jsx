"use client";

import { Button } from "@/components/ui/button";
import React, { useState, useMemo, useEffect, Suspense } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Grid3x3, Filter, X } from "lucide-react";
import AssetCard from "@/components/mainui/AssetCard";
import { useGetAllAssetinCard } from "@/controller/assetController";
import { useSearchParams } from "next/navigation";

const AssetContent = () => {
  const [sortBy, setSortBy] = useState("recent");
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [assets, setAssets] = useState([]);
  const searchParams = useSearchParams();
  const searchText = searchParams.get("search") || "";
  const categoryFromURL = decodeURIComponent(searchParams.get("category") || "all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // API CALL
  const { data, isLoading, error } = useGetAllAssetinCard();
  useEffect(() => {
    if (data) {
      setAssets(data); // Set API response
    }
  }, [data]);

  useEffect(() => {
    if (categoryFromURL !== "all") {
      setSelectedCategory(categoryFromURL);
    }
  }, [categoryFromURL]);

  // Create dynamic categories based on API
  const categories = useMemo(() => {
    const categoryMap = {};

    assets.forEach((asset) => {
      const cat = asset.categoryId?.categoryName || "Other";
      const subCat = asset.subcategoryId?.subCatname || null;

      if (!categoryMap[cat]) {
        categoryMap[cat] = new Set();
      }
      if (subCat) categoryMap[cat].add(subCat);
    });

    return Object.entries(categoryMap).map(([cat, subs]) => ({
      name: cat,
      subcategories: [...subs],
    }));
  }, [assets]);

  const selectedCategoryObj = selectedCategory !== "all" ? categories.find((c) => c.name === selectedCategory) : null;

  const conditions = ["new", "used", "refurbished"];

  const handleConditionChange = (condition) => {
    setSelectedConditions((prev) =>
      prev.includes(condition) ? prev.filter((c) => c !== condition) : [...prev, condition]
    );
  };

  const formatPrice = (price) => {
    if (price >= 10000000) return "₹1Cr+";
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
    if (price >= 1000) return `₹${(price / 1000).toFixed(0)}K`;
    return `₹${price}`;
  };

  // APPLY FILTERS
  let filteredAssets = assets;

  if (searchText.length > 0) {
    filteredAssets = filteredAssets.filter((asset) => asset.title.toLowerCase().includes(searchText.toLowerCase()));
  }

  if (selectedCategory !== "all") {
    filteredAssets = filteredAssets.filter((asset) => asset.categoryId?.categoryName === selectedCategory);
  }

  if (selectedSubcategory !== "all") {
    filteredAssets = filteredAssets.filter((asset) => asset.subcategoryId?.subCatname === selectedSubcategory);
  }

  if (selectedConditions.length > 0) {
    filteredAssets = filteredAssets.filter((asset) => selectedConditions.includes(asset.condition));
  }

  filteredAssets = filteredAssets.filter((asset) => asset.price >= priceRange[0] && asset.price <= priceRange[1]);

  const sortedAssets = [...filteredAssets].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "recent":
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  if (isLoading) return <p className="p-10 text-center">Loading...</p>;
  if (error) return <p className="p-10 text-center text-red-500">Error loading assets</p>;

  return (
    <div className="flex gap-6 px-3 lg:px-15 min-h-[30vh]">
      {/* FILTER SIDEBAR — MOBILE OVERLAY */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setIsFilterOpen(false)}></div>
      )}

      {/* SIDEBAR */}
      <div
        className={`
        fixed lg:static top-0 left-0 h-full lg:h-auto w-72 lg:w-64 bg-white border-r 
        z-50 lg:z-auto p-6 overflow-y-auto
        transform transition-transform duration-300 ease-in-out
        ${isFilterOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-lg">Filters</h3>
          <Button
            variant="ghost"
            size="sm"
            className="hidden lg:block"
            onClick={() => {
              setSelectedCategory("all");
              setSelectedSubcategory("all");
              setSelectedConditions([]);
              setPriceRange([0, 1000000]);
            }}
          >
            Clear All
          </Button>

          {/* CLOSE BUTTON FOR MOBILE */}
          <button onClick={() => setIsFilterOpen(false)} className="lg:hidden text-gray-600 text-sm flex bg-blue-500 rounded-full p-1">
            <X className="text-white"/>
          </button>
        </div>

        {/* Category */}
        <div className="mb-6">
          <Label className="mb-2 block">Category</Label>
          <Select
            value={selectedCategory}
            onValueChange={(value) => {
              setSelectedCategory(value);
              setSelectedSubcategory("all");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.name} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Subcategory */}
        {selectedCategoryObj && (
          <div className="mb-6">
            <Label className="mb-2 block">Subcategory</Label>
            <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select Subcategory" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {selectedCategoryObj.subcategories.map((sub) => (
                  <SelectItem key={sub} value={sub}>
                    {sub}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Price */}
        <div className="mb-6">
          <Label className="mb-2 block">Price Range</Label>
          <Slider min={0} max={1000000} step={1000} value={priceRange} onValueChange={setPriceRange} />
          <div className="flex justify-between text-sm text-gray-700 mt-2">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>

        {/* Condition */}
        <div className="mb-6">
          <Label className="mb-3 block">Condition</Label>
          <div className="space-y-3">
            {conditions.map((condition) => (
              <div key={condition} className="flex items-center gap-2">
                <Checkbox
                  checked={selectedConditions.includes(condition)}
                  onCheckedChange={() => handleConditionChange(condition)}
                />
                <Label className="capitalize">{condition}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* CLEAR ALL */}
        <Button
          variant="outline"
          className="w-full mt-4 lg:hidden"
          onClick={() => {
            setSelectedCategory("all");
            setSelectedSubcategory("all");
            setSelectedConditions([]);
            setPriceRange([0, 100000]);
          }}
        >
          Clear All
        </Button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 mt-5">
        {/* Toolbar */}
        <div className="bg-white rounded-lg border p-4 mb-6 flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => setIsFilterOpen(true)} className="lg:hidden">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>

          <span className="text-sm text-gray-600">{sortedAssets.length} results</span>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 hidden lg:block">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Asset Grid */}
        {sortedAssets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedAssets.map((asset) => (
              <AssetCard key={asset._id} asset={asset} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border p-12 text-center">
            <Grid3x3 className="w-16 h-16 mx-auto text-gray-400" />
            <h3 className="mt-4 font-semibold">No Results Found</h3>
            <p className="text-gray-600">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Page = () => {
  return (
    <Suspense fallback={<p className="p-10 text-center">Loading...</p>}>
      <AssetContent />
    </Suspense>
  );
};

export default Page;
