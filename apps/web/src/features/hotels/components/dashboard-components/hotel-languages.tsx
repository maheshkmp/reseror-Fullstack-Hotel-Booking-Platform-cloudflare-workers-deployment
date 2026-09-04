"use client";

import { languagesList, LanguageItem } from "@/lib/helpers/languages-map";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useEffect, useState, useMemo } from "react";
import { useSaveRegistry } from "../../context/save-context";
import { useAddHotelLanguages } from "../../queries/use-add-hotel-languages";
import { useGetHotelLanguages } from "../../queries/use-get-hotel-languages";
import { InsertHotelLanguageType, HotelLanguage } from "core/zod";
import { Check, Globe2, Languages } from "lucide-react";

type Props = {
  className?: string;
  hotelId?: string;
};

export function ManageHotelLanguages({ className, hotelId }: Props) {
  const { data, isLoading, error } = useGetHotelLanguages(hotelId);
  const { mutateAsync, isPending } = useAddHotelLanguages(hotelId);
  const { register, unregister } = useSaveRegistry();

  const [selectedLanguageCodes, setSelectedLanguageCodes] = useState<string[]>([]);

  useEffect(() => {
    if (data && !isLoading && !error) {
      setSelectedLanguageCodes(data.map((lang: HotelLanguage) => lang.languageCode));
    }
  }, [data, isLoading, error]);

  const isDirty = useMemo(() => {
    if (!data) return false;
    const initialCodes = data.map((lang: HotelLanguage) => lang.languageCode).sort();
    const currentCodes = [...selectedLanguageCodes].sort();
    return JSON.stringify(initialCodes) !== JSON.stringify(currentCodes);
  }, [selectedLanguageCodes, data]);

  useEffect(() => {
    register({
      id: "hotel-languages",
      isDirty,
      onSave: async () => {
        const preparedLanguages: InsertHotelLanguageType[] = selectedLanguageCodes.map(
          (code) => ({
            hotelId: hotelId || "",
            languageCode: code,
          })
        );
        await mutateAsync(preparedLanguages);
      },
      onReset: () => {
        if (data) {
          setSelectedLanguageCodes(data.map((lang: HotelLanguage) => lang.languageCode));
        }
      },
    });
    return () => unregister("hotel-languages");
  }, [register, unregister, isDirty, selectedLanguageCodes, data, mutateAsync]);

  const toggleLanguage = (code: string) => {
    setSelectedLanguageCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleSaveChanges = () => {
    const preparedLanguages: InsertHotelLanguageType[] = selectedLanguageCodes.map(
      (code) => ({
        hotelId: hotelId || "",
        languageCode: code,
      })
    );

    mutateAsync(preparedLanguages);
  };

  return (
    <Card className={cn("p-0 py-5 rounded-sm shadow-none border border-slate-200", className)}>
      <CardHeader className="px-4 sm:px-6">
        <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-slate-100 text-slate-600">
                <Languages className="w-5 h-5" />
            </div>
            <div>
                <CardTitle className="text-xl leading-tight">Staff Languages</CardTitle>
                <CardDescription className="text-xs">
                  Select the languages spoken by your property's staff to assist guests.
                </CardDescription>
            </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 sm:px-6 mt-4">
        {isLoading && (
          <ScrollArea className="w-full h-[200px] bg-secondary/50 rounded-sm p-4">
            <div className="flex items-center flex-wrap gap-3">
              {Array(10)
                .fill("")
                .map((_, index) => (
                  <Skeleton key={index} className="w-24 h-10 rounded-md" />
                ))}
            </div>
          </ScrollArea>
        )}

        {error && <p className="text-destructive text-sm font-medium">{error.message}</p>}

        {!isLoading && !error && (
          <ScrollArea className="w-full max-h-[300px] rounded-md border border-dashed p-4 bg-secondary/5">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {languagesList.map((lang) => {
                const isSelected = selectedLanguageCodes.includes(lang.code);
                return (
                  <button
                    key={lang.code}
                    onClick={() => toggleLanguage(lang.code)}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border transition-all text-left group",
                      isSelected 
                        ? "bg-primary/5 border-primary ring-1 ring-primary/20" 
                        : "bg-background border-slate-200 hover:border-primary/50 hover:bg-slate-50"
                    )}
                  >
                    <div className="flex flex-col">
                      <span className={cn("text-xs font-bold uppercase tracking-tight", isSelected ? "text-primary" : "text-slate-600 group-hover:text-primary")}>
                        {lang.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium uppercase opacity-70">
                        {lang.nativeName}
                      </span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
