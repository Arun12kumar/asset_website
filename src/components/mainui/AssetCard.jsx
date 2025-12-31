"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Heart, MapPin } from "lucide-react";
import { Badge } from "../ui/badge";
import { useRouter } from "next/navigation";

// Price formatter
const formatPrice = (price) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

// Time Ago Helper
export const timeAgo = (dateString) => {
  const now = new Date();
  const created = new Date(dateString);

  const seconds = Math.floor((now - created) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  return `${years} year${years > 1 ? "s" : ""} ago`;
};

const AssetCard = ({ asset }) => {
  const [userLocation, setUserLocation] = useState(null);
  const navigate = useRouter();

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => console.warn("Location blocked")
      );
    }
  }, []);

  // Haversine Formula
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    return (R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))).toFixed(1);
  };

  let distance = null;

  if (userLocation && asset.location?.coordinates) {
    const [lon, lat] = asset.location.coordinates; // GeoJSON format
    distance = getDistance(userLocation.lat, userLocation.lng, lat, lon);
  }

  return (
    <div
      className="bg-white rounded-lg border overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
      
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <Image
          src={asset.coverImage?.url || "/placeholder.png"}
          alt={asset.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          onClick={() => navigate.push(`/allasset/${asset.slug}`)}
        />

        {/* <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white">
          <Heart className="w-4 h-4 text-gray-600" />
        </button> */}

        {asset.tags?.length > 0 && (
          <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
            {asset.tags.map((tag, index) => (
              <Badge
                key={index}
                className="bg-yellow-500 text-white capitalize"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-4" onClick={() => navigate.push(`/allasset/${asset.slug}`)}>
        <h3 className="font-medium line-clamp-2 mb-1">{asset.title}</h3>

        <p className="text-blue-600 font-semibold mb-2">
          {formatPrice(asset.price)}
        </p>

        {/* Location + Distance */}
        <div className="flex items-center justify-between mb-2 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>
              {asset.address?.city}, {asset.address?.state}
            </span>
          </div>

          {distance && (
            <span className="text-gray-500">{distance} km away</span>
          )}
        </div>

        {/* Time + Condition */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">{timeAgo(asset.createdAt)}</span>
          <Badge variant="outline" className="capitalize">
            {asset.condition}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default AssetCard;
