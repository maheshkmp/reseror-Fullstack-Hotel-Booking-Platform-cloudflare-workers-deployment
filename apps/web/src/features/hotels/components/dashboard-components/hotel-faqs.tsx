"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useEffect, useState, useMemo } from "react";
import { useSaveRegistry } from "../../context/save-context";
import { useAddHotelFaqs, FaqInput } from "../../queries/use-add-hotel-faqs";
import { useGetHotelFaqs } from "../../queries/use-get-hotel-faqs";
import { HelpCircle, Plus, Trash2, GripVertical, MessageSquare } from "lucide-react";

type Props = {
  className?: string;
  hotelId?: string;
};

const DEFAULT_FAQS: FaqInput[] = [
  { question: "What are the check-in and check-out times?", answer: "Check-in is from 2:00 PM, and check-out is until 11:00 AM." },
  { question: "Is parking available at the property?", answer: "Yes, we offer on-site parking for all our guests." },
];

export function ManageHotelFaqs({ className, hotelId }: Props) {
  const { data, isLoading, error } = useGetHotelFaqs(hotelId);
  const { mutateAsync, isPending } = useAddHotelFaqs(hotelId);
  const { register, unregister } = useSaveRegistry();

  const [faqs, setFaqs] = useState<FaqInput[]>([]);

  useEffect(() => {
    if (data && !isLoading && !error) {
      setFaqs(data.length > 0 ? data : DEFAULT_FAQS);
    } else if (!isLoading && !data) {
      setFaqs(DEFAULT_FAQS);
    }
  }, [data, isLoading, error]);

  const addFaq = () => {
    setFaqs([...faqs, { question: "", answer: "", displayOrder: faqs.length }]);
  };

  const removeFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const updateFaq = (index: number, field: keyof FaqInput, value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index] = { ...newFaqs[index], [field]: value };
    setFaqs(newFaqs);
  };

  const isDirty = useMemo(() => {
    const initial = data && data.length > 0 ? data : DEFAULT_FAQS;
    const normalize = (val: string | null | undefined) => (val || "").trim();
    
    // Map initial to exclude IDs if necessary for deep comparison
    const sanitizedInitial = initial.map(f => ({ 
      question: normalize(f.question), 
      answer: normalize(f.answer), 
      displayOrder: f.displayOrder 
    }));
    const sanitizedCurrent = faqs.map(f => ({ 
      question: normalize(f.question), 
      answer: normalize(f.answer), 
      displayOrder: f.displayOrder 
    }));
    return JSON.stringify(sanitizedInitial) !== JSON.stringify(sanitizedCurrent);
  }, [faqs, data]);

  useEffect(() => {
    register({
      id: "hotel-faqs",
      isDirty,
      onSave: async () => {
        const preparedFaqs = faqs.filter(f => f.question.trim() && f.answer.trim());
        await mutateAsync(preparedFaqs);
      },
      onReset: () => {
        if (data) {
          setFaqs(data.length > 0 ? data : DEFAULT_FAQS);
        } else {
          setFaqs(DEFAULT_FAQS);
        }
      },
    });
    return () => unregister("hotel-faqs");
  }, [register, unregister, isDirty, faqs, data, mutateAsync]);

  const handleSaveChanges = () => {
    const preparedFaqs = faqs.filter(f => f.question.trim() && f.answer.trim());
    mutateAsync(preparedFaqs);
  };

  return (
    <Card className={cn("p-0 py-5 rounded-sm shadow-none border border-slate-200", className)}>
      <CardHeader className="px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-slate-100 text-slate-600">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-xl leading-tight">Frequently Asked Questions</CardTitle>
              <CardDescription className="text-xs">
                Provide answers to common guest inquiries to improve their booking experience.
              </CardDescription>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addFaq}
            className="border-dashed border-2 hover:bg-slate-50 transition-all font-bold text-[10px] uppercase tracking-wider h-9 shrink-0"
          >
            <Plus className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Add FAQ</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 px-4 sm:px-6 mt-4">
        {isLoading && <div className="p-10 text-center text-muted-foreground italic">Loading FAQs...</div>}

        {error && <p className="text-destructive font-semibold text-sm">{error.message}</p>}

        {!isLoading && !error && (
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="group relative flex flex-col gap-3 p-5 rounded-xl border bg-background transition-all hover:border-slate-400 hover:shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 text-slate-400">
                     <GripVertical className="w-4 h-4 cursor-grab active:cursor-grabbing" />
                     <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Question {index + 1}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeFaq(index)}
                    className="h-8 w-8 p-0 text-slate-400 hover:text-destructive hover:bg-destructive/5"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="relative">
                    <Input
                      placeholder="Enter the question..."
                      value={faq.question}
                      onChange={(e) => updateFaq(index, "question", e.target.value)}
                      className="pl-9 font-semibold placeholder:font-normal placeholder:text-muted-foreground shadow-none border-slate-200 focus:border-slate-900 transition-all"
                    />
                    <HelpCircle className="absolute left-3 top-2.5 w-4 h-4 text-slate-300" />
                  </div>
                  <div className="relative">
                    <Textarea
                      placeholder="Enter the answer..."
                      value={faq.answer}
                      onChange={(e) => updateFaq(index, "answer", e.target.value)}
                      className="pl-9 min-h-[80px] placeholder:text-muted-foreground shadow-none border-slate-200 focus:border-slate-900 transition-all"
                    />
                    <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-slate-300" />
                  </div>
                </div>
              </div>
            ))}

            {faqs.length === 0 && (
              <div className="p-10 text-center border border-dashed rounded-xl bg-secondary/5">
                <p className="text-sm text-muted-foreground">No FAQs added yet. Click &quot;Add FAQ&quot; to begin.</p>
              </div>
            )}
          </div>
        )}
      </CardContent>

    </Card>
  );
}
