export type LegacySheetFreshness = "fresh" | "recent" | "stale" | "archived" | "unknown"

export type LegacySheetCategory =
  | "primary_ops"
  | "catalog"
  | "print"
  | "sensitive"
  | "testing"

export type LegacySheetColumn = {
  id: string
  label: string
  originalLabel?: string
  index: number
  masked: boolean
}

export type LegacySheetRowPreview = {
  id: string
  rowNumber: number
  cells: Record<string, string>
  masked: boolean
}

export type LegacySheetTab = {
  id: string
  title: string
  gid: number
  rowCount: number
  columnCount: number
  category: LegacySheetCategory
  sensitive: boolean
  primary: boolean
  previewRange: string
  previewPopulatedCells: number
  columns: LegacySheetColumn[]
  previewRows: LegacySheetRowPreview[]
}

export type LegacySheetWorkbook = {
  id: string
  expectedTitle: string
  title: string
  category: LegacySheetCategory
  categoryLabel: string
  bridgeCandidate: boolean
  bridgeUse: string
  sourceConfidence: string
  freshness: LegacySheetFreshness
  modifiedTime: string | null
  ownerDisplayName: string | null
  lastModifyingUserDisplayName: string | null
  webViewLink: string | null
  sensitive: boolean
  tabs: LegacySheetTab[]
}

export type LegacySheetsWorkplaceData = {
  mode: "live" | "sample_fallback"
  sourceLabel: string
  warning: string | null
  generatedAt: string
  workbooks: LegacySheetWorkbook[]
}
