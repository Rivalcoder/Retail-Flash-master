"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Loader2, UploadCloud } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminPanelProps {
  onUpdate: (file: File) => void;
  isPending: boolean;
}

export default function AdminPanel({ onUpdate, isPending }: AdminPanelProps) {
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      if (selectedFile.type === "application/json") {
        setFile(selectedFile);
      } else {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please upload a valid JSON file.",
        });
        event.target.value = ""; // Reset file input
      }
    }
  };

  const handleUpdateClick = () => {
    if (file) {
      onUpdate(file);
    } else {
       toast({
          variant: "destructive",
          title: "No File Selected",
          description: "Please select a JSON file to update the catalog.",
        });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Controls</CardTitle>
        <CardDescription>Simulate a real-time catalog update by uploading a product JSON file.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="catalog-file">Catalog JSON File</Label>
          <Input id="catalog-file" type="file" accept=".json" onChange={handleFileChange} />
        </div>
        <Button onClick={handleUpdateClick} disabled={isPending || !file} className="w-full">
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <UploadCloud className="mr-2 h-4 w-4" />
          )}
          Update Catalog
        </Button>
      </CardContent>
    </Card>
  );
}
