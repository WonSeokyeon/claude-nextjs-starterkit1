import type React from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card className={className}>
      <CardHeader className="text-center">
        {icon && <div className="mb-4 flex justify-center text-4xl">{icon}</div>}
        <CardTitle>{title}</CardTitle>
        <CardDescription className="mt-2">{description}</CardDescription>
        {action && <div className="mt-4">{action}</div>}
      </CardHeader>
    </Card>
  )
}
