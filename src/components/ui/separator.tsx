import * as React from "react"
import { Separator } from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

const SeparatorComponent = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentPropsWithoutRef<typeof Separator>
>(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
  <Separator
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(
      "shrink-0 bg-border",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className
    )}
    {...props}
  />
));
SeparatorComponent.displayName = Separator.displayName

export { SeparatorComponent as Separator }
