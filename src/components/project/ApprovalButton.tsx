import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface ApprovalButtonProps {
  onApprove: () => void;
  onReject: () => void;
}

export function ApprovalButton({ onApprove, onReject }: ApprovalButtonProps) {
  return (
    <div className="flex items-center gap-1">
      <Button
        size="sm"
        className="h-6 text-[10px] bg-emerald-700 hover:bg-emerald-800 px-2"
        onClick={(e) => { e.stopPropagation(); onApprove(); }}
      >
        <Check className="w-3 h-3 mr-1" strokeWidth={2} />
        Approve
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="h-6 text-[10px] px-2 text-red-700 border-red-200 hover:bg-red-50"
        onClick={(e) => { e.stopPropagation(); onReject(); }}
      >
        <X className="w-3 h-3" strokeWidth={2} />
      </Button>
    </div>
  );
}
