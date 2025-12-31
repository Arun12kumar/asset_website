"use client";

import { useGetAllPublicCategory } from "@/controller/categoryController";
import {
  Smartphone,
  Laptop,
  Camera,
  Car,
  Bike,
  Home,
  Building,
  Sofa,
  Shirt,
  PawPrint,
  Book,
  Dumbbell,
  BriefcaseBusiness,
  Utensils,
  Plane,
  Gamepad2,
  Watch,
  Wallet,
  ChevronRight,
  Monitor
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const iconMap = {
  Smartphone,
  Laptop,
  Camera,
  Car,
  Bike,
  Home,
  Building,
  Sofa,
  Shirt,
  PawPrint,
  Book,
  Dumbbell,
  BriefcaseBusiness,
  Utensils,
  Plane,
  Gamepad2,
  Watch,
  Wallet,
  Monitor
};

const CategoryGrid = () => {
  const navigate = useRouter();
  const [categories, setCategories] = useState([]);
  const { data, isLoading, isError } = useGetAllPublicCategory();

  useEffect(() => {
    if (data) {
      setCategories(data);
      console.log(data, "test");
    }
  }, [data]);

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2>Browse Categories</h2>
        <button className="text-blue-600 flex items-center gap-1" onClick={() => navigate.push("/allasset")}>
          View All
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {categories.map((category) => {
          const Icon = iconMap[category?.icon] || Smartphone;
          return (
            <button
              key={category._id}
              onClick={() => navigate.push(`/allasset?category=${encodeURIComponent(category.categoryName)}`)}
              className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                <Icon className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-center">{category.categoryName}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryGrid;
