"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Plus, 
  Package, 
  Truck, 
  Hammer, 
  Smartphone, 
  MoreVertical, 
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

type AssetStatus = 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE';

interface Asset {
  id: string;
  name: string;
  category: 'EQUIPMENT' | 'VEHICLE' | 'TECH' | 'SUPPLIES';
  status: AssetStatus;
  assignedTo?: string;
  lastChecked: string;
  serialNumber: string;
}

const MOCK_ASSETS: Asset[] = [
  { id: '1', name: 'Industrial Floor Scrubber X1', category: 'EQUIPMENT', status: 'IN_USE', assignedTo: 'Cleaner 5', lastChecked: '2024-03-01', serialNumber: 'EQ-9928-XP' },
  { id: '2', name: 'Service Van - Fleet #04', category: 'VEHICLE', status: 'AVAILABLE', lastChecked: '2024-03-02', serialNumber: 'VAN-TOR-04' },
  { id: '3', name: 'Field iPad Pro - 12.9"', category: 'TECH', status: 'IN_USE', assignedTo: 'Admin User 2', lastChecked: '2024-02-28', serialNumber: 'APL-PAD-112' },
  { id: '4', name: 'HEPA Vacuum - Grade A', category: 'EQUIPMENT', status: 'MAINTENANCE', lastChecked: '2024-02-15', serialNumber: 'EQ-1102-H' },
  { id: '5', name: 'Chemical Inventory - Lot B', category: 'SUPPLIES', status: 'AVAILABLE', lastChecked: '2024-03-03', serialNumber: 'SUP-991-CHEM' },
  { id: '6', name: 'Service Van - Fleet #01', category: 'VEHICLE', status: 'IN_USE', assignedTo: 'Cleaner 1', lastChecked: '2024-03-01', serialNumber: 'VAN-TOR-01' },
];

export default function AdminAssetsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<AssetStatus | 'ALL'>('ALL');

  const filteredAssets = MOCK_ASSETS.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(search.toLowerCase()) || 
                          asset.serialNumber.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'ALL' || asset.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getCategoryIcon = (category: Asset['category']) => {
    switch (category) {
      case 'EQUIPMENT': return <Hammer className="w-4 h-4" />;
      case 'VEHICLE': return <Truck className="w-4 h-4" />;
      case 'TECH': return <Smartphone className="w-4 h-4" />;
      case 'SUPPLIES': return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: AssetStatus) => {
    switch (status) {
      case 'AVAILABLE': return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case 'IN_USE': return "bg-blue-50 text-blue-600 border-blue-100";
      case 'MAINTENANCE': return "bg-amber-50 text-amber-600 border-amber-100";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="px-1 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Assets</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Inventory Management</p>
        </div>
        <Button className="rounded-2xl bg-blue-600 hover:bg-blue-700 h-12 px-6 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-200">
          <Plus className="w-4 h-4 mr-2" /> New Asset
        </Button>
      </div>

      <div className="flex gap-3 px-1">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search by name or S/N..." 
            className="h-14 pl-12 rounded-2xl border-none shadow-sm bg-white font-medium focus-visible:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-14 w-14 rounded-2xl border-none shadow-sm bg-white hover:bg-slate-50">
          <Filter className="w-5 h-5 text-slate-500" />
        </Button>
      </div>

      <div className="flex gap-2 px-1 overflow-x-auto pb-2 scrollbar-hide">
        {(['ALL', 'AVAILABLE', 'IN_USE', 'MAINTENANCE'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2",
              filter === s 
                ? "bg-slate-900 border-slate-900 text-white shadow-lg" 
                : "bg-white border-transparent text-slate-400 hover:bg-slate-50"
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filteredAssets.map((asset) => (
          <Card key={asset.id} className="border-none shadow-sm hover:shadow-md transition-all rounded-[1.5rem] overflow-hidden group">
            <CardContent className="p-0">
              <div className="flex p-5 gap-4">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0",
                  asset.category === 'EQUIPMENT' ? "bg-orange-50 text-orange-500" :
                  asset.category === 'VEHICLE' ? "bg-indigo-50 text-indigo-500" :
                  asset.category === 'TECH' ? "bg-blue-50 text-blue-500" :
                  "bg-green-50 text-green-500"
                )}>
                  {getCategoryIcon(asset.category)}
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                      {asset.name}
                    </h3>
                    <button className="text-slate-300 hover:text-slate-600">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      SN: {asset.serialNumber}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      Last Check: {new Date(asset.lastChecked).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <div className="pt-3 flex items-center justify-between">
                    <Badge variant="outline" className={cn("px-3 py-1 font-black uppercase text-[9px] tracking-widest border-2", getStatusColor(asset.status))}>
                      {asset.status === 'AVAILABLE' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {asset.status === 'IN_USE' && <Clock className="w-3 h-3 mr-1" />}
                      {asset.status === 'MAINTENANCE' && <AlertCircle className="w-3 h-3 mr-1" />}
                      {asset.status.replace('_', ' ')}
                    </Badge>
                    
                    {asset.assignedTo && (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Assigned To:</span>
                        <span className="text-xs font-bold text-slate-700">{asset.assignedTo}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredAssets.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
              <Package className="w-8 h-8 text-slate-200" />
            </div>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">No assets found</p>
          </div>
        )}
      </div>
    </div>
  );
}