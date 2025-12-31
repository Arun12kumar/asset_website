import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { useAssetContext } from "@/context/AssetProvider";

const DetailAsset = () => {
  const { detailOpen, setDetailOpen, asset } = useAssetContext();
  const [asseting, setAsseting] = useState({});

  useEffect(() => {

    const formattedDate = asset?.yearofpurchase ? new Date(asset.yearofpurchase).toISOString().split("T")[0] : "";
    

    const assets = {
      title: asset?.title ?? "",
      description: asset?.description ?? "",
      price: asset?.price ?? "",
      categoryId: asset?.categoryId?._id ?? asset?.categoryId ?? "",
      subcategoryId: asset?.subcategoryId?._id ?? asset?.subcategoryId ?? "",

      brands: asset?.brands ?? "",
      condition: asset?.condition ?? "",
      status: asset?.status ?? "",
      tags: Array.isArray(asset?.tags) ? asset.tags[0] : asset?.tags ?? "",
      quantity: asset?.quantity ?? "",
      yearofpurchase: formattedDate,

      // ---- Address ----
      place: asset?.address?.place ?? "",
      street: asset?.address?.street ?? "",
      city: asset?.address?.city ?? "",
      pincode: asset?.address?.pincode ?? "",
      state: asset?.address?.state ?? "",
      country: asset?.address?.country ?? "India",

      // ---- Seller ----
      seller_name: asset?.seller?.name ?? "",
      seller_email: asset?.seller?.email ?? "",
      seller_phone: asset?.seller?.phone ?? "",

      // ---- Map link ----
      mapLink: asset?.mapFrameLink ?? "",

      // ---- Coordinates ----
      latitude: asset?.location?.coordinates?.[1] ?? "",
      longitude: asset?.location?.coordinates?.[0] ?? "",

      // ---- Images ----
      images: asset?.images || [],
      coverImage: asset?.coverImage?.url,

      isActive: asset?.isActive ?? true,
    };

    setAsseting(assets);
  }, [asset, detailOpen]);
  return (
    <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-900">Asset Details</DialogTitle>
          <DialogDescription className="text-gray-600">Full information about the selected asset.</DialogDescription>
        </DialogHeader>

        <div className="mt-6 grid grid-cols-1 gap-6 text-sm">
          {/* Top Section — Title & Price */}
          <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-xl border">
            <h2 className="text-xl font-bold text-gray-900">{asseting.title}</h2>
            <p className="text-lg font-semibold text-green-600">₹ {asseting.price}</p>
            <p className="text-gray-600">{asseting.description}</p>
          </div>

          {/* Category & Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border bg-white shadow-sm">
              <p className="text-gray-500 text-xs">Category</p>
              <p className="font-semibold">{asseting.categoryId}</p>
            </div>
            <div className="p-4 rounded-xl border bg-white shadow-sm">
              <p className="text-gray-500 text-xs">Subcategory</p>
              <p className="font-semibold">{asseting.subcategoryId}</p>
            </div>
            <div className="p-4 rounded-xl border bg-white shadow-sm">
              <p className="text-gray-500 text-xs">Brand</p>
              <p className="font-semibold">{asseting.brands || "—"}</p>
            </div>
            <div className="p-4 rounded-xl border bg-white shadow-sm">
              <p className="text-gray-500 text-xs">Condition</p>
              <p className="font-semibold">{asseting.condition}</p>
            </div>
            <div className="p-4 rounded-xl border bg-white shadow-sm">
              <p className="text-gray-500 text-xs">Tags</p>
              <p className="font-semibold">{asseting.tags}</p>
            </div>
            <div className="p-4 rounded-xl border bg-white shadow-sm">
              <p className="text-gray-500 text-xs">Quantity</p>
              <p className="font-semibold">{asseting.quantity}</p>
            </div>
          </div>

          {/* Purchase Date */}
          <div className="p-4 rounded-xl border bg-gray-50 shadow-sm">
            <p className="text-gray-500 text-xs">Year of Purchase</p>
            <p className="font-semibold">{asseting.yearofpurchase}</p>
          </div>

          {/* Address Section */}
          <div className="p-5 rounded-xl border bg-white shadow-md">
            <h3 className="font-semibold text-lg text-gray-900 mb-3">Address</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-xs">Place</p>
                <p className="font-semibold">{asseting.place}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Street</p>
                <p className="font-semibold">{asseting.street}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">City</p>
                <p className="font-semibold">{asseting.city}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">State</p>
                <p className="font-semibold">{asseting.state}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Pincode</p>
                <p className="font-semibold">{asseting.pincode}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Country</p>
                <p className="font-semibold">{asseting.country}</p>
              </div>
            </div>
          </div>

          {/* Seller Info */}
          <div className="p-5 rounded-xl border bg-gray-50 shadow-md">
            <h3 className="font-semibold text-lg text-gray-900 mb-3">Seller Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-xs">Name</p>
                <p className="font-semibold">{asseting.seller_name}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Email</p>
                <p className="font-semibold">{asseting.seller_email}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Phone</p>
                <p className="font-semibold">{asseting.seller_phone}</p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="p-5 rounded-xl border bg-white shadow-md">
            <h3 className="font-semibold text-lg mb-3">Location</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-xs">Latitude</p>
                <p className="font-semibold">{asseting.latitude}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Longitude</p>
                <p className="font-semibold">{asseting.longitude}</p>
              </div>
            </div>

            {asseting.mapLink && (
              <iframe src={asseting.mapLink} className="w-full h-56 rounded-lg border mt-4" loading="lazy"></iframe>
            )}
          </div>

          {/* Images Section */}
          <div className="p-5 rounded-xl border bg-gray-50 shadow-md">
            <h3 className="font-semibold text-lg mb-3">Images</h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {asseting.images?.map((img, i) => (
                <img key={i} src={img.url} alt="Asset Image" className="w-full h-36 object-cover rounded-lg border" />
              ))}
            </div>

            {/* Cover Image */}
            {asseting.coverImage && (
              <>
                <p className="font-semibold mt-4">Cover Image</p>
                <img
                  src={asseting.coverImage}
                  alt="Cover"
                  className="w-full h-48 object-cover rounded-xl border mt-2"
                />
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetailAsset;
