import Link from "next/link";
import { Sprite } from "@/components/PixelArt";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-28 text-center">
      <Sprite name="gem" size={72} />
      <p className="mt-8 font-pixel text-3xl text-gold">404</p>
      <h1 className="mt-4 text-3xl font-bold text-parchment">This chunk hasn&apos;t been generated</h1>
      <p className="mt-2 text-muted">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className="vc-btn vc-btn-primary mt-8">
        Return home
      </Link>
    </div>
  );
}
