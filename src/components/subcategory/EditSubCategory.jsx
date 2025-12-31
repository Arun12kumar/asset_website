
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useGetAllcategory } from "@/controller/categoryController";
import { useUpdateSubCategoryController } from "@/controller/subcategoryController";
import { useSubCategoryContext } from "@/context/SubCategoryProvider";
import { useEffect } from "react";

// ✅ Validation Schema
const subCategorySchema = z.object({
  subCatname: z.string().min(1, "Subcategory name is required"),
  description: z.string().min(1, "Description is required"),
  categoryId: z.string().min(1, "Category is required"),
  isActive: z.boolean().default(true),
});

const EditSubCategory = () => {
  const { editOpen, setEditOpen,subCategory } = useSubCategoryContext();
  const { mutate, isPending } = useUpdateSubCategoryController();
  const { data: categories } = useGetAllcategory();


  // ✅ React Hook Form setup
  const form = useForm({
    resolver: zodResolver(subCategorySchema),
    defaultValues: {
      subCatname: "",
      description: "",
      categoryId: "",
      isActive: true,
    },
    mode: "onChange",
  });

    useEffect(()=>{
      if(subCategory && editOpen){
        form.reset({
          subCatname: subCategory?.subCatname ||"N/A",
          description: subCategory?.description || "N/A",
          categoryId: subCategory?.categoryId?._id || "",
          isActive: subCategory?.isActive ?? true,
        })
      }
    },[subCategory,editOpen,form])

  //  Submit Handler
  const onSubmit = (values) => {
    mutate({ id: subCategory._id, payload: values }, {
      onSuccess: () => {
        toast.success("Subcategory added successfully!");
        form.reset();
        setEditOpen(false);
      },
      onError: (err) => {
        toast.error(err.message || "Failed to add subcategory");
      },
    });
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
          <DialogTitle className="text-start">Add Subcategory</DialogTitle>
          <DialogDescription className="text-start">
            Fill in the details to create a new subcategory.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4 pt-4 px-0 md:px-6">
              {/* ✅ Subcategory Name */}
              <FormField
                control={form.control}
                name="subCatname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subcategory Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter subcategory name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ✅ Select Category */}
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.map((cat) => (
                          <SelectItem key={cat._id} value={cat._id.toString()}>
                            {cat?.categoryName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ✅ Description */}
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

              {/* ✅ isActive Switch */}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Active Status</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Toggle to activate or deactivate the subcategory
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

export default EditSubCategory;
