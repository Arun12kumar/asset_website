"use client";

import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { usePostContactController } from "@/controller/contactController";
import { toast } from "sonner";

const contactSchema = z.object({
  email: z.email("Invalid email address"),
  first_name: z.string().min(1,"first name is required"),
  last_name: z.string().min(1,"last name is required"),
  phone: z.string().min(1, "phone number required").max(10, "invalid phone number"),
  comment: z.string().min(5, "comment required").max(100),
  subject: z.string().min(5, "subject required").max(100),
});

const page = () => {
  const ContactMutation = usePostContactController();

  const form = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { email: "", comment: "", phone: "",first_name:"",last_name:"",subject:""},
    mode: "onChange",
  });

  const onSubmit = async (values) => {
    try {
      const data = await ContactMutation.mutateAsync(values);

      if (data.success) {
        toast.success("message sent successful!"); // show success toast
        form.reset();

      } else {
        toast.error(data.message || "message sent failed"); // show backend error
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong"); // show network/error
    }
  };

  return (
    <div className="space-y-8 container mx-auto px-3 py-5 lg:px-15">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-8 md:p-12">
        <div className="max-w-2xl">
          <h1 className="mb-4">Get in Touch</h1>
          <p className="text-xl text-blue-50">
            Have questions or need assistance? We're here to help! Reach out to us and we'll respond as soon as
            possible.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <CardContent className="p-6 md:p-8">
              <Form {...form}>
                <h2 className="mb-6 text-2xl">Send us a Message</h2>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full grid grid-cols-2 items-center gap-4">
                  <div className="w-full">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="Your first name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="w-full">
                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="Your last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-full">
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
                  </div>

                  <div className="w-full">
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
                  </div>
                  <div className="w-full">
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="type your subject" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="w-full cols-span-2">
                    <FormField
                      control={form.control}
                      name="comment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea rows={4} placeholder="Hi, I'm interested..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                    disabled={ContactMutation.isLoading}
                  >
                    <Send className="w-4 h-4 mr-2" />

                    {ContactMutation.isLoading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
                            <h3 className="mb-4">Frequently Asked</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-gray-900 mb-1">How do I list my product?</div>
                  <div className="text-gray-600">Contact us to get access to the admin panel for listing products.</div>
                </div>
                <div>
                  <div className="text-gray-900 mb-1">Is it free to use?</div>
                  <div className="text-gray-600">Yes, browsing and contacting sellers is completely free.</div>
                </div>
                <div>
                  <div className="text-gray-900 mb-1">How do I report a listing?</div>
                  <div className="text-gray-600">
                    Use the contact form above or email us directly with the listing details.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Info Sidebar */}
        <div className="space-y-6">
          {/* Contact Details */}
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Phone</div>
                    <a href="tel:+911234567890" className="text-blue-600 hover:underline">
                      +91 123 456 7890
                    </a>
                    <div className="text-sm text-gray-500 mt-1">Mon-Sat, 9AM-6PM</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Email</div>
                    <a href="mailto:support@marketplace.com" className="text-blue-600 hover:underline">
                      support@marketplace.com
                    </a>
                    <div className="text-sm text-gray-500 mt-1">We'll respond within 24 hours</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Address</div>
                    <div>123 Market Street</div>
                    <div>Mumbai, Maharashtra</div>
                    <div>400001, India</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Business Hours</div>
                    <div>Monday - Friday: 9AM - 6PM</div>
                    <div>Saturday: 10AM - 4PM</div>
                    <div>Sunday: Closed</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Image */}
          <Card className="overflow-hidden" style={{ padding: "0px" }}>
            <Image
              src="https://images.unsplash.com/photo-1553775282-20af80779df7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b21lciUyMHNlcnZpY2V8ZW58MXx8fHwxNzYyNjk0ODkyfDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Customer Service"
              className="w-full h-48 object-cover"
              width={250}
              height={250}
            />
          </Card>


        </div>
      </div>
    </div>
  );
};

export default page;
