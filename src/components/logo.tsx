import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/">
      <Image src="/logo.png" alt="INETmedia Logo" width={300} height={100} className={className} priority />
    </Link>
  )
}
