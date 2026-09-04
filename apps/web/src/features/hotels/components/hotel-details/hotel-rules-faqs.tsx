"use client";

import {
  Baby,
  CalendarCheck,
  CalendarClock,
  CreditCard,
  HelpCircle,
  ShieldAlert,
} from "lucide-react";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { paymentMethodsList } from "@/lib/helpers/payment-methods-map";

interface HotelRulesFaqsProps {
  hotel: any;
}

const RuleRow = ({
  icon,
  label,
  value,
  note,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  note?: string;
}) => (
  <div className="flex items-start gap-4 py-4 border-b border-slate-100 last:border-0">
    <div className="shrink-0 mt-0.5 text-slate-400">{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
        {label}
      </p>
      <p className="text-sm font-bold text-slate-900">{value}</p>
      {note && (
        <p className="text-xs text-slate-500 font-medium mt-0.5 leading-relaxed">{note}</p>
      )}
    </div>
  </div>
);

export function HotelRulesFaqs({ hotel }: HotelRulesFaqsProps) {
  const faqs = hotel.faqs || [];
  const paymentMethods = hotel.paymentMethods || [];

  const hasRules =
    hotel.checkInTime ||
    hotel.checkOutTime ||
    hotel.childrenAllowed !== undefined ||
    hotel.extraBedsAvailable !== undefined ||
    hotel.minAge;

  if (!hasRules && paymentMethods.length === 0 && faqs.length === 0) return null;

  return (
    <section id="rules" className="scroll-mt-24 space-y-10">

      {/* ── House Rules & Fine Print ── */}
      {hasRules && (
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-bold text-blue-900">
              House Rules & Fine Print
            </h2>
            <p className="text-[11px] font-bold text-slate-400 mt-1">
              Please review before booking
            </p>
          </div>

          {/* Paragraph / List view — no cards, no shadows */}
          <div className="rounded-2xl border border-slate-100 bg-white px-5 divide-y divide-slate-100">
            {hotel.checkInTime && (
              <RuleRow
                icon={<CalendarClock className="w-4 h-4" />}
                label="Check-in"
                value={`From ${hotel.checkInTime}${hotel.checkInEnd ? ` until ${hotel.checkInEnd}` : ""}`}
                note="Early check-in is subject to availability and may incur additional charges."
              />
            )}

            {hotel.checkOutTime && (
              <RuleRow
                icon={<CalendarClock className="w-4 h-4" />}
                label="Check-out"
                value={`Before ${hotel.checkOutTime}${hotel.checkOutStart ? ` (from ${hotel.checkOutStart})` : ""}`}
                note="Late check-out must be arranged in advance and is subject to availability."
              />
            )}

            {(hotel.childrenAllowed !== undefined || hotel.extraBedsAvailable !== undefined) && (
              <RuleRow
                icon={<Baby className="w-4 h-4" />}
                label="Children & Extra Beds"
                value={hotel.childrenAllowed ? "Children of all ages are welcome." : "Adults-only property."}
                note={
                  hotel.extraBedsAvailable
                    ? `Extra beds available.${hotel.extraBedsPolicy ? ` ${hotel.extraBedsPolicy}` : ""}`
                    : "No extra beds available."
                }
              />
            )}

            {hotel.minAge ? (
              <RuleRow
                icon={<ShieldAlert className="w-4 h-4" />}
                label="Age Restriction"
                value={`Minimum check-in age: ${hotel.minAge}`}
                note="Valid government-issued photo ID is required for each guest."
              />
            ) : null}
          </div>
        </div>
      )}

      {/* ── Payment Methods ── */}
      {paymentMethods.length > 0 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-slate-900">
              Accepted Payment Methods
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
              Secure options available at this property
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            {paymentMethods.map((pm: any, index: number) => {
              const mapping = paymentMethodsList.find((m) => m.id === (pm.cardType || pm.paymentMethodId));
              const Icon = mapping?.icon || CreditCard;
              
              return (
                <div
                  key={index}
                  className="group flex items-center gap-3 pl-2 pr-4 py-2 rounded-2xl border border-slate-100 bg-white hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 cursor-default"
                >
                  <div className="w-12 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center p-1 group-hover:bg-white transition-colors">
                    <Icon className="w-full h-full object-contain" />
                  </div>
                  <span className="text-[11px] font-black text-slate-900 uppercase tracking-wider">
                    {mapping?.label || pm.cardType}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── FAQs ── */}
      {faqs.length > 0 && (
        <div className="space-y-5">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Frequently Asked Questions
          </h2>

          <Accordion type="single" collapsible className="w-full divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden bg-white">
            {faqs.map((faq: any, index: number) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="px-5 border-0"
              >
                <AccordionTrigger className="hover:no-underline py-4 text-left">
                  <span className="text-sm font-bold text-slate-800 pr-4">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-slate-600 font-medium leading-relaxed pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </section>
  );
}
