import { Card } from "@/components/ui/card";
import { XIcon, ShieldAlert, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = { error?: any };

export default function DataTableError({ error }: Props) {
  const isUnauthorized = 
    error?.status === 401 || 
    error?.status === 403 || 
    error?.message?.toLowerCase().includes("unauthorized") || 
    error?.message?.toLowerCase().includes("forbidden");

  if (isUnauthorized) {
    return (
      <Card className="flex flex-1 flex-col items-center justify-center h-[400px] p-8 bg-gradient-to-b from-white to-slate-50/50 border-slate-200">
        <div className="relative">
          <div className="absolute inset-0 bg-red-100 rounded-full blur-2xl opacity-50 scale-150 animate-pulse" />
          <div className="relative p-5 rounded-full bg-red-50 border-4 border-white shadow-xl">
            <ShieldAlert className="size-12 text-red-500" />
          </div>
        </div>

        <h3 className="mt-8 text-2xl font-black text-slate-900 tracking-tight">
          Access Restricted
        </h3>
        <p className="mt-2 text-slate-500 text-center max-w-[280px] text-sm font-medium leading-relaxed">
          You don't have the required permissions to view this information. Please contact your administrator.
        </p>

        <div className="mt-8 flex items-center gap-3">
          <Button variant="outline" className="h-10 px-6 rounded-full border-slate-200 bg-white shadow-sm hover:bg-slate-50 font-bold text-xs uppercase tracking-widest transition-all active:scale-95" asChild>
            <Link href="/account">
              <Home className="mr-2 size-3.5" />
              Go Home
            </Link>
          </Button>
          <Button 
            variant="default" 
            className="h-10 px-6 rounded-full bg-slate-900 shadow-lg shadow-slate-200 hover:bg-slate-800 font-bold text-xs uppercase tracking-widest transition-all active:scale-95"
            onClick={() => window.location.reload()}
          >
            <RotateCcw className="mr-2 size-3.5" />
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex flex-1 flex-col items-center justify-center h-[400px] p-8 border-dashed border-2 bg-slate-50/20">
      <div className="p-4 rounded-full bg-red-100/50">
        <XIcon className="size-8 text-red-500/80" />
      </div>

      <p className="mt-6 text-xl text-slate-900 font-black tracking-tight">
        Something Went Wrong
      </p>
      <p className="mt-2 text-slate-500 font-medium text-sm">
        {error ? error?.message : "An unexpected error occurred while fetching data."}
      </p>
      
      <Button 
        variant="ghost" 
        className="mt-6 text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-widest"
        onClick={() => window.location.reload()}
      >
        <RotateCcw className="mr-2 size-3.5" />
        Reload Page
      </Button>
    </Card>
  );
}
