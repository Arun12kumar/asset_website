"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Heart, MapPin, SearchIcon, ChevronDown, Menu } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchAsset } from "@/controller/searchConroller";

const Header = () => {
  const router = useRouter();

  const popularLocations = [
    "Bangalore, Karnataka",
    "Chennai, Tamil Nadu",
    "Hyderabad, Telangana",
    "Mumbai, Maharashtra",
    "Delhi, NCR",
    "KOCHI, Kerala"
  ];

  const allLocations = [...popularLocations];
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationSearchQuery, setLocationSearchQuery] = useState("");
  const filteredLocations = allLocations.filter((loc) => loc.toLowerCase().includes(locationSearchQuery.toLowerCase()));
  const { data: searchResults, loading, error, searchAssets } = useSearchAsset();

  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchQuery.trim().length >= 1) {
        searchAssets(searchQuery);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [searchQuery, searchAssets]);

  const handleSuggestionClick = (asset) => {
    router.push(`/allasset/${asset.slug}`);
    setSearchQuery("");
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchQuery.trim().length >= 1) {
        router.push(`/allasset?search=${searchQuery}`);
        searchAssets(searchQuery); // still show dropdown results
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [searchQuery, searchAssets, router]);

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="container mx-auto lg:px-8 py-3 flex items-center justify-between gap-5">
        {/* Logo */}
        <div className="flex flex-row items-center gap-2 lg:w-[30%] ml-4 sm:ml-0">
          <Link href="/">
            <p className="font-bold text-2xl text-blue-600">Asset List</p>
          </Link>
        </div>

        {/* Search bar */}
        <div className="relative flex-1 min-w-[200px] md:min-w-[300px]">
          <InputGroup>
            <InputGroupInput
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>

          {/* Search Suggestions Dropdown */}
          {searchQuery && (
            <div className="absolute top-full mt-2 w-full bg-white shadow-lg rounded-lg border max-h-[30vh] overflow-y-auto z-50">
              {loading && <p className="p-3 text-sm text-gray-500">Loading...</p>}

              {error && <p className="p-3 text-sm text-red-500">Error loading suggestions</p>}

              {!loading && searchResults?.length > 0
                ? searchResults.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSuggestionClick(item)}
                    >
                      <img
                        src={item.coverImage?.url}
                        alt={item.title}
                        className="w-12 h-12 object-cover rounded-md border"
                      />
                      <p>{item.title}</p>
                    </div>
                  ))
                : !loading &&
                  searchQuery.trim().length > 1 && <p className="p-3 text-sm text-gray-500">No assets found</p>}
            </div>
          )}
        </div>

        {/* Location Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="hidden md:flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>
                {selectedLocations.length === 0
                  ? "All India"
                  : selectedLocations.length === 1
                  ? selectedLocations[0].split(",")[0]
                  : `${selectedLocations.length} Locations`}
              </span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-80 p-4" align="end">
            <div className="space-y-4">
              {/* Clear All */}
              <div className="flex items-center justify-between">
                <h4>Select Locations</h4>
                {selectedLocations.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={() => setSelectedLocations([])}>
                    Clear All
                  </Button>
                )}
              </div>

              {/* Location search */}
              <InputGroup>
                <InputGroupInput
                  placeholder="Search location..."
                  value={locationSearchQuery}
                  onChange={(e) => setLocationSearchQuery(e.target.value)}
                />
                <InputGroupAddon>
                  <SearchIcon />
                </InputGroupAddon>
              </InputGroup>

              {/* Location list */}
              <div className="max-h-80 overflow-y-auto space-y-3">
                {(locationSearchQuery ? filteredLocations : popularLocations).map((location) => (
                  <div key={location} className="flex items-center gap-2">
                    <Checkbox
                      id={location}
                      checked={selectedLocations.includes(location)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedLocations([...selectedLocations, location]);
                        } else {
                          setSelectedLocations(selectedLocations.filter((l) => l !== location));
                        }
                      }}
                    />
                    <Label htmlFor={location} className="cursor-pointer flex-1">
                      {location}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Buttons */}
        <div className="flex items-center gap-2 ml-auto">
          {/* <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Heart className="w-5 h-5" />
          </Button> */}
          <Button
            className="hidden sm:block bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => router.push("/contact")}
          >
            Contact
          </Button>
        </div>
      </div>
      <div className="flex flex-row items-center gap-3 py-2 md:hidden">
        {/* Location Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className=" md:hidden items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>
                {selectedLocations.length === 0
                  ? "All India"
                  : selectedLocations.length === 1
                  ? selectedLocations[0].split(",")[0]
                  : `${selectedLocations.length} Locations`}
              </span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-80 p-4" align="end">
            <div className="space-y-4">
              {/* Clear All */}
              <div className="flex items-center justify-between">
                <h4>Select Locations</h4>
                {selectedLocations.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={() => setSelectedLocations([])}>
                    Clear All
                  </Button>
                )}
              </div>

              {/* Location search */}
              <InputGroup>
                <InputGroupInput
                  placeholder="Search location..."
                  value={locationSearchQuery}
                  onChange={(e) => setLocationSearchQuery(e.target.value)}
                />
                <InputGroupAddon>
                  <SearchIcon />
                </InputGroupAddon>
              </InputGroup>

              {/* Location list */}
              <div className="max-h-80 overflow-y-auto space-y-3">
                {(locationSearchQuery ? filteredLocations : popularLocations).map((location) => (
                  <div key={location} className="flex items-center gap-2">
                    <Checkbox
                      id={location}
                      checked={selectedLocations.includes(location)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedLocations([...selectedLocations, location]);
                        } else {
                          setSelectedLocations(selectedLocations.filter((l) => l !== location));
                        }
                      }}
                    />
                    <Label htmlFor={location} className="cursor-pointer flex-1">
                      {location}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Button className="md:hidden bg-blue-600 text-white hover:bg-blue-700" onClick={() => router.push("/contact")}>
          Contact
        </Button>
      </div>
    </header>
  );
};

export default Header;
