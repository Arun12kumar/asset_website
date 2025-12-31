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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "../ui/textarea";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/ui/shadcn-io/dropzone";
import { X } from "lucide-react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useGetAllcategory } from "@/controller/categoryController";
import {  useGetsubcategoryUsingCategory } from "@/controller/subcategoryController";
import { useAssetContext } from "@/context/AssetProvider";
import { usePostAssetController } from "@/controller/assetController";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB
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
    .array(z.instanceof(File))
    .min(1, "At least one image is required")
    .refine((files) => files.every((f) => f.size <= MAX_FILE_SIZE && isImageType(f)), {
      message: "Images must be image files and <= 20MB each",
    }),
  coverImage: z
    .array(z.instanceof(File))
    .min(1, "Cover image is required")
    .refine((files) => files.every((f) => f.size <= MAX_FILE_SIZE && isImageType(f)), {
      message: "Cover image must be an image and <= 20MB",
    }),
  isActive: z.boolean().default(true),
});

const AddAsset = () => {
  const { open, setOpen } = useAssetContext();
  const { mutate, isPending } = usePostAssetController();
  const { data: categories } = useGetAllcategory();
  const [previews, setPreviews] = useState([]); // combined previews for images
  const [coverPreview, setCoverPreview] = useState(null);

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
      status: "available",
      tags:"feature",
      mapLink:"",
      quantity: 1,
      seller_name:"",
      seller_email:"",
      seller_phone:"",
      yearofpurchase: "",
      place: "",
      street: "",
      city: "",
      pincode: "",
      state: "",
      country: "India",
      latitude: "",
      longitude: "",
      images: [],
      coverImage: [],
      isActive: true,
    },
    mode: "onChange",
  });

  // watch image arrays
  const selectedCategory = form.watch("categoryId");
  const watchedImages = form.watch("images");
  const watchedCover = form.watch("coverImage");

  const { data: subcategory } = useGetsubcategoryUsingCategory(selectedCategory);

  // Reset subcategory when category changes
  useEffect(() => {
    if (selectedCategory) {
      form.setValue("subcategoryId", "");
    }
  }, [selectedCategory, form]);

  // generate/revoke previews for images
  useEffect(() => {
    if (Array.isArray(watchedImages) && watchedImages.length > 0) {
      const urls = watchedImages.map((f) => URL.createObjectURL(f));
      setPreviews(urls);
      return () => urls.forEach((u) => URL.revokeObjectURL(u));
    } else {
      setPreviews([]);
    }
  }, [watchedImages]);

  // generate/revoke preview for cover image
  useEffect(() => {
    if (Array.isArray(watchedCover) && watchedCover.length > 0) {
      const url = URL.createObjectURL(watchedCover[0]);
      setCoverPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setCoverPreview(null);
    }
  }, [watchedCover]);

  // Submit handler
  const onSubmit = (values) => {
    const formData = new FormData();

    // Basic fields
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("price", values.price);
    formData.append("categoryId", values.categoryId);
    
    // Only append subcategoryId if it exists and is not empty
    if (values.subcategoryId && values.subcategoryId.trim() !== "") {
      formData.append("subcategoryId", values.subcategoryId);
    }
    
    formData.append("brands", values.brands || "");
    formData.append("condition", values.condition);
    formData.append("status", values.status);
    formData.append("quantity", values.quantity);
    formData.append("yearofpurchase", values.yearofpurchase);
    formData.append("mapFrameLink", values.mapLink || "");
    formData.append("tags", values.tags);

    // Address object (backend expects address: {...})
    const addressObj = {
      place: values.place,
      street: values.street,
      city: values.city,
      pincode: values.pincode,
      state: values.state,
      country: values.country,
    };
    formData.append("address", JSON.stringify(addressObj));

    // Seller object
    const sellerObj = {
      name: values.seller_name,
      email: values.seller_email,
      phone: values.seller_phone,
    };
    formData.append("seller", JSON.stringify(sellerObj));

    // Location object (GeoJSON)
    const locationObj = {
      type: "Point",
      coordinates: [Number(values.longitude), Number(values.latitude)],
    };
    formData.append("location", JSON.stringify(locationObj));

    // IMAGES
    values.images?.forEach((file) => {
      formData.append("images", file);
    });

    // Cover Image
    if (values.coverImage && values.coverImage.length > 0) {
      formData.append("coverImage", values.coverImage[0]);
    }

    mutate(formData, {
      onSuccess: () => {
        toast.success("Asset created successfully!");
        form.reset();
        setOpen(false);
      },
      onError: (err) => {
        toast.error(err?.message || "Failed to create asset");
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) form.reset();
      }}
    >
      <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-2xl" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Add New Asset</DialogTitle>
          <DialogDescription>Provide the asset details below.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {/* TITLE */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Asset title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* DESCRIPTION */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Type your message here." />
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
                        disabled={!selectedCategory || !subcategory || subcategory.length === 0}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={
                              !selectedCategory 
                                ? "Select category first" 
                                : !subcategory || subcategory.length === 0 
                                  ? "No subcategories" 
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
                        <Input type="date" {...field} />
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
                          // store as array (zod expects array of File)
                          field.onChange(file ? [file] : []);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                    {coverPreview && (
                      <div className="mt-2 w-48 relative">
                        <img src={coverPreview} alt="cover-preview" className="w-full h-28 object-cover rounded-md border" />
                      </div>
                    )}
                  </FormItem>
                )}
              />

              {/* Images Dropzone (multiple) */}
              <CardContent className="space-y-4 pt-4 px-0 md:px-6">
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => {
                    const handleRemove = (index) => {
                      const newFiles = (field.value || []).filter((_, i) => i !== index);
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
                              // files is an Array<File>
                              const merged = [...(field.value || []), ...files];
                              field.onChange(merged);
                            }}
                          >
                            <DropzoneContent />
                            <DropzoneEmptyState />
                          </Dropzone>
                        </FormControl>
                        <FormMessage />

                        {/* Previews with remove buttons */}
                        {field.value && field.value.length > 0 && (
                          <div className="grid grid-cols-3 gap-2 mt-2">
                            {field.value.map((file, idx) => {
                              const src = URL.createObjectURL(file);
                              return (
                                <div key={idx} className="relative">
                                  <img src={src} alt={`preview-${idx}`} className="w-full h-24 object-cover rounded-md" />
                                  <button
                                    type="button"
                                    onClick={() => handleRemove(idx)}
                                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </FormItem>
                    );
                  }}
                />
              </CardContent>

              {/* Active / Inactive */}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <FormLabel>Active</FormLabel>
                      <p className="text-sm text-muted-foreground">Toggle to activate/deactivate asset</p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>

            {/* FOOTER */}
            <CardFooter className="flex justify-end gap-2 pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>

              <Button type="submit" className="bg-blue-500 hover:bg-blue-600" disabled={isPending}>
                {isPending ? "Submitting..." : "Submit"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAsset;