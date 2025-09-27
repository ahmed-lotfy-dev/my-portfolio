// app/not-found.tsx
export default function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
      <p className="text-gray-500">
        The page you are looking for doesn’t exist.
      </p>
    </div>
  )
}
