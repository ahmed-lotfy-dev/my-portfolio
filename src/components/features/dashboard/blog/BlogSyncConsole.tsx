"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import {
  IoSync,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoStar,
  IoPencil,
  IoTrash
} from "react-icons/io5";
import { syncBlogPosts, deleteSinglePosts } from "@/src/app/actions/postsActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/src/lib/auth-client";

interface Post {
  id: string;
  title_en: string;
  slug: string;
  published: boolean;
  featured: boolean;
  source: string | null;
  createdAt: Date;
  lastSyncedAt: Date | null;
}

interface BlogSyncConsoleProps {
  initialPosts: Post[];
}

export default function BlogSyncConsole({ initialPosts }: BlogSyncConsoleProps) {
  const t = useTranslations("dashboard.blog");
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    if (!isAdmin) {
      toast.error("Only admins can sync blog posts");
      return;
    }
    setIsSyncing(true);
    try {
      const result = await syncBlogPosts();
      if (result.success) {
        toast.success(`${result.count} posts synced, ${result.reconciled} reconciled.`);
        window.location.reload();
      }
    } catch (error) {
      console.error("Sync failed:", error);
      toast.error("Failed to sync posts.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleEdit = (postId: string) => {
    if (!isAdmin) {
      toast.error("Only admins can edit blog posts");
      return;
    }
    router.push(`/dashboard/blogs/edit/${postId}`);
  };

  const handleDelete = async (postId: string, postTitle: string) => {
    if (!isAdmin) {
      toast.error("Only admins can delete blog posts");
      return;
    }

    if (!confirm(`Are you sure you want to delete "${postTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const result = await deleteSinglePosts(postId);
      if (result.success) {
        toast.success(result.message);
        setPosts(posts.filter(post => post.id !== postId));
      }
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete post.");
    }
  };

  const publishedCount = posts.filter(p => p.published).length;
  const featuredCount = posts.filter(p => p.featured).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("total_posts")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("table.status")}</CardTitle>
            <IoCheckmarkCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedCount}</div>
            <p className="text-xs text-muted-foreground">Published posts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("table.featured")}</CardTitle>
            <IoStar className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{featuredCount}</div>
            <p className="text-xs text-muted-foreground">Featured posts</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSync}
          disabled={isSyncing || !isAdmin}
          className="gap-2"
        >
          <IoSync className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
          {isSyncing ? t("syncing") : t("sync_button")}
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("table.title")}</TableHead>
              <TableHead>{t("table.source")}</TableHead>
              <TableHead>{t("table.status")}</TableHead>
              <TableHead>{t("table.featured")}</TableHead>
              <TableHead className="text-right">{t("table.date")}</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{post.title_en}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {post.source || "manual"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {post.published ? (
                    <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">
                      Published
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Draft</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {post.featured ? (
                    <div className="flex items-center text-yellow-500">
                      <IoStar className="h-4 w-4 mr-1" />
                      <span className="text-xs">Featured</span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">No</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {new Date(post.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(post.id)}
                      className="h-8 w-8 p-0"
                    >
                      <IoPencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(post.id, post.title_en)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <IoTrash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
