"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/ui/shadcn-io/dropzone";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAssetContext } from "@/context/AssetProvider";
import { useGetAllcategory } from "@/controller/categoryController";
import { useGetsubcategoryUsingCategory } from "@/controller/subcategoryController";
import { useUpdateAssetController } from "@/controller/assetController";
import z from "zod";


const MAX_FILE_SIZE = 20 * 1024 * 1024;
const isImageType = (file) => typeof file?.type === "string" && file.type.startsWith("image/");
const assetSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().min(5, "Description required"),
  price: z.coerce.number().min(1, "Price required"),
  categoryId: z.string().min(1, "Category is required"),
  subcategoryId: z.string().optional(),
  brands: z.string().optional(),
  condition: z.string().min(1, "Condition is required"),
  status: z.string().min(1, "Status is required"),
  tags: z.string().min(1, "tags is required"),
  quantity: z.coerce.number().min(1, "Quantity is required"),
  yearofpurchase: z
    .string()
    .min(1, "Purchase date required")
    .refine((dateStr) => {
      const inputDate = new Date(dateStr);
      const today = new Date();
      return inputDate < today;
    }, "Purchase date cannot be today or a future date"),
  seller_name: z.string().min(2,"seller name is require"),
  seller_email: z.email("seller email is require"),
  seller_phone: z.string().min(1,"seller phone is require"),
  place: z.string().min(1, "Place required"),
  street: z.string().min(1, "Street required"),
  city: z.string().min(1, "City required"),
  pincode: z.coerce.number(),
  state: z.string().min(1),
  country: z.string().min(1),
  mapLink: z.string().min(1).optional(),
  latitude: z.coerce.number().min(1, "latitude required"),
  longitude: z.coerce.number().min(1, "longitude required"),
  images: z
    .array(z.any())
    .min(1, "At least one image is required")
    .refine((files) => files.every((f) => {
      if (typeof f === 'object' && f.url) return true; // Existing image object
      if (f instanceof File) return f.size <= MAX_FILE_SIZE && isImageType(f); // New file
      return false;
    }), {
      message: "Images must be image files and <= 20MB each",
    }),
  coverImage: z
    .array(z.any())
    .min(1, "Cover image is required")
    .refine((files) => files.every((f) => {
      if (typeof f === 'object' && f.url) return true; // Existing cover image object
      if (f instanceof File) return f.size <= MAX_FILE_SIZE && isImageType(f); // New file
      return false;
    }), {
      message: "Cover image must be an image and <= 20MB",
    }),
  isActive: z.boolean().default(true),
});

const EditAsset = () => {
  const { editOpen, setEditOpen, asset } = useAssetContext();
  const { mutate, isPending } = useUpdateAssetController();
  const { data: categories } = useGetAllcategory();

  const [existingImages, setExistingImages] = useState([]);
  const [existingCoverImage, setExistingCoverImage] = useState(null);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const form = useForm({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      categoryId: "",
      subcategoryId: "",
      brands: "",
      condition: "",
      status: "",
      tags: "",
      quantity: "",
      yearofpurchase: "",
      place: "",
      street: "",
      city: "",
      pincode: "",
      state: "",
      country: "India",
      seller_name: "",
      seller_email: "",
      seller_phone: "",
      mapLink: "",
      latitude: "",
      longitude: "",
      images: [],
      coverImage: [],
      isActive: true,
    }
  });

  const selectedCategory = form.watch("categoryId");
  const { data: subcategory } = useGetsubcategoryUsingCategory(selectedCategory);

  const watchedImages = form.watch("images");
  const watchedCover = form.watch("coverImage");

  const [coverPreview, setCoverPreview] = useState(null);

  // Reset subcategory when category changes
  useEffect(() => {
    if (selectedCategory) {
      form.setValue("subcategoryId", "");
    }
  }, [selectedCategory, form]);

  // Handle cover image preview
  useEffect(() => {
    if (Array.isArray(watchedCover) && watchedCover.length > 0) {
      const file = watchedCover[0];
      if (file instanceof File) {
        const url = URL.createObjectURL(file);
        setCoverPreview(url);
        return () => URL.revokeObjectURL(url);
      } else if (typeof file === 'object' && file.url) {
        setCoverPreview(file.url);
      }
    } else {
      setCoverPreview(null);
    }
  }, [watchedCover]);

  // Populate Form When Asset data Loads
  useEffect(() => {
    if (asset && editOpen) {
      console.log("Asset data:", asset);
      
      // Format date for yearofpurchase
      let formattedDate = "";
      if (asset.yearofpurchase) {
        const date = new Date(asset.yearofpurchase);
        formattedDate = date.toISOString().split('T')[0];
      }

      // Store existing images for preview
      const existingAssetImages = asset.images || [];
      setExistingImages(existingAssetImages);
      
      if (asset.coverImage) {
        setExistingCoverImage(asset.coverImage);
      }

      form.reset({
        title: asset.title ?? "",
        description: asset.description ?? "",
        price: asset.price ?? "",
        categoryId: asset.categoryId?._id ?? asset.categoryId ?? "",
        subcategoryId: asset.subcategoryId?._id ?? asset.subcategoryId ?? "",
        brands: asset.brands ?? "",
        condition: asset.condition ?? "",
        status: asset.status ?? "",
        tags: Array.isArray(asset.tags) ? asset.tags[0] : (asset.tags ?? ""),
        quantity: asset.quantity ?? "",
        yearofpurchase: formattedDate,
        
        place: asset.address?.place ?? "",
        street: asset.address?.street ?? "",
        city: asset.address?.city ?? "",
        pincode: asset.address?.pincode ?? "",
        state: asset.address?.state ?? "",
        country: asset.address?.country ?? "India",
        
        seller_name: asset.seller?.name ?? "",
        seller_email: asset.seller?.email ?? "",
        seller_phone: asset.seller?.phone ?? "",
        
        mapLink: asset.mapFrameLink ?? "",
        
        latitude: asset.location?.coordinates?.[1] ?? "",
        longitude: asset.location?.coordinates?.[0] ?? "",
        
        images: existingAssetImages,
        coverImage: asset.coverImage ? [asset.coverImage] : [],
        isActive: asset.isActive ?? true,
      });
    }
  }, [asset, editOpen, form]);

  const onSubmit = (values) => {
    const fd = new FormData();

    // Append basic fields
    fd.append("title", values.title);
    fd.append("description", values.description);
    fd.append("price", values.price);
    fd.append("categoryId", values.categoryId);
    
    // Only append subcategoryId if it exists
    if (values.subcategoryId && values.subcategoryId.trim() !== "") {
      fd.append("subcategoryId", values.subcategoryId);
    }
    
    fd.append("brands", values.brands || "");
    fd.append("condition", values.condition);
    fd.append("status", values.status);
    fd.append("tags", values.tags);
    fd.append("quantity", values.quantity);
    fd.append("yearofpurchase", values.yearofpurchase);
    fd.append("mapFrameLink", values.mapLink || "");

    fd.append("address", JSON.stringify({
      place: values.place,
      street: values.street,
      city: values.city,
      pincode: values.pincode,
      state: values.state,
      country: values.country,
    }));

    fd.append("seller", JSON.stringify({
      name: values.seller_name,
      email: values.seller_email,
      phone: values.seller_phone,
    }));

    fd.append("location", JSON.stringify({
      type: "Point",
      coordinates: [Number(values.longitude), Number(values.latitude)],
    }));

    // Append images to delete
    if (imagesToDelete.length > 0) {
      fd.append("imagesToDelete", JSON.stringify(imagesToDelete));
    }

    // Append new images (filter out existing image objects)
    const newImages = values.images?.filter(file => file instanceof File) || [];
    newImages.forEach((file) => {
      fd.append("images", file);
    });

    // Append existing images that weren't deleted
    const remainingExistingImages = values.images?.filter(file => 
      typeof file === 'object' && file.url && file.public_Id
    ) || [];
    fd.append("existingImages", JSON.stringify(remainingExistingImages));

    // Append new cover image if it's a File
    if (values.coverImage[0] && values.coverImage[0] instanceof File) {
      fd.append("coverImage", values.coverImage[0]);
    }

    fd.append("isActive", values.isActive);

    console.log('FormData contents:');
    for (let [key, value] of fd.entries()) {
      console.log(key, value);
    }

    mutate(
      { id: asset._id, payload: fd },
      {
        onSuccess: () => {
          toast.success("Asset Updated!");
          setEditOpen(false);
          setExistingImages([]);
          setExistingCoverImage(null);
          setImagesToDelete([]);
        },
        onError: (err) => {
          toast.error(err?.response?.data?.message || err?.message || "Failed to update asset");
        },
      }
    );
  };

  // Handle removing existing image
  const handleRemoveExistingImage = (index, imageId) => {
    const updatedImages = [...existingImages];
    const removedImage = updatedImages.splice(index, 1)[0];
    setExistingImages(updatedImages);
    
    // Add to images to delete list
    if (removedImage.public_Id) {
      setImagesToDelete(prev => [...prev, {
        public_Id: removedImage.public_Id,
        _id: removedImage._id
      }]);
    }
    
    // Update form value with remaining existing images
    const currentFormImages = form.getValues("images") || [];
    const updatedFormImages = currentFormImages.filter(img => 
      !(typeof img === 'object' && img._id === imageId)
    );
    form.setValue("images", updatedFormImages);
  };

  // Handle removing new image
  const handleRemoveNewImage = (index) => {
    const currentImages = form.getValues("images") || [];
    const newFiles = currentImages.filter((file, i) => {
      // Keep existing image objects, remove only the new file at specified index
      if (typeof file === 'object' && file.url) return true;
      return i !== index;
    });
    form.setValue("images", newFiles);
  };

  // Handle cover image change
  const handleCoverImageChange = (file) => {
    if (file) {
      form.setValue("coverImage", [file]);
      setExistingCoverImage(null);
    } else {
      form.setValue("coverImage", []);
    }
  };

  // Check if file is an existing image object
  const isExistingImage = (file) => {
    return typeof file === 'object' && file.url && file.public_Id;
  };

  // Check if file is a new File object
  const isNewFile = (file) => {
    return file instanceof File;
  };
  if (!editOpen) return null;

  return (
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Asset</DialogTitle>
          <DialogDescription>Modify and update asset details.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">

              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/*Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                {/* BRAND */}
                <FormField
                  control={form.control}
                  name="brands"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <FormControl>
                        <Input placeholder="Brand name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* PRICE */}
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Price in INR" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* CATEGORY */}
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories?.map((cat) => (
                            <SelectItem key={cat._id} value={cat._id}>
                              {cat.categoryName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* SUBCATEGORY */}
                <FormField
                  control={form.control}
                  name="subcategoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sub Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                        disabled={!selectedCategory}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={
                              !selectedCategory 
                                ? "Select category first" 
                                : "Choose subcategory"
                            } />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subcategory && subcategory.length > 0 ? (
                            subcategory.map((sub) => (
                              <SelectItem key={sub._id} value={sub._id}>
                                {sub.subCatname}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-subcategory" disabled>
                              No subcategories available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {/* CONDITION */}
                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Condition</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="used">Used</SelectItem>
                          <SelectItem value="refurbished">Refurbished</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* STATUS */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="sold">Sold</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* TAGS */}
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select tags"/>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="feature">Feature</SelectItem>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="popular">Popular</SelectItem>
                          <SelectItem value="trending">Trending</SelectItem>
                          <SelectItem value="sale">Sale</SelectItem>
                          <SelectItem value="limited">Limited</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Quantity */}
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Purchase Year */}
                 <FormField
                  control={form.control}
                  name="yearofpurchase"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year Of Purchase</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field} 
                          max={new Date().toISOString().split('T')[0]} // Prevent future dates
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Address */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="place"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Place</FormLabel>
                      <FormControl>
                        <Input placeholder="Place" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street</FormLabel>
                      <FormControl>
                        <Input placeholder="Street" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pincode</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="State" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Location */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input type="number" step="any" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl>
                        <Input type="number" step="any" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="mapLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Map Link</FormLabel>
                    <FormControl>
                      <Input placeholder="Map link from google map" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="font-semibold underline">Seller Information</div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="seller_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seller Name</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Seller name.." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="seller_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seller Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Seller phone.." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="seller_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seller Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Seller email.." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Cover Image */}
              <FormField
                control={form.control}
                name="coverImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          handleCoverImageChange(file);
                        }}
                      
                      />
                    </FormControl>
                    <FormMessage />
                    
                    {/* Cover Image Previews */}
                    <div className="mt-2 space-y-2">
                      {/* Existing Cover Image Preview */}
                      {existingCoverImage && !coverPreview && (
                        <div className="w-48 relative">
                          <p className="text-sm text-muted-foreground mb-1">Current Cover Image:</p>
                          <img 
                            src={existingCoverImage.url} 
                            alt="existing-cover" 
                            className="w-full h-28 object-cover rounded-md border" 
                          />
                        </div>
                      )}
                      
                      {/* New Cover Image Preview */}
                      {coverPreview && (
                        <div className="w-48 relative">
                          <p className="text-sm text-muted-foreground mb-1">New Cover Image:</p>
                          <img 
                            src={coverPreview} 
                            alt="cover-preview" 
                            className="w-full h-28 object-cover rounded-md border" 
                          />
                        </div>
                      )}
                    </div>
                  </FormItem>
                )}
              />

              {/* Images Dropzone (multiple) */}
              <CardContent className="space-y-4 pt-4 px-0 md:px-6">
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => {
                    const handleRemoveNewImage = (index) => {
                      const currentImages = field.value || [];
                      const newFiles = currentImages.filter((file, i) => {
                        // Keep existing image objects, remove only the new file at specified index
                        return isExistingImage(file) || i !== index;
                      });
                      field.onChange(newFiles);
                    };

                    return (
                      <FormItem>
                        <FormLabel>Asset Images</FormLabel>
                        <FormControl>
                          <Dropzone
                            multiple
                            accept={{
                              "image/*": [],
                            }}
                            onDrop={(files) => {
                              const currentImages = field.value || [];
                              const merged = [...currentImages, ...files];
                              field.onChange(merged);
                            }}
                          >
                            <DropzoneContent />
                            <DropzoneEmptyState />
                          </Dropzone>
                        </FormControl>
                        <FormMessage />

                        {/* All Images Previews */}
                        {field.value && field.value.length > 0 && (
                          <div className="mt-4 space-y-4">
                            {/* Existing Images */}
                            {field.value.some(isExistingImage) && (
                              <div>
                                <p className="text-sm font-medium mb-2">Current Images:</p>
                                <div className="grid grid-cols-3 gap-2">
                                  {field.value.map((file, idx) => {
                                    if (isExistingImage(file)) {
                                      return (
                                        <div key={`existing-${file._id}`} className="relative">
                                          <img 
                                            src={file.url} 
                                            alt={`existing-${idx}`} 
                                            className="w-full h-24 object-cover rounded-md border" 
                                          />
                                          <button
                                            type="button"
                                            onClick={() => handleRemoveExistingImage(idx, file._id)}
                                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                          >
                                            <X size={12} />
                                          </button>
                                        </div>
                                      );
                                    }
                                    return null;
                                  })}
                                </div>
                              </div>
                            )}

                            {/* New Images */}
                            {field.value.some(isNewFile) && (
                              <div>
                                <p className="text-sm font-medium mb-2">New Images:</p>
                                <div className="grid grid-cols-3 gap-2">
                                  {field.value.map((file, idx) => {
                                    if (isNewFile(file)) {
                                      const src = URL.createObjectURL(file);
                                      return (
                                        <div key={`new-${idx}`} className="relative">
                                          <img 
                                            src={src} 
                                            alt={`new-${idx}`} 
                                            className="w-full h-24 object-cover rounded-md" 
                                            onLoad={() => URL.revokeObjectURL(src)}
                                          />
                                          <button
                                            type="button"
                                            onClick={() => handleRemoveNewImage(idx)}
                                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                          >
                                            <X size={12} />
                                          </button>
                                        </div>
                                      );
                                    }
                                    return null;
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </FormItem>
                    );
                  }}
                />
              </CardContent>

              {/* Active Toggle */}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex justify-between p-3 border rounded-lg">
                    <div>
                      <FormLabel>Active</FormLabel>
                      <p className="text-sm text-muted-foreground">Toggle asset visibility</p>
                    </div>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormItem>
                )}
              />

            </CardContent>

            <CardFooter className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>

              <Button type="submit" disabled={isPending} className="bg-blue-500">
                {isPending ? "Updating..." : "Update Asset"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAsset;