"use client";

import type { ReactNode } from "react";
import {
  CheckCircle2,
  CircleAlert,
  Info,
  Loader2,
  TriangleAlert,
} from "lucide-react";
import { Toaster } from "sonner";
import { LanguageProvider } from "@/providers/LanguageProvider";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const runtimeToasterProps = { unstyled: true } as Record<string, boolean>;

  return (
    <LanguageProvider>
      {children}
      <Toaster
        {...runtimeToasterProps}
        position="top-right"
        closeButton
        expand
        theme="light"
        mobileOffset={{ right: 14, left: 14 }}
        icons={{
          success: <CheckCircle2 className="h-4 w-4" />,
          info: <Info className="h-4 w-4" />,
          warning: <TriangleAlert className="h-4 w-4" />,
          error: <CircleAlert className="h-4 w-4" />,
          loading: <Loader2 className="h-4 w-4 animate-spin" />,
        }}
        toastOptions={{
          unstyled: true,
          classNames: {
            toast: "toast-root",
            content: "toast-content",
            title: "toast-title",
            description: "toast-description",
            icon: "toast-icon",
            closeButton: "toast-close",
            actionButton: "toast-action",
            cancelButton: "toast-cancel",
            success: "toast-success",
            error: "toast-error",
            info: "toast-info",
            warning: "toast-warning",
            loading: "toast-loading",
            default: "toast-default",
          },
        }}
      />
    </LanguageProvider>
  );
}
