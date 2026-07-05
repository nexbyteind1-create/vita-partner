"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { APPOINTMENT_STATUS_LABEL, type AppointmentStatus } from "@/lib/data/hospital-types";
import type { Doctor } from "@/lib/data/hospital-types";

const STATUSES: AppointmentStatus[] = [
  "scheduled",
  "checked_in",
  "waiting",
  "consultation_started",
  "completed",
  "cancelled",
  "rescheduled",
  "no_show",
];

export function AppointmentsFilterBar({ doctors, departments }: { doctors: Doctor[]; departments: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(debounceRef.current), []);

  function onSearchChange(value: string) {
    setQuery(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateParam("q", value), 300);
  }

  return (
    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative sm:w-64">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search patient, UHID, doctor…" className="pl-8" value={query} onChange={(e) => onSearchChange(e.target.value)} />
      </div>
      <Select defaultValue={searchParams.get("status") ?? "all"} onValueChange={(v) => updateParam("status", v ?? "all")}>
        <SelectTrigger className="sm:w-48">
          <SelectValue placeholder="Status">
            {(value: string) => (value === "all" ? "All statuses" : APPOINTMENT_STATUS_LABEL[value as AppointmentStatus])}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {APPOINTMENT_STATUS_LABEL[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select defaultValue={searchParams.get("doctorId") ?? "all"} onValueChange={(v) => updateParam("doctorId", v ?? "all")}>
        <SelectTrigger className="sm:w-48">
          <SelectValue placeholder="Doctor">
            {(value: string) => (value === "all" ? "All doctors" : doctors.find((d) => d.id === value)?.name)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All doctors</SelectItem>
          {doctors.map((d) => (
            <SelectItem key={d.id} value={d.id}>
              {d.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select defaultValue={searchParams.get("department") ?? "all"} onValueChange={(v) => updateParam("department", v ?? "all")}>
        <SelectTrigger className="sm:w-48">
          <SelectValue placeholder="Department">{(value: string) => (value === "all" ? "All departments" : value)}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All departments</SelectItem>
          {departments.map((d) => (
            <SelectItem key={d} value={d}>
              {d}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
