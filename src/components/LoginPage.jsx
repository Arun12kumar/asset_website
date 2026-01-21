"use client";


import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useLogin } from "@/controller/authController";

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const page = () => {

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const router = useRouter();
  const loginMutation = useLogin();

  const onSubmit = async (values) => {
    try {

      const data = await loginMutation.mutateAsync(values);
      
      if (data.success) {
        toast.success("Login successful!"); // show success toast
        router.push("/admin/user");
      } else {
        toast.error(data.message || "Login failed"); // show backend error
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong"); // show network/error
    }
  };


  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Card className="w-[90vw] py-10 sm:w-[50%] md:w-[40%] lg:w-[35%] space-y-5">
        <CardHeader className="w-full text-center">
          <CardTitle className="text-2xl">Login to your account</CardTitle>
          <CardDescription>Enter your email and password below</CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col items-center gap-4">
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardContent className="grid w-full max-w-sm gap-3">
              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isLoading}
              >
                {loginMutation.isLoading ? "Logging in..." : "Login"}
              </Button>
              <Link href="/admin/forgot" className="text-sm text-blue-600">
                Forgot Password ?
              </Link>
            </CardContent>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default page;
