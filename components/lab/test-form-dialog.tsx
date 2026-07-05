"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { saveTestAction } from "@/lib/data/lab-actions";
import type { Test, TestType } from "@/lib/data/lab-types";

const TEST_TYPES: TestType[] = ["Laboratory", "Diagnostic", "Scan", "Imaging"];

export function TestFormDialog({ test }: { test?: Test }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(test?.name ?? "");
  const [code, setCode] = useState(test?.code ?? "");
  const [category, setCategory] = useState(test?.category ?? "");
  const [type, setType] = useState<TestType>(test?.type ?? "Laboratory");
  const [sampleType, setSampleType] = useState(test?.sampleType ?? "Blood");
  const [description, setDescription] = useState(test?.description ?? "");
  const [testDuration, setTestDuration] = useState(test?.testDuration ?? "10 minutes");
  const [reportDeliveryTime, setReportDeliveryTime] = useState(test?.reportDeliveryTime ?? "24 hours");
  const [mrp, setMrp] = useState(test?.mrp ?? 0);
  const [offerPrice, setOfferPrice] = useState(test?.offerPrice ?? 0);
  const [homeCollectionAvailable, setHomeCollectionAvailable] = useState(test?.homeCollectionAvailable ?? false);
  const [preparationInstructions, setPreparationInstructions] = useState(test?.preparationInstructions ?? "");

  function submit() {
    if (!name || !code || !category) {
      toast.error("Test name, code and category are required.");
      return;
    }
    startTransition(async () => {
      const result = await saveTestAction({
        id: test?.id,
        name,
        code,
        category,
        type,
        description,
        sampleType,
        testDuration,
        reportDeliveryTime,
        mrp: Number(mrp),
        offerPrice: Number(offerPrice),
        homeCollectionAvailable,
        preparationInstructions,
      });
      if (result.success) {
        toast.success(result.message);
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size={test ? "sm" : "default"} variant={test ? "outline" : "default"} />}>
        <Plus className="h-4 w-4" /> {test ? "Edit" : "Add Test"}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{test ? `Edit ${test.name}` : "Add New Test"}</DialogTitle>
          <DialogDescription>Configure test information, pricing and preparation instructions.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 space-y-1.5">
            <Label>Test Name *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Test Code *</Label>
            <Input value={code} onChange={(e) => setCode(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Category *</Label>
            <Input value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Test Type</Label>
            <Select value={type} onValueChange={(v) => setType((v as TestType) ?? "Laboratory")}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TEST_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Sample Type</Label>
            <Input value={sampleType} onChange={(e) => setSampleType(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Test Duration</Label>
            <Input value={testDuration} onChange={(e) => setTestDuration(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Report Delivery Time</Label>
            <Input value={reportDeliveryTime} onChange={(e) => setReportDeliveryTime(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>MRP</Label>
            <Input type="number" value={mrp} onChange={(e) => setMrp(Number(e.target.value))} />
          </div>
          <div className="space-y-1.5">
            <Label>Offer Price</Label>
            <Input type="number" value={offerPrice} onChange={(e) => setOfferPrice(Number(e.target.value))} />
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="homeCollection"
              checked={homeCollectionAvailable}
              onChange={(e) => setHomeCollectionAvailable(e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="homeCollection">Home Collection Available</Label>
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label>Preparation Instructions</Label>
            <Textarea value={preparationInstructions} onChange={(e) => setPreparationInstructions(e.target.value)} rows={2} />
          </div>
        </div>

        <DialogFooter>
          <Button disabled={isPending} onClick={submit}>
            {isPending ? "Saving…" : test ? "Save Changes" : "Add Test"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
