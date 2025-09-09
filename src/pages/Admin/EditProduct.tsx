/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageIcon, Upload, X } from "lucide-react";

import { teams } from "@/constants/teams";
import {
  useLazyGetProductInfoQuery,
  useUpdateProductMutation,
} from "@/redux/features/Product/product.api";
import ImageShowDeleteDialog from "@/components/modules/Admin/ImageShowDeleteDialog";

const ISize = {
  S: "S",
  M: "M",
  L: "L",
  XL: "XL",
  XXL: "XXL",
} as const;

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  slug: z.string().min(1, "Product slug is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  league: z.string().min(1, "League is required"),
  team: z.string().min(1, "Team is required"),
  price: z.string().min(1, "Price is required"),
  isFeatured: z.boolean(),
  images: z.array(z.string()).optional(),
  deleteImages: z.array(z.string()).optional(),
  variants: z
    .array(
      z.object({
        size: z.string().min(1, "Size is required"),
        stock: z.string().min(1, "Stock is required"),
      })
    )
    .min(1, "At least one variant is required"),
});

type ProductFormValues = z.infer<typeof productSchema>;

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedLeague, setSelectedLeague] = useState<string>("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [getSingleProduct,{ data: responseData, isLoading }] = useLazyGetProductInfoQuery();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const [deleteImages, setDeleteImages] = useState<string[]>([]);

  const product = responseData?.data;
  

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      league: "",
      team: "",
      price: "",
      isFeatured: false,
      variants: [{ size: "S", stock: "" }],
      images: [],
      deleteImages: []
    },
  });

  const control = form.control;

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const watchedName = form.watch("name");
  useEffect(() => {
    if (watchedName) {
      const generatedSlug = generateSlug(watchedName);
      form.setValue("slug", generatedSlug);
    }
  }, [watchedName, form]);

  useEffect(() => {
    if (id) {
      getSingleProduct(id);
    }
  }, [id, getSingleProduct]);

  useEffect(() => {
    if (product) {
      // Set the selected league first to ensure the team dropdown is enabled and populated
      setSelectedLeague(product.league);

      form.reset({
        name: product.name,
        slug: product.slug,
        description: product.description,
        league: product.league,
        team: product.team,
        price: String(product.price),
        isFeatured: product.isFeatured || false,
        variants: product.variants.map((v: { size: any; stock: any; }) => ({
          size: v.size,
          stock: String(v.stock),
        })),
        images: product.images || [],
        deleteImages: [],
      });
    }
  }, [product, form]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const existingImagesCount = (form.getValues("images") || []).length - deleteImages.length;
    if (files.length + selectedImages.length + existingImagesCount > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    setSelectedImages((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const addVariant = () => {
    const current = form.getValues("variants");
    form.setValue("variants", [...current, { size: "S", stock: "" }]);
  };

  const removeVariant = (index: number) => {
    const current = form.getValues("variants");
    if (current.length > 1) {
      form.setValue(
        "variants",
        current.filter((_, i) => i !== index)
      );
    }
  };

  const onSubmit = async (values: ProductFormValues) => {
    const toastId = toast.loading("Updating product....");

    // Correctly determine which images to keep
    const imagesToKeep = (values.images || []).filter(
      (img) => !deleteImages.includes(img)
    );

    const productData = {
      ...values,
      price: Number(values.price),
      variants: values.variants.map((variant) => ({
        size: variant.size,
        stock: Number(variant.stock),
      })),
      images: imagesToKeep, // Send only the images that are not marked for deletion
      deleteImages: deleteImages,
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(productData));
    selectedImages.forEach((image) => formData.append("files", image));

    const payload = {
      userId: id, // Corrected key from userId to id
      body: formData,
    };

    try {
      const res = await updateProduct(payload).unwrap();
      if (res?.success) {
        toast.success("Product updated successfully", { id: toastId });
        navigate("/profile");
      } else {
        toast.error(res?.message || "Something went wrong", { id: toastId });
      }
    } catch (err: any) {
      console.error("Update product error:", err);
      toast.error(
        err?.data?.message || err?.message || "Something went wrong",
        {
          id: toastId,
        }
      );
    }
  };

  const getTeamsForLeague = (league: string) => {
    const leagueData = teams.find((item) => item.league === league);
    return leagueData ? leagueData.teams : [];
  };

  const handleSetDeleteImages = (imgUrl: string) => {
    setDeleteImages((prev) => [...prev, imgUrl]);
  };

  if (isLoading && !product) {
    return <div>Loading product data...</div>;
  }

  return (
    <div className="w-full flex flex-col justify-center items-center my-8">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Edit Product</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...(form as any)}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="name"
                  render={({ field }: any) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="slug"
                  render={({ field }: any) => (
                    <FormItem>
                      <FormLabel>Product Slug</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="product-slug"
                          {...field}
                          onChange={(e) => {
                            const formatted = generateSlug(e.target.value);
                            field.onChange(formatted);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="price"
                  render={({ field }: any) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter price"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={control}
                name="description"
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter product description"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="league"
                  render={({ field }: any) => (
                    <FormItem>
                      <FormLabel>League</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedLeague(value);
                          form.setValue("team", "");
                          
                        }}
                        value={field.value || product?.league}
                        defaultValue={product?.league}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select league" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent defaultValue={product?.league}>
                          {teams.map((league) => (
                            <SelectItem
                              key={league.league}
                              value={league.league}
                            >
                              {league.league}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="team"
                  render={({ field }: any) => (
                    <FormItem>
                      <FormLabel>Team</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || product?.team}
                        defaultValue={product?.team}
                        disabled={!selectedLeague}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                selectedLeague
                                  ? "Select team"
                                  : "Select league first"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent defaultValue={product?.team}>
                          {getTeamsForLeague(selectedLeague).map((team) => (
                            <SelectItem key={team} value={team}>
                              {team}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={control}
                name="isFeatured"
                render={({ field }: any) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Featured Product</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Mark this product as featured
                      </div>
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

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <FormLabel>Product Variants</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addVariant}
                    size="sm"
                  >
                    Add Variant
                  </Button>
                </div>

                {form.watch("variants").map((_: any, index: number) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg"
                  >
                    <FormField
                      control={control}
                      name={`variants.${index}.size` as const}
                      render={({ field }: any) => (
                        <FormItem>
                          <FormLabel>Size</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || product.variants[index].size}
                            defaultValue={product.variants[index].size}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select size" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.values(ISize).map((size) => (
                                <SelectItem key={size} value={size}>
                                  {size}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name={`variants.${index}.stock` as const}
                      render={({ field }: any) => (
                        <FormItem>
                          <FormLabel>Stock</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter stock quantity"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => removeVariant(index)}
                        disabled={form.watch("variants").length === 1}
                        size="sm"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <FormLabel>Product Images (Max 5)</FormLabel>
                <div className="w-full p-6 flex flex-row items-center gap-2 flex-wrap">
                    {form.watch('images')?.filter(img => !deleteImages.includes(img)).map((image:string)=>(
                        <ImageShowDeleteDialog key={image} imgUrl={image} onDelete={() => handleSetDeleteImages(image)} />
                    ))}
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Images
                        </span>
                        <input
                          id="image-upload"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      PNG, JPG, GIF up to 10MB each
                    </p>
                  </div>
                </div>

                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end items-center gap-4">
                <Link to="/admin/products">
                  <Button type="button" variant="ghost" disabled={isUpdating}>
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update Product"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProduct;
