"use client";

import type { Product } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface PromoGeneratorProps {
  products: Product[];
}

export default function PromoGenerator({ products }: PromoGeneratorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Promo Copy Generator</CardTitle>
        <CardDescription>
          Promotional copy is automatically generated or updated when catalog items change.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Product</TableHead>
                <TableHead>AI-Generated Promo Copy</TableHead>
                <TableHead className="text-right w-[100px]">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {product.promoCopy || "No promo copy generated yet."}
                  </TableCell>
                  <TableCell className="text-right">₹{product.price.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
