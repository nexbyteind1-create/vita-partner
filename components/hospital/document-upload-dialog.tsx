"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { uploadMedicalDocumentAction } from "@/lib/data/hospital-actions";
import { MEDICAL_DOCUMENT_TYPE_LABEL, type MedicalDocumentType } from "@/lib/data/hospital-types";

const TYPES = Object.keys(MEDICAL_DOCUMENT_TYPE_LABEL) as MedicalDocumentType[];

export function DocumentUploadDialog({
  uhid,
  patientName,
  doctorName,
  department,
}: {
  uhid: string;
  patientName: string;
  doctorName?: string;
  department?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<MedicalDocumentType>("prescription");
  const [fileName, setFileName] = useState("");

  function submit() {
    const title = `${MEDICAL_DOCUMENT_TYPE_LABEL[type]}${fileName ? ` — ${fileName}` : ""}`;
    startTransition(async () => {
      const result = await uploadMedicalDocumentAction({ uhid, patientName, type, title, doctorName, department });
      if (result.success) {
        toast.success(result.message);
        setOpen(false);
        setFileName("");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <Upload className="h-4 w-4" /> Upload Document
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Medical Document</DialogTitle>
          <DialogDescription>For {patientName} ({uhid}). Appears in Vita Vault, Medical Records and the timeline.</DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5">
          <Label>Document Type</Label>
          <Select value={type} onValueChange={(v) => setType(v as MedicalDocumentType)}>
            <SelectTrigger className="w-full">
              <SelectValue>{(value: MedicalDocumentType) => MEDICAL_DOCUMENT_TYPE_LABEL[value]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {MEDICAL_DOCUMENT_TYPE_LABEL[t]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>File (PDF, JPG or PNG)</Label>
          <Input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")} />
          {fileName && <p className="text-xs text-muted-foreground">Selected: {fileName}</p>}
        </div>

        <DialogFooter>
          <Button disabled={isPending} onClick={submit}>
            {isPending ? "Uploading…" : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
