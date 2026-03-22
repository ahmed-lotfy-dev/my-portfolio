
export interface Project {
  id: string;
  title_en: string;
  title_ar: string;
  desc_en: string;
  desc_ar: string;
  slug: string | null;
  content_en: string | null;
  content_ar: string | null;
  repoLink: string;
  liveLink: string;
  embedUrl: string | null;
  featureVideo: string | null;
  coverImage: string | null;
  images: string[] | null;
  categories: string[];
  published: boolean;
  displayOrder: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectFormProps {
  initialData?: Project;
  action: (state: any, formData: FormData) => Promise<any>;
  mode: "create" | "edit";
  user?: {
    id: string;
    role?: string | null;
    [key: string]: any;
  };
}

export interface MultiImageUploadProps {
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  primaryImage: string;
  setPrimaryImage: (url: string) => void;
  imageType: string;
  itemSlug: string;
  itemTitle?: string;
  projectId?: string;
  user?: any;
}
