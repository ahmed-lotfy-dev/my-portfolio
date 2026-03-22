// app/not-found.tsx
export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-background text-foreground">
      <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
      <p className="text-muted-foreground">
        The page you are looking for doesn’t exist.
      </p>
    </div>
  )
}
