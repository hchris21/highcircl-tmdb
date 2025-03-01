import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex items-center justify-center p-6 rounded-lg bg-destructive/10 text-destructive">
      <AlertCircle className="h-5 w-5 mr-2" />
      <p data-testid="error-message">{message}</p>
    </div>
  );
}
