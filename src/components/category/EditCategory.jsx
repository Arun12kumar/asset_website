
"use client";

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
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useCategoryContext } from "@/context/CategoryProvider";
import { useUpdateCategoryController } from "@/controller/categoryController";
import { useEffect } from "react";
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
  Monitor
} from "lucide-react";

export const iconList = [
  { label: "Electronics", value: "Smartphone", icon: Smartphone },
  { label: "Vehicles", value: "Car", icon: Car },
  { label: "Properties", value: "Home", icon: Home },
  { label: "Home & Furniture", value: "Sofa", icon: Sofa },
  { label: "Fashion", value: "Shirt", icon: Shirt },
  { label: "Pets", value: "PawPrint", icon: PawPrint },
  { label: "Books & Hobbies", value: "Book", icon: Book },
  { label: "Sports & Fitness", value: "Dumbbell", icon: Dumbbell },
  { label: "Jobs", value: "BriefcaseBusiness", icon: BriefcaseBusiness },
  { label: "Food", value: "Utensils", icon: Utensils },
  { label: "Travel", value: "Plane", icon: Plane },
  { label: "Gaming", value: "Gamepad2", icon: Gamepad2 },
  { label: "Accessories", value: "Watch", icon: Watch },
  { label: "Used Mobiles & Laptops", value: "Monitor", icon: Monitor },
];

//  Validation schema
const categorySchema = z.object({
  categoryName: z.string().min(1, "Category name is required"),
  description: z.string().min(1, "Description is required"),
  icon: z.string().min(1, "Please select an icon"),
  isActive: z.boolean().default(true),
});

const EditCategory = () => {
  const { editOpen, setEditOpen,category } = useCategoryContext();
  const { mutate, isPending } = useUpdateCategoryController();

  // React Hook Form setup
  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      categoryName: "",
      description: "",
      icon: "",  
      isActive: true,
    },
    mode: "onChange",
  });

  useEffect(()=>{
    if(category && editOpen){
      form.reset({
        categoryName: category?.categoryName ||"N/A",
        description: category?.description || "N/A",
        icon: category?.icon || "N/A",
        isActive: category?.isActive ?? true,
      })
    }
  },[category,editOpen,form])

  // Submit Handler
  const onSubmit = (values) => {
    mutate({ id: category._id, payload: values }, {
      onSuccess: () => {
        toast.success("Category added successfully!");
        form.reset();
        setEditOpen(false);
      },
      onError: (err) => {
        toast.error(err.message || "Failed to add category");
      },
    });
  };

    const IconSelector = ({ value, onChange }) => {
    return (
      <div className="grid grid-cols-4 gap-4">
        {iconList.map((item) => {
          const Icon = item.icon;
          const selected = value === item.value;
  
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onChange(item.value)}
              className={`p-3 border rounded-lg flex flex-col items-center 
                transition-all ${
                  selected ? "border-blue-600 bg-blue-50" : "border-gray-300"
                }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <Dialog
      open={editOpen}
      onOpenChange={(isOpen) => {
        setEditOpen(isOpen);
        if (!isOpen) form.reset();
      }}
    >
      <DialogContent
        className="max-h-[80dvh] md:max-h-[90dvh] overflow-y-auto sm:max-w-lg"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-start">Edit Category</DialogTitle>
          <DialogDescription className="text-start">
            Fill in the details to edit category.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4 pt-4 px-0 md:px-6">
              {/* Category Name */}
              <FormField
                control={form.control}
                name="categoryName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter category name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


              {/* Icon Selector */}
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Icon</FormLabel>
                    <FormControl>
                      <IconSelector value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* isActive Switch */}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Active Status</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Toggle to activate or deactivate the category
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter className="flex justify-end gap-2 pt-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>

              <Button
                type="submit"
                className="bg-blue-500 hover:bg-blue-500/80"
                disabled={isPending}
              >
                {isPending ? "Submitting..." : "Submit"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategory;
