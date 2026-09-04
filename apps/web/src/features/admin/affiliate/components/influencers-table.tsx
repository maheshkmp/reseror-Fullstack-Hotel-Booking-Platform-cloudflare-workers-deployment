"use client";

import { useInfluencers, useCreateInfluencer } from "../hooks/use-affiliate";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, UserPlus } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function InfluencersTable() {
  const { data: influencers, isLoading } = useInfluencers();
  const createMutation = useCreateInfluencer();
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    promoCode: "",
    commissionRate: "10",
    discountRate: "5",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({
        name: formData.name,
        promoCode: formData.promoCode,
        commissionRate: formData.commissionRate,
        discountRate: formData.discountRate,
        isActive: true,
      } as any);
      toast.success("Influencer created successfully");
      setIsOpen(false);
      setFormData({ name: "", promoCode: "", commissionRate: "10", discountRate: "5" });
    } catch (err) {
      toast.error("Failed to create influencer");
    }
  };

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold tracking-tight">Influencers</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus size={16} /> Add Influencer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Influencer</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Influencer Name"
                />
              </div>
              <div className="space-y-2">
                <Label>Promo Code</Label>
                <Input
                  required
                  value={formData.promoCode}
                  onChange={(e) => setFormData({ ...formData, promoCode: e.target.value.toUpperCase() })}
                  placeholder="PROMOCODE"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Commission (%)</Label>
                  <Input
                    type="number"
                    value={formData.commissionRate}
                    onChange={(e) => setFormData({ ...formData, commissionRate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Discount (%)</Label>
                  <Input
                    type="number"
                    value={formData.discountRate}
                    onChange={(e) => setFormData({ ...formData, discountRate: e.target.value })}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create Influencer"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-xl bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50">
              <TableHead className="font-black uppercase text-[10px] tracking-widest">Name</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest">Code</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest text-center">Comm %</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest text-center">Disc %</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest text-center">Usages</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {influencers?.map((inf: any) => (
              <TableRow key={inf.id}>
                <TableCell className="font-bold text-sm">{inf.name}</TableCell>
                <TableCell className="font-mono text-xs font-black">{inf.promoCode}</TableCell>
                <TableCell className="text-center text-sm">{inf.commissionRate}%</TableCell>
                <TableCell className="text-center text-sm">{inf.discountRate}%</TableCell>
                <TableCell className="text-center text-sm">{inf.usageCount || 0}</TableCell>
                <TableCell className="text-right">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tight ${inf.isActive ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-slate-50 text-slate-400 border border-slate-200"}`}>
                    {inf.isActive ? "Active" : "Inactive"}
                  </span>
                </TableCell>
              </TableRow>
            ))}
            {influencers?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-slate-400 text-xs font-bold uppercase tracking-widest">
                  No influencers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
