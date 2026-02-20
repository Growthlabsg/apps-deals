import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
      <p className="text-muted-foreground mb-6">This page could not be found.</p>
      <Link
        href="/"
        className="rounded-lg gs-gradient text-white px-6 py-3 font-medium hover:opacity-90"
      >
        Back to home
      </Link>
    </div>
  );
}
