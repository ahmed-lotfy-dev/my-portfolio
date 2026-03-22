"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { authClient } from "@/src/lib/auth-client";
import { m } from "motion/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { toast } from "sonner";
import { Loader2, Camera, Mail, User, ShieldCheck } from "lucide-react";
import { Separator } from "@/src/components/ui/separator";

export default function ProfileForm() {
  const t = useTranslations("dashboard.profile");
  const { data: session, isPending: isSessionLoading } = authClient.useSession();
  const user = session?.user;
  
  const [name, setName] = useState(user?.name || "");
  const [image, setImage] = useState(user?.image || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      // @ts-ignore - Better Auth types can be tricky in some environments but this is the valid API for v1.x
      await authClient.user.update({
        name: name,
        image: image,
      });
      toast.success(t("success_msg"));
    } catch (error) {
      console.error(error);
      toast.error(t("error_msg"));
    } finally {
      setIsUpdating(false);
    }
  };

  const defaultAvatar = `https://api.dicebear.com/7.x/thumbs/svg?seed=${user?.email || "guest"}&radius=50&backgroundType=gradientLinear&shapeColor=%23CBD5E1&mouth=smile`;

  if (isSessionLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto"
    >
      <Card className="border-border bg-card/50 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
        {/* Premium Gold Accents */}
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary/40 to-transparent" />
        
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-br from-foreground to-foreground/70">
                {t("title")}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {t("subtitle")}
              </CardDescription>
            </div>
            {user?.role === "ADMIN" && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-8 pt-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center sm:flex-row gap-8">
            <div className="relative group/avatar">
              <Avatar className="h-32 w-32 ring-4 ring-primary/10 ring-offset-4 ring-offset-background transition-transform duration-500 group-hover/avatar:scale-105">
                <AvatarImage src={image || user?.image || defaultAvatar} alt={user?.name || "User"} className="object-cover" />
                <AvatarFallback className="bg-muted text-3xl">{user?.name?.[0]}</AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer">
                <Camera className="text-white h-8 w-8" />
              </div>
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="avatar-url" className="text-sm font-semibold flex items-center gap-2">
                  <Camera className="w-4 h-4 text-primary" />
                  {t("avatar_label")}
                </Label>
                <Input 
                  id="avatar-url"
                  placeholder="https://example.com/image.jpg"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="bg-background/50 border-primary/10 focus-visible:ring-primary/30"
                />
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                  Enter an image URL for your profile picture
                </p>
              </div>
            </div>
          </div>

          <Separator className="bg-primary/10" />

          {/* Form Fields */}
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  {t("name_label")}
                </Label>
                <Input 
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-background/50 border-primary/10 focus-visible:ring-primary/30 h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  {t("email_label")}
                </Label>
                <Input 
                  id="email"
                  value={user?.email || ""}
                  disabled
                  className="bg-muted/50 border-transparent cursor-not-allowed h-11 opacity-70"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                disabled={isUpdating}
                className="h-11 px-8 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  t("update_button")
                )}
              </Button>
            </div>
          </form>
        </CardContent>

        <CardFooter className="bg-muted/30 border-t border-border mt-4 py-4 px-8">
          <p className="text-xs text-muted-foreground">
            Account created at {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
          </p>
        </CardFooter>
      </Card>
    </m.div>
  );
}
