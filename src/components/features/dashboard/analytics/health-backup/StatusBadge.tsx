
import { Badge } from "@/src/components/ui/badge";
import { CheckCircle2, XCircle, Clock, Loader2, AlertCircle } from "lucide-react";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case 'SUCCESS':
      return (
        <Badge className="border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/10">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Success
        </Badge>
      );
    case 'FAILED':
      return (
        <Badge className="border border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/10">
          <XCircle className="w-3 h-3 mr-1" />
          Failed
        </Badge>
      );
    case 'PENDING':
      return (
        <Badge className="border border-primary/20 bg-primary/10 text-primary-light hover:bg-primary/10">
          <Clock className="w-3 h-3 mr-1" />
          Queued
        </Badge>
      );
    case 'RUNNING':
      return (
        <Badge className="animate-pulse border border-primary/20 bg-primary/10 text-primary hover:bg-primary/10">
          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          Processing
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">
          <AlertCircle className="w-3 h-3 mr-1" />
          {status}
        </Badge>
      );
  }
}
