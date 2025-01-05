import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export function BackButton() {
  return (
    <Link href="/admin">
      <button className="flex items-center gap-2 text-[#2C3E50] hover:text-[#18BC9C] transition-colors mb-6">
        <ArrowLeft size={20} />
        <span>Back to System Settings</span>
      </button>
    </Link>
  );
} 