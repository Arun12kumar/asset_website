"use client";

import AssetCard from "@/components/mainui/AssetCard";
import CategoryGrid from "@/components/mainui/CategoryGrid";
import { Button } from "@/components/ui/button";
import { useGetAllAssetinCard } from "@/controller/assetController";
import { mockAssets } from "@/data/MockData";
import { ArrowRight, RefreshCw, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

const page = () => {
  const[asset,setAsset] = useState([])

    const { data, isLoading, error } = useGetAllAssetinCard();
    useEffect(() => {
      if (data) {
        setAsset(data); // Set API response
      }
    }, [data]);

  const featuredAssets = asset.filter((a) => a.tags?.includes("feature"));
  const recentAssets = asset.slice(0, 8);

  return (
    <div className="container lg:px-15 px-3 py-5 space-y-8 mx-auto">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-8 md:p-12">
        <div className="max-w-2xl">
          <h1 className="mb-4">Find Your Next Great Deal</h1>
          <p className="text-xl mb-6 text-blue-50">
            Buy and sell everything from electronics to properties. Connect directly with sellers in your area.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <div className="text-2xl">10,000+</div>
              <div className="text-sm text-blue-100">Active Listings</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <div className="text-2xl">5,000+</div>
              <div className="text-sm text-blue-100">Happy Customers</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <div className="text-2xl">50+</div>
              <div className="text-sm text-blue-100">Cities</div>
            </div>
          </div>
        </div>
      </div>


      {/* categories */}
      <CategoryGrid />

      {/* Featured Listings */}
      {featuredAssets.length > 0 && (
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-yellow-500" />
            <h2 className="text-lg font-semibold">Featured Listings</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredAssets.map((asset) => (
              <AssetCard key={asset._id} asset={asset} />
            ))}
          </div>
        </div>
      )}

      {/* Recent Listings */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-row gap-3 items-center">
            <RefreshCw className="w-6 h-6 text-blue-500" />
            <h2 className="text-lg font-semibold">Recent Listings</h2>

          </div>

          <Button variant="ghost" >
            View All
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentAssets.map((asset) => (
            <AssetCard
              key={asset._id}
              asset={asset}
            />
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <h2 className="mb-4">Want to Sell Something?</h2>
        <p className="text-gray-600 mb-6">
          List your products, properties, or vehicles and reach thousands of potential buyers
        </p>
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
          Start Selling Now
        </Button>
      </div>
    </div>
  );
};

export default page;
