"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Switch } from "@/src/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { updateSinglePosts } from "@/src/app/actions/postsActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface BlogFormProps {
  initialData: {
    id: string;
    title: string;
    content: string;
    category: string;
    tags: string[];
    featured: boolean;
    published: boolean;
    imageLink?: string;
    date: string;
    updated?: string;
  };
  isEdit?: boolean;
}

export default function BlogForm({ initialData, isEdit = false }: BlogFormProps) {
  const t = useTranslations("blogs");
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    content: initialData.content || "",
    category: initialData.category || "",
    tags: initialData.tags.join(", ") || "",
    featured: initialData.featured || false,
    published: initialData.published || false,
    imageLink: initialData.imageLink || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const postToSubmit = {
        ...formData,
        id: initialData.id,
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(Boolean),
      };

      const result = await updateSinglePosts(postToSubmit);
      
      if (result.success) {
        toast.success(result.message);
        router.push("/dashboard/blogs");
      } else {
        toast.error("Failed to update blog post");
      }
    } catch (error) {
      console.error("Submit failed:", error);
      toast.error("Failed to update blog post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">{t("placeholders.title")}</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder={t("placeholders.title")}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              placeholder="e.g. technology, design"
              required
            />
          </div>

          <div>
            <Label htmlFor="tags">{t("placeholders.categories")}</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="e.g. frontend, backend, react"
            />
          </div>

          <div>
            <Label htmlFor="imageLink">Image URL</Label>
            <Input
              id="imageLink"
              value={formData.imageLink}
              onChange={(e) => setFormData(prev => ({ ...prev, imageLink: e.target.value }))}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("post_content")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            placeholder={t("placeholders.content")}
            rows={15}
            required
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Publication Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="featured">Featured Post</Label>
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="published">Published</Label>
            <Switch
              id="published"
              checked={formData.published}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? "Updating..." : "Update Post"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/blogs")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}