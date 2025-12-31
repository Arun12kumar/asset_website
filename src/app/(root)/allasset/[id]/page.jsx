"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  MessageCircle,
  Shield,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useGetAssetBySlug } from "@/controller/assetController";
import { usePostEnquireController } from "@/controller/enquireController";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const enquireSchema = z.object({
  email: z.email("Invalid email address"),
  phone: z.string().min(1, "phone number required").max(10,"invalid phone number"),
  comment: z.string().min(5, "comment required").max(100),
  name: z.string().min(1, "name is required"),
  assetId: z.string()
});

const Page = () => {
  const { id } = useParams();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const { data: asset, isLoading } = useGetAssetBySlug(id);
  const enquiryMutation = usePostEnquireController();
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(enquireSchema),
    defaultValues: { email: "",comment:"",phone:"",name:"",assetId:"" },
    mode: "onChange",
  });
    useEffect(() => {
  if (asset?._id) {
    form.reset({
      ...form.getValues(),
      assetId: asset._id,   
    });
  }
}, [asset]);

  if (isLoading) {
    return <div className="p-10 text-center text-xl min-h-[30vh]">Loading asset details...</div>;
  }

  if (!asset) {
    return <div className="p-10 text-center text-xl text-red-600">Asset not found.</div>;
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };



  const onSubmit = async (values) => {
    try {
      const data = await enquiryMutation.mutateAsync(values);

      if (data.success) {
        toast.success("message sent successful!"); // show success toast
        form.reset();
        setDialogOpen(false);
      } else {
        toast.error(data.message || "message sent failed"); // show backend error
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong"); // show network/error
    }
  };

  return (
    <div className="container mx-auto px-3 py-5 lg:px-15 space-y-6">
      {/* Back */}
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Listings
      </Button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="relative aspect-[16/8] bg-gray-100 group">
              <Image
                src={asset.images?.[selectedImage]?.url || asset.coverImage?.url || "/placeholder.png"}
                alt={asset.title}
                width={900}
                height={600}
                className="w-full h-full object-cover"
              />

              {/* Left Arrow */}
              {asset.images?.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev === 0 ? asset.images.length - 1 : prev - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  >
                    <ArrowLeft />
                  </button>

                  {/* Right Arrow */}
                  <button
                    onClick={() => setSelectedImage((prev) => (prev === asset.images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  >
                    <ArrowLeft className="rotate-180" />
                  </button>

                  {/* Counter */}
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {selectedImage + 1} / {asset.images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {asset.images?.length > 1 && (
              <div className="p-4 flex gap-2 overflow-x-auto">
                {asset.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-24 h-24 rounded-lg overflow-hidden border-2 ${
                      selectedImage === i ? "border-blue-600 ring-2 ring-blue-200" : "border-gray-200"
                    }`}
                  >
                    <Image src={img.url} width={100} height={100} alt="thumb" className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Asset Details */}
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-xl font-semibold">{asset.title}</h1>

                {asset.tags?.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {asset.tags.map((t, i) => (
                      <Badge key={i} className="bg-yellow-500 text-white">
                        {t}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {asset.address?.city}, {asset.address?.state}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Posted on {formatDate(asset.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Heart />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 />
                </Button>
              </div>
            </div>

            {/* Price */}
            <div className="text-3xl text-blue-600 mb-4">{formatPrice(asset.price)}</div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline">{asset.condition}</Badge>
              <Badge variant="outline">{asset.categoryId?.categoryName}</Badge>
              <Badge variant="outline">{asset.subcategoryId?.subCatname}</Badge>
            </div>

            <Separator className="my-6" />

            <div>
              <h3>Description</h3>
              <p className="text-gray-700 mt-2 whitespace-pre-line">{asset.description}</p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="mb-4">Product Details</h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <InfoBox label="Condition" value={asset.condition} icon={<Shield />} />
              <InfoBox label="Location" value={`${asset.address.city}, ${asset.address.state}`} icon={<MapPin />} />
              <InfoBox label="Posted" value={formatDate(asset.createdAt)} icon={<Clock />} />
              <InfoBox label="Seller" value={asset.seller.name} icon={<User />} />
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Seller Info */}
          <div className="bg-white rounded-lg border p-6 sticky top-24">
            <h3 className="mb-4">Seller Information</h3>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="text-blue-600" />
              </div>
              <div>
                <div>{asset.seller.name}</div>
                <div className="text-sm text-gray-600">Contact available below</div>
              </div>
            </div>

            {/* Show Contact Button */}
            {!showContactForm ? (
              <div className="space-y-3">
                <Button className="w-full bg-blue-600 text-white" onClick={() => setShowContactForm(true)}>
                  <Phone className="w-4 h-4 mr-2" />
                  Show Contact Details
                </Button>

                {/* Send Message */}
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full" onClick={() => setDialogOpen(true)}>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Contact Seller</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">

                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(onSubmit)}
                          className="w-full flex flex-col items-center gap-4"
                        >
                          <CardContent className="grid w-full max-w-sm gap-3">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>name</FormLabel>
                                  <FormControl>
                                    <Input type="text" placeholder="Your name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </CardContent>
                          <CardContent className="grid w-full max-w-sm gap-3">
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input type="email" placeholder="Email" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </CardContent>
                          <CardContent className="grid w-full max-w-sm gap-3">
                            <FormField
                              control={form.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone</FormLabel>
                                  <FormControl>
                                    <Input type="number" placeholder="phone" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </CardContent>
                          <CardContent className="grid w-full max-w-sm gap-3">
                            <FormField
                              control={form.control}
                              name="comment"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Message</FormLabel>
                                  <FormControl>
                                    <Textarea rows={4} placeholder="Hi, I'm interested..." {...field}/>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </CardContent>

                          <CardContent className="grid w-full max-w-sm gap-3">
                            <Button
                              type="submit"
                              className="w-full bg-blue-600 text-white"
                              disabled={enquiryMutation.isLoading}
                            >
                              {enquiryMutation.isLoading ? "Sending..." : "Send Message"}
                            </Button>
                          </CardContent>
                        </form>
                      </Form>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                  <div className="flex items-center gap-2">
                    <Phone />
                    <a href={`tel:${asset.seller.phone}`} className="text-blue-600">
                      {asset.seller.phone}
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail />
                    <a href={`mailto:${asset.seller.email}`} className="text-blue-600">
                      {asset.seller.email}
                    </a>
                  </div>
                </div>

                <Button variant="outline" className="w-full" onClick={() => setShowContactForm(false)}>
                  Hide Contact Details
                </Button>
              </div>
            )}

            <Separator className="my-6" />

            {/* Safety Tips */}
            <h4>Safety Tips</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Meet in a safe, public location</li>
              <li>• Inspect the item before purchase</li>
              <li>• Never pay in advance</li>
              <li>• Check documents for authenticity</li>
            </ul>

            {/* Map */}
            <div className="mt-5">
              <iframe
                src={asset.mapFrameLink}
                width="100%"
                height="200"
                style={{ border: "0" }}
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable info card
const InfoBox = ({ label, value, icon }) => (
  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
    <div className="text-blue-600">{icon}</div>
    <div>
      <div className="text-sm text-gray-600">{label}</div>
      <div className="capitalize">{value}</div>
    </div>
  </div>
);

export default Page;
