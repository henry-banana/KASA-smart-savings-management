import React from "react";

import { cn } from "./utils";

function Textarea({ className, ...props }) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "resize-none border-input placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 flex min-h-[60px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
