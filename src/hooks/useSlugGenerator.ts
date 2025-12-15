/**
 * Slug generation hook
 * Provides reusable slug generation logic for forms
 */

import { useState, useCallback, ChangeEvent } from "react";

/**
 * Generate a URL-friendly slug from a string
 */
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface UseSlugGeneratorReturn {
  /** Current slug value */
  slug: string;
  /** Manually set the slug */
  setSlug: (slug: string) => void;
  /** Whether the slug has been manually edited */
  isSlugEdited: boolean;
  /** Handle title change and auto-generate slug if not manually edited */
  handleTitleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  /** Handle manual slug change */
  handleSlugChange: (e: ChangeEvent<HTMLInputElement>) => void;
  /** Force regenerate slug from current title */
  regenerateSlug: (title: string) => void;
  /** Current title value */
  title: string;
}

/**
 * Hook for managing slug generation from a title field
 * 
 * @param initialSlug - Initial slug value
 * @param initialTitle - Initial title value
 * @param isEditMode - Whether in edit mode (disables auto-generation by default)
 * @returns Slug management functions and state
 * 
 * @example
 * ```tsx
 * const { slug, title, handleTitleChange, handleSlugChange, regenerateSlug } = useSlugGenerator(
 *   initialData?.slug,
 *   initialData?.title_en,
 *   mode === "edit"
 * );
 * 
 * return (
 *   <form>
 *     <Input value={title} onChange={handleTitleChange} />
 *     <Input value={slug} onChange={handleSlugChange} />
 *     <Button onClick={() => regenerateSlug(title)}>Regenerate</Button>
 *   </form>
 * );
 * ```
 */
export function useSlugGenerator(
  initialSlug: string = "",
  initialTitle: string = "",
  isEditMode: boolean = false
): UseSlugGeneratorReturn {
  const [title, setTitle] = useState(initialTitle);
  const [slug, setSlug] = useState(initialSlug);
  const [isSlugEdited, setIsSlugEdited] = useState(isEditMode);

  const handleTitleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newTitle = e.target.value;
      setTitle(newTitle);
      
      // Auto-generate slug if user hasn't manually edited it
      if (!isSlugEdited) {
        setSlug(generateSlug(newTitle));
      }
    },
    [isSlugEdited]
  );

  const handleSlugChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
    setIsSlugEdited(true);
  }, []);

  const regenerateSlug = useCallback((currentTitle: string) => {
    setSlug(generateSlug(currentTitle));
    setIsSlugEdited(true);
  }, []);

  return {
    slug,
    setSlug,
    isSlugEdited,
    handleTitleChange,
    handleSlugChange,
    regenerateSlug,
    title,
  };
}

/**
 * Standalone function to generate a slug from text
 * Useful for one-off conversions
 */
export { generateSlug };
