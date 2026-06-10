import React from "react";
import { cn } from "../../lib/utils";
import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react";

const Alert = React.forwardRef(({ className, variant = "default", title, children, ...props }, ref) => {
  const variants = {
    default: "bg-slate-100 text-slate-800 border-slate-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
    success: "bg-green-50 text-green-800 border-green-200",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
    error: "bg-red-50 text-red-800 border-red-200",
  };

  const icons = {
    default: Info,
    info: Info,
    success: CheckCircle2,
    warning: AlertCircle,
    error: XCircle,
  };

  const Icon = icons[variant];

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(
        "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
        variants[variant],
        className
      )}
      {...props}
    >
      <Icon className="h-5 w-5" />
      {title && <h5 className="mb-1 font-medium leading-none tracking-tight">{title}</h5>}
      <div className="text-sm [&_p]:leading-relaxed">{children}</div>
    </div>
  );
});
Alert.displayName = "Alert";

export { Alert };
