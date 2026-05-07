import "server-only"

import crypto from "node:crypto"
import { readFileSync } from "node:fs"

import type {
  LegacySheetCategory,
  LegacySheetColumn,
  LegacySheetFreshness,
  LegacySheetRowPreview,
  LegacySheetTab,
  LegacySheetWorkbook,
  LegacySheetsWorkplaceData,
} from "@/lib/legacy-sheets"

type WorkbookRegistryEntry = {
  id: string
  expectedTitle: string
  category: LegacySheetCategory
  categoryLabel: string
  bridgeCandidate: boolean
  bridgeUse: string
  sourceConfidence: string
  sensitive?: boolean
  archived?: boolean
  tabCategories?: Record<string, LegacySheetCategory>
  primaryTabs?: string[]
  previewRanges?: Record<string, string>
}

type GoogleServiceAccount = {
  client_email: string
  private_key: string
}

type GoogleDriveFile = {
  id: string
  name?: string
  modifiedTime?: string
  webViewLink?: string
  owners?: Array<{ displayName?: string }>
  lastModifyingUser?: { displayName?: string }
}

type GoogleSheetMetadata = {
  properties?: { title?: string }
  sheets?: Array<{
    properties: {
      sheetId: number
      title: string
      gridProperties?: {
        rowCount?: number
        columnCount?: number
      }
    }
  }>
}

const DEFAULT_PREVIEW_RANGE = "A1:Z40"
const SENSITIVE_PATTERN = /password|passcode|token|secret|key|auth|credential/i
const EMAIL_PATTERN = /email|e-mail/i

const workbookRegistry: WorkbookRegistryEntry[] = [
  {
    id: "1l9nXipLIBTzl8L4ZkTTbS_NCp2_oAljqJt1SboQBbkg",
    expectedTitle: "Daily drafting jobs",
    category: "primary_ops",
    categoryLabel: "Daily operations",
    bridgeCandidate: true,
    bridgeUse: "Primary Daily Drafting mirror for TimeTap, drafting status, staff assignment, and job calendar parity.",
    sourceConfidence: "Live cron and Scheduler references",
    primaryTabs: ["Daily Drafting"],
    previewRanges: {
      "Daily Drafting": "AC1:AS60",
    },
  },
  {
    id: "10xkF7InXzR8jNdBP4d1QP_zZe0V0VHcGuPISP2hf2X0",
    expectedTitle: "Upload services/groups",
    category: "catalog",
    categoryLabel: "Service catalog",
    bridgeCandidate: true,
    bridgeUse: "Service, reason, price, and package catalog parity for future product bridge previews.",
    sourceConfidence: "Fresh Drive metadata and Scheduler UploadServices references",
  },
  {
    id: "1zH5S795VVtxNsFzgffWi1_H9YoH2h9B5DUBU0xl4W98",
    expectedTitle: "Printed Materials",
    category: "print",
    categoryLabel: "Print workflow",
    bridgeCandidate: true,
    bridgeUse: "Print order/materials mirror for feature-sheet and print-shop parity.",
    sourceConfidence: "Scheduler deliverables and print route references",
  },
  {
    id: "16D5kd4E4cV-geXbjY9HSyL4j1FBsW5i5wvWq0xJG3xw",
    expectedTitle: "Master Sheet Delivery Page",
    category: "sensitive",
    categoryLabel: "Sensitive admin",
    bridgeCandidate: false,
    bridgeUse: "Admin support reference only; secrets and account-support rows stay masked.",
    sourceConfidence: "Scheduler folder/account helper references",
    sensitive: true,
  },
  {
    id: "1GjokVnCB2Vp0-56CQslmstmPdSzqM0L1oBH2dBCO7UM",
    expectedTitle: "Copy of Daily drafting jobs for TESTING",
    category: "testing",
    categoryLabel: "Archived/testing",
    bridgeCandidate: false,
    bridgeUse: "Testing copy for layout archaeology; not a production bridge source.",
    sourceConfidence: "Commented legacy references only",
    archived: true,
    primaryTabs: ["Daily Drafting (new layout - use this one)"],
  },
]

const fallbackTabMetadata: Record<
  string,
  Array<{ title: string; gid: number; rows: number; cols: number }>
> = {
  "1l9nXipLIBTzl8L4ZkTTbS_NCp2_oAljqJt1SboQBbkg": [
    { title: "Daily Drafting", gid: 523487603, rows: 606, cols: 80 },
    { title: "Admin ", gid: 1354918906, rows: 1010, cols: 81 },
    { title: "Proposed new sheet", gid: 408037667, rows: 1001, cols: 38 },
    { title: "MAURA TO DO", gid: 1279939184, rows: 1000, cols: 26 },
    { title: "Jennifer Clancey", gid: 2108492247, rows: 1000, cols: 26 },
    { title: "Videos", gid: 1272403760, rows: 1004, cols: 26 },
    { title: "FUNCTIONS", gid: 1884480779, rows: 1022, cols: 26 },
    { title: "Instructions", gid: 1119196670, rows: 1000, cols: 26 },
    { title: "Issues", gid: 729768644, rows: 1009, cols: 26 },
    { title: "Daily Drafted Moved - ** Don't delete **", gid: 1880191556, rows: 3540, cols: 83 },
  ],
  "10xkF7InXzR8jNdBP4d1QP_zZe0V0VHcGuPISP2hf2X0": [
    { title: "Services", gid: 815567056, rows: 326, cols: 28 },
    { title: "NEW SETUP", gid: 329696125, rows: 1000, cols: 26 },
    { title: "Reasons", gid: 506739101, rows: 56, cols: 18 },
    { title: "Super reason groups", gid: 1339626470, rows: 1000, cols: 26 },
    { title: "Prices", gid: 1057511825, rows: 1052, cols: 30 },
    { title: "Packages", gid: 1517730751, rows: 1002, cols: 33 },
  ],
  "1zH5S795VVtxNsFzgffWi1_H9YoH2h9B5DUBU0xl4W98": [
    { title: "Sheet1", gid: 0, rows: 1004, cols: 27 },
    { title: "Sheet3", gid: 775405853, rows: 997, cols: 26 },
  ],
  "16D5kd4E4cV-geXbjY9HSyL4j1FBsW5i5wvWq0xJG3xw": [
    { title: "Scripts", gid: 2122656910, rows: 1000, cols: 26 },
    { title: "Passwords", gid: 843527506, rows: 1000, cols: 26 },
    { title: "Agent Passwords", gid: 249824706, rows: 998, cols: 26 },
    { title: "Assistants", gid: 1957989237, rows: 997, cols: 26 },
    { title: "Photographers", gid: 1150786687, rows: 999, cols: 26 },
    { title: "Clients to email", gid: 1288966856, rows: 1002, cols: 26 },
  ],
  "1GjokVnCB2Vp0-56CQslmstmPdSzqM0L1oBH2dBCO7UM": [
    { title: "Daily Drafting (new layout - use this one)", gid: 523487603, rows: 4475, cols: 51 },
    { title: "Daily Drafted Moved", gid: 1880191556, rows: 1781, cols: 51 },
  ],
}

const fallbackModifiedTimes: Record<string, string> = {
  "1l9nXipLIBTzl8L4ZkTTbS_NCp2_oAljqJt1SboQBbkg": "2026-03-14T15:55:35.391Z",
  "10xkF7InXzR8jNdBP4d1QP_zZe0V0VHcGuPISP2hf2X0": "2026-03-24T22:13:02.679Z",
  "1zH5S795VVtxNsFzgffWi1_H9YoH2h9B5DUBU0xl4W98": "2025-01-28T20:54:11.335Z",
  "16D5kd4E4cV-geXbjY9HSyL4j1FBsW5i5wvWq0xJG3xw": "2024-01-12T01:54:16.808Z",
  "1GjokVnCB2Vp0-56CQslmstmPdSzqM0L1oBH2dBCO7UM": "2023-02-25T12:12:08.375Z",
}

export async function getLegacySheetsWorkplace(): Promise<LegacySheetsWorkplaceData> {
  const serviceAccount = readServiceAccount()

  if (!serviceAccount) {
    return buildFallbackWorkplaceData(
      "Google Sheets credentials are not configured. Showing audited workbook metadata and safe sample previews."
    )
  }

  try {
    const accessToken = await getAccessToken(serviceAccount)
    const workbooks = await Promise.all(
      workbookRegistry.map((entry) => fetchWorkbook(entry, accessToken))
    )

    return {
      mode: "live",
      sourceLabel: "Live Google Drive and Sheets read-only mirror",
      warning: null,
      generatedAt: new Date().toISOString(),
      workbooks,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Google Sheets error"

    return buildFallbackWorkplaceData(
      `Live Google Sheets read failed. Showing audited fallback metadata. ${message}`
    )
  }
}

function buildFallbackWorkplaceData(warning: string): LegacySheetsWorkplaceData {
  return {
    mode: "sample_fallback",
    sourceLabel: "Audited fallback metadata",
    warning,
    generatedAt: new Date().toISOString(),
    workbooks: workbookRegistry.map((entry) =>
      buildWorkbook({
        entry,
        drive: {
          id: entry.id,
          name: entry.expectedTitle,
          modifiedTime: fallbackModifiedTimes[entry.id],
          webViewLink: `https://docs.google.com/spreadsheets/d/${entry.id}/edit`,
        },
        sheetMetadata: {
          properties: { title: entry.expectedTitle },
          sheets: (fallbackTabMetadata[entry.id] ?? []).map((tab) => ({
            properties: {
              sheetId: tab.gid,
              title: tab.title,
              gridProperties: { rowCount: tab.rows, columnCount: tab.cols },
            },
          })),
        },
        previewValuesByTitle: new Map(
          (fallbackTabMetadata[entry.id] ?? []).map((tab) => [
            tab.title,
            buildFallbackPreview(entry, tab.title),
          ])
        ),
      })
    ),
  }
}

async function fetchWorkbook(
  entry: WorkbookRegistryEntry,
  accessToken: string
): Promise<LegacySheetWorkbook> {
  const drive = await getJson<GoogleDriveFile>(
    `https://www.googleapis.com/drive/v3/files/${entry.id}?fields=id,name,modifiedTime,webViewLink,owners(displayName),lastModifyingUser(displayName)`,
    accessToken
  )
  const sheetMetadata = await getJson<GoogleSheetMetadata>(
    `https://sheets.googleapis.com/v4/spreadsheets/${entry.id}?fields=properties(title),sheets(properties(sheetId,title,gridProperties(rowCount,columnCount)))`,
    accessToken
  )
  const previewValuesByTitle = new Map<string, string[][]>()

  await Promise.all(
    (sheetMetadata.sheets ?? []).map(async (sheet) => {
      const title = sheet.properties.title
      const range = getPreviewRange(entry, title)
      const values = await getJson<{ values?: string[][] }>(
        `https://sheets.googleapis.com/v4/spreadsheets/${entry.id}/values/${encodeURIComponent(
          quoteSheetRange(title, range)
        )}?majorDimension=ROWS`,
        accessToken
      )
      previewValuesByTitle.set(title, values.values ?? [])
    })
  )

  return buildWorkbook({ entry, drive, sheetMetadata, previewValuesByTitle })
}

function buildWorkbook(input: {
  entry: WorkbookRegistryEntry
  drive: GoogleDriveFile
  sheetMetadata: GoogleSheetMetadata
  previewValuesByTitle: Map<string, string[][]>
}): LegacySheetWorkbook {
  const { entry, drive, sheetMetadata, previewValuesByTitle } = input
  const modifiedTime = drive.modifiedTime ?? fallbackModifiedTimes[entry.id] ?? null
  const tabs = (sheetMetadata.sheets ?? []).map((sheet) => {
    const title = sheet.properties.title
    const previewValues = previewValuesByTitle.get(title) ?? []

    return buildTab({
      entry,
      title,
      gid: sheet.properties.sheetId,
      rowCount: sheet.properties.gridProperties?.rowCount ?? 0,
      columnCount: sheet.properties.gridProperties?.columnCount ?? 0,
      previewValues,
    })
  })

  return {
    id: entry.id,
    expectedTitle: entry.expectedTitle,
    title: drive.name ?? sheetMetadata.properties?.title ?? entry.expectedTitle,
    category: entry.category,
    categoryLabel: entry.categoryLabel,
    bridgeCandidate: entry.bridgeCandidate,
    bridgeUse: entry.bridgeUse,
    sourceConfidence: entry.sourceConfidence,
    freshness: getFreshness(modifiedTime, entry.archived),
    modifiedTime,
    ownerDisplayName: drive.owners?.[0]?.displayName ?? null,
    lastModifyingUserDisplayName: drive.lastModifyingUser?.displayName ?? null,
    webViewLink: drive.webViewLink ?? `https://docs.google.com/spreadsheets/d/${entry.id}/edit`,
    sensitive: Boolean(entry.sensitive),
    tabs,
  }
}

function buildTab(input: {
  entry: WorkbookRegistryEntry
  title: string
  gid: number
  rowCount: number
  columnCount: number
  previewValues: string[][]
}): LegacySheetTab {
  const { entry, title, gid, rowCount, columnCount, previewValues } = input
  const sensitive = Boolean(entry.sensitive) || isSensitiveName(title)
  const previewRange = getPreviewRange(entry, title)
  const width = Math.max(
    1,
    Math.min(
      26,
      previewValues.reduce((max, row) => Math.max(max, row.length), 0) || columnCount || 1
    )
  )
  const headerRow = previewValues[0] ?? []
  const columns: LegacySheetColumn[] = Array.from({ length: width }, (_, index) => {
    const rawLabel = String(headerRow[index] ?? "").trim()
    const masked = sensitive || isSensitiveName(rawLabel) || EMAIL_PATTERN.test(rawLabel)

    return {
      id: columnName(index),
      label: masked ? "Masked field" : rawLabel || columnName(index),
      originalLabel: masked ? undefined : rawLabel || undefined,
      index,
      masked,
    }
  })
  const previewRows: LegacySheetRowPreview[] = previewValues
    .slice(1, 31)
    .map((row, rowIndex) => ({
      id: `${gid}-${rowIndex + 2}`,
      rowNumber: rowIndex + 2,
      masked: sensitive,
      cells: Object.fromEntries(
        columns.map((column) => {
          const rawValue = String(row[column.index] ?? "").trim()
          const value = rawValue ? maskValue(rawValue, sensitive || column.masked) : ""
          return [column.id, value]
        })
      ),
    }))

  return {
    id: `${entry.id}:${gid}`,
    title,
    gid,
    rowCount,
    columnCount,
    category: entry.tabCategories?.[title] ?? entry.category,
    sensitive,
    primary: entry.primaryTabs?.includes(title) ?? false,
    previewRange,
    previewPopulatedCells: countPopulatedCells(previewValues),
    columns,
    previewRows,
  }
}

function buildFallbackPreview(entry: WorkbookRegistryEntry, tabTitle: string) {
  if (entry.sensitive || isSensitiveName(tabTitle)) {
    return [
      ["Record", "Sensitive field", "Status"],
      ["Example row", "masked", "Visible as masked metadata only"],
    ]
  }

  if (tabTitle === "Daily Drafting") {
    return [
      ["Field Tech", "Priority", "Client", "Realtor", "Unit", "Address", "Product", "Additional Services", "Appointment ID", "Upload"],
      ["Sample field tech", "Normal", "Reala Client", "Sample realtor", "Unit", "Sample address", "Floor Plan", "Photos, Matterport", "TT-sample", ""],
    ]
  }

  return [
    ["Name", "Category", "Status", "Bridge posture"],
    [tabTitle, entry.categoryLabel, "Audited fallback", "Read-only"],
  ]
}

function readServiceAccount(): GoogleServiceAccount | null {
  const rawJson = process.env.GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON
  const path = process.env.GOOGLE_SHEETS_SERVICE_ACCOUNT_PATH

  try {
    const raw = rawJson || (path ? readFileSync(path, "utf8") : null)
    if (!raw) return null

    const parsed = JSON.parse(raw) as GoogleServiceAccount
    if (!parsed.client_email || !parsed.private_key) return null

    return {
      client_email: parsed.client_email,
      private_key: parsed.private_key.replace(/\\n/g, "\n"),
    }
  } catch {
    return null
  }
}

async function getAccessToken(serviceAccount: GoogleServiceAccount) {
  const now = Math.floor(Date.now() / 1000)
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }))
  const claim = base64Url(
    JSON.stringify({
      iss: serviceAccount.client_email,
      scope:
        "https://www.googleapis.com/auth/spreadsheets.readonly https://www.googleapis.com/auth/drive.metadata.readonly",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    })
  )
  const input = `${header}.${claim}`
  const signature = crypto
    .createSign("RSA-SHA256")
    .update(input)
    .sign(serviceAccount.private_key, "base64")
  const jwt = `${input}.${toBase64Url(signature)}`
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  })

  if (!response.ok) {
    throw new Error(`Google auth failed with ${response.status}`)
  }

  const body = (await response.json()) as { access_token?: string }
  if (!body.access_token) throw new Error("Google auth did not return an access token")

  return body.access_token
}

async function getJson<T>(url: string, accessToken: string): Promise<T> {
  const response = await fetch(url, {
    headers: { authorization: `Bearer ${accessToken}` },
    next: { revalidate: 300 },
  })

  if (!response.ok) {
    throw new Error(`Google API request failed with ${response.status}`)
  }

  return (await response.json()) as T
}

function base64Url(value: string) {
  return toBase64Url(Buffer.from(value).toString("base64"))
}

function toBase64Url(value: string) {
  return value.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
}

function quoteSheetRange(title: string, range: string) {
  return `'${title.replaceAll("'", "''")}'!${range}`
}

function getPreviewRange(entry: WorkbookRegistryEntry, title: string) {
  return entry.previewRanges?.[title] ?? DEFAULT_PREVIEW_RANGE
}

function getFreshness(
  modifiedTime: string | null,
  archived?: boolean
): LegacySheetFreshness {
  if (archived) return "archived"
  if (!modifiedTime) return "unknown"

  const ageMs = Date.now() - new Date(modifiedTime).getTime()
  const ageDays = ageMs / 86_400_000

  if (ageDays <= 90) return "fresh"
  if (ageDays <= 365) return "recent"
  return "stale"
}

function isSensitiveName(value: string) {
  return SENSITIVE_PATTERN.test(value)
}

function maskValue(value: string, masked: boolean) {
  if (!masked) return value
  if (!value) return ""
  return "Masked"
}

function countPopulatedCells(values: string[][]) {
  return values.reduce(
    (count, row) =>
      count + row.filter((value) => String(value ?? "").trim() !== "").length,
    0
  )
}

function columnName(index: number) {
  let value = ""
  let cursor = index + 1

  while (cursor > 0) {
    const modulo = (cursor - 1) % 26
    value = String.fromCharCode(65 + modulo) + value
    cursor = Math.floor((cursor - modulo) / 26)
  }

  return value
}
