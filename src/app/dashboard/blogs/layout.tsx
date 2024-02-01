import BlogsAside from "@/src/components/blogs-components/BlogsAside";
import { ReactNode } from "react";

type BlodDashboardLayout = {
  children: ReactNode;
};
export default function Layout({ children }: BlodDashboardLayout) {
  return (
    <div className="w-full flex">
      <BlogsAside />
      {children}
    </div>
  );
}
