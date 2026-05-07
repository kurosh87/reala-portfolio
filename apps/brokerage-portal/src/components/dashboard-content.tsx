"use client"

import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { useDashboardRole } from "@/components/role-context"
import { BlurFade } from "@/components/ui/blur-fade"

import data from "@/app/dashboard/data.json"

export function DashboardContent() {
  const { role } = useDashboardRole()

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <BlurFade>
            <SectionCards role={role} />
          </BlurFade>
          <BlurFade delay={0.06}>
            <div className="px-4 lg:px-6">
            <ChartAreaInteractive role={role} />
            </div>
          </BlurFade>
          <BlurFade delay={0.12}>
            <DataTable data={data} />
          </BlurFade>
        </div>
      </div>
    </div>
  )
}
