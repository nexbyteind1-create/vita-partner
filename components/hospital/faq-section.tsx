"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { FAQS, FAQ_CATEGORIES } from "@/lib/mock/hospital-faqs";

export function FaqSection() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQS.filter((f) => {
      const matchesQuery = !q || f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q);
      const matchesCategory = !category || f.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [query, category]);

  return (
    <div>
      <div className="relative mb-3 sm:w-96">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search FAQs…" className="pl-8" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <div className="mb-4 flex flex-wrap gap-1.5">
        <Badge
          variant={category === null ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setCategory(null)}
        >
          All
        </Badge>
        {FAQ_CATEGORIES.map((c) => (
          <Badge
            key={c}
            variant={category === c ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setCategory(c === category ? null : c)}
          >
            {c}
          </Badge>
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">No FAQs match your search.</p>
      ) : (
        <Accordion>
          {filtered.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left text-sm">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
