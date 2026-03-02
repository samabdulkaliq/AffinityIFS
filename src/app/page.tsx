"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "./lib/store";
import { ShieldCheck, UserCheck } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "./lib/placeholder-images";

export default function LoginPage() {
  const { login } = useAuth();
  const logo = PlaceHolderImages.find(img => img.id === 'brand-logo');

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
      <div className="text-center space-y-4">
        <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-secondary/10 border-4 border-slate-50 overflow-hidden">
          {logo && (
            <Image 
              src={logo.imageUrl} 
              alt={logo.description} 
              width={100} 
              height={100} 
              className="object-cover"
              data-ai-hint={logo.imageHint}
            />
          )}
        </div>
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-primary">Affinity</h1>
          <p className="text-muted-foreground font-medium">Workforce Excellence Platform</p>
        </div>
      </div>

      <Card className="w-full border-none shadow-xl bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl">Welcome Back</CardTitle>
          <CardDescription>Select your role to continue the demo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={() => login('CLEANER')}
            variant="outline" 
            className="w-full h-16 justify-start text-lg px-6 rounded-2xl border-2 hover:bg-secondary/5 hover:border-secondary transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mr-4 group-hover:bg-secondary/20 transition-colors">
              <UserCheck className="w-6 h-6 text-slate-600 group-hover:text-secondary" />
            </div>
            <span>Cleaner Portal</span>
          </Button>

          <Button 
            onClick={() => login('ADMIN')}
            variant="outline" 
            className="w-full h-16 justify-start text-lg px-6 rounded-2xl border-2 hover:bg-primary/5 hover:border-primary transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mr-4 group-hover:bg-primary/20 transition-colors">
              <ShieldCheck className="w-6 h-6 text-slate-600 group-hover:text-primary" />
            </div>
            <span>Admin Control</span>
          </Button>
        </CardContent>
      </Card>

      <div className="text-center text-xs text-muted-foreground pt-8 max-w-[280px]">
        By signing in, you agree to our Terms of Service and Privacy Policy. 🔐
      </div>
    </div>
  );
}
