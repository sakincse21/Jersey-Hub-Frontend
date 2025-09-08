import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { toast } from "sonner";
import { Star } from "lucide-react";

import { useGetProductBySlugQuery } from "@/redux/features/Product/product.api";
import LoadingScreen from "@/components/layout/LoadingScreen";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { IProduct, IVariant } from "@/pages/AllRoles/Collections";
import { useAppDispatch } from "@/redux/hook";
import { addItem } from "@/redux/features/Cart/cart.slice";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const sizeGuideData = [
  { size: "S", chest: "38-40", length: "27-28" },
  { size: "M", chest: "40-42", length: "28-29" },
  { size: "L", chest: "42-44", length: "29-30" },
  { size: "XL", chest: "44-46", length: "30-31" },
  { size: "XXL", chest: "46-48", length: "31-32" },
];

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, isError } = useGetProductBySlugQuery(slug);
  const dispatch = useAppDispatch();

  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedVariant, setSelectedVariant] = useState<IVariant | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const product: IProduct = data?.data;

  useEffect(() => {
    if (product) {
      setSelectedImage(product.images?.[0] || "");
      setSelectedVariant(product.variants?.[0] || null);
    }
  }, [product]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto text-center py-20 flex flex-col items-center gap-5 h-full flex-1">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <p className="text-muted-foreground">
          Sorry, we couldn't find the product you're looking for.
        </p>
        <Link to={"/collections"}>
          <Button>Check All Our Collections</Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error("Please select a size.");
      return;
    }
    if (selectedVariant.stock < 1) {
      toast.error("This size is out of stock.");
      return;
    }
    if (quantity > selectedVariant.stock) {
      toast.error(`Only ${selectedVariant.stock} items are in stock.`);
      return;
    }

    // Dispatch to cart logic here
    dispatch(
      addItem({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        variant: selectedVariant,
        quantity,
      })
    );
  };

  const handleVariantChange = (size: string) => {
    const variant = product.variants.find((v) => v.size === size) || null;
    setSelectedVariant(variant);
    setQuantity(1); // Reset quantity when variant changes
  };

  const stockStatus = selectedVariant ? selectedVariant.stock : 0;

  return (
    <div className="container mx-auto my-12 p-4 md:p-0">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        {/* Left Column: Images */}
        <div className="flex flex-col gap-4">
          <div className="border rounded-lg overflow-hidden">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-auto aspect-square object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(img)}
                className={`border rounded-md overflow-hidden transition-all ${
                  selectedImage === img
                    ? "border-primary ring-2 ring-primary"
                    : "border-transparent"
                }`}
              >
                <img
                  src={img}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className="w-full h-auto aspect-square object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Product Details */}
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-primary">
              {product.league} - {product.team}
            </p>
            <h1 className="text-3xl lg:text-4xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(5.0)</span>
            </div>
          </div>

          <p className="text-3xl font-semibold">${product.price.toFixed(2)}</p>

          <Separator />

          {/* Size Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Size</h3>
            <RadioGroup
              value={selectedVariant?.size}
              onValueChange={handleVariantChange}
              className="flex flex-wrap gap-2"
            >
              {product.variants.map((variant) => (
                <div key={variant.size}>
                  <RadioGroupItem
                    value={variant.size}
                    id={variant.size}
                    className="peer sr-only"
                    disabled={variant.stock === 0}
                  />
                  <Label
                    htmlFor={variant.size}
                    className={`flex items-center justify-center rounded-md border-2 text-sm font-semibold h-10 w-10 cursor-pointer transition-colors 
                    ${
                      variant.stock === 0
                        ? "cursor-not-allowed opacity-50"
                        : "hover:bg-accent"
                    }
                    peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary`}
                  >
                    {variant.size}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <p className="text-sm text-muted-foreground">
              {stockStatus > 0 ? `${stockStatus} in stock` : "Out of stock"}
            </p>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                -
              </Button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity((q) => Math.min(stockStatus, q + 1))}
                disabled={quantity >= stockStatus}
              >
                +
              </Button>
            </div>
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={stockStatus === 0}
            >
              {stockStatus > 0 ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>

          <Separator className="mt-4" />

          {/* Description, Size Guide, Shipping */}
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="item-1"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-semibold">
                Description
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">{product.description}</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-semibold">
                Size Guide
              </AccordionTrigger>
              <AccordionContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Size</TableHead>
                      <TableHead>Chest (inches)</TableHead>
                      <TableHead>Length (inches)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sizeGuideData.map((row) => (
                      <TableRow key={row.size}>
                        <TableCell className="font-medium">
                          {row.size}
                        </TableCell>
                        <TableCell>{row.chest}</TableCell>
                        <TableCell>{row.length}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-semibold">
                Shipping & Returns
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-muted-foreground">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Shipping
                  </h4>
                  <p>
                    After placing an order, you will get a confirmation mail.
                    Orders are typically processed within 1 business days from
                    the date of purchase. Processing times may vary depending on
                    the nature of the product or service. We offer single
                    delivery method which is Pathao Courier.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Return & Replacement Policy
                  </h4>
                  <p>
                    It's a rare case for Jersey Freak BD where customers didn't
                    get their products unharmed. Sometimes we may fail to
                    fulfill your expectations, sometimes situations aren't by
                    our side. There is now a bond of trust between customers and
                    Jersey Freak BD. So, for further ensuring and encouraging
                    this bond of trust jerseyfreakbd.com brings you option to
                    return the products you got (If the product is damaged or
                    designed mistakenly.). In that case Jersey Freak BD will
                    give you fresh products in return. If for any reason you are
                    unsatisfied with your order, you may return it as long as
                    your item meets the following criteria:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>It is within 01 Days from the delivery date.</li>
                    <li>
                      All items to be returned or exchanged must be unused and
                      in their original condition with all original tags and
                      packaging intact and should not be broken or tampered
                      with.
                    </li>
                    <li>
                      If the item came with a free promotional item, the free
                      item must also be returned.
                    </li>
                    <li>
                      Refund/ replacement for products are subject to inspection
                      and checking by JFBD team.
                    </li>
                    <li>
                      Replacement is subject to availability of stock with the
                      Supplier. If the product is out of stock, you will receive
                      a full refund, no questions asked.
                    </li>
                    <li>
                      Please note that the Cash on Delivery convenience charge
                      and the shipping charge would not be included in the
                      refund value of your order as these are non-refundable
                      charges.
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Reasons for returns & replacement
                  </h4>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Product is damaged, defective or not as described.</li>
                    <li>Wrong Size or Mismatch for clothing.</li>
                    <li>Color Mismatch for clothing.</li>
                    <li>Wrong product sent.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    How to return:
                  </h4>
                  <p>
                    Contact JFBD Customer Care team by emailing
                    saleheen.sakin@gmail.com within 02 days after receiving your
                    order.
                  </p>
                  <p className="mt-2">
                    Once we pick up or receive your return, we will do a quality
                    check of the product at our end and if the reason for return
                    is valid, we will replace the product with a new one or we
                    will proceed with the refund.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
