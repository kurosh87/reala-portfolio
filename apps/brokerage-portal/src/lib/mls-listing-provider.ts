import "server-only"

import { createClient } from "@supabase/supabase-js"
import postgres from "postgres"

const BC_MLS_PATTERN = /\bR\d{7}\b/gi
const LABELED_MLS_PATTERN =
  /\b(?:mls|listing)(?:\s*(?:#|number|no\.?|id))?\s*[:#-]?\s*([A-Z]{0,3}\d{6,8})\b/gi

export type MlsListingMatch = {
  listingInventoryId: string
  sourceId: string | null
  sourceSlug: string | null
  sourceListingKey: string | null
  mls: string | null
  address: string | null
  city: string | null
  region: string | null
  postalCode: string | null
  publicUrl: string | null
  listingStatus: string | null
  title: string | null
  description: string | null
  priceDisplay: string | null
  priceValue: number | null
  currency: string | null
  bedrooms: number | null
  bathrooms: number | null
  propertyType: string | null
  livingAreaDisplay: string | null
  neighborhood: string | null
  latitude: number | null
  longitude: number | null
  mediaCount: number
  primaryMediaUrl: string | null
  firstSeenAt: string | null
  lastSeenAt: string | null
  lastImportedAt: string | null
  matchedOn: "mls" | "address" | "query"
  source: "mls_supabase"
}


type MlsMediaSummary = {
  listingInventoryId: string
  mediaCount: number
  primaryMediaUrl: string | null
}

type ListingInventoryRow = {
  listingInventoryId?: string | null
  id?: string | null
  sourceId?: string | null
  sourceSlug?: string | null
  sourceListingKey?: string | null
  mls?: string | null
  normalizedData?: Record<string, unknown> | null
  address?: string | null
  addressLine?: string | null
  city?: string | null
  region?: string | null
  postalCode?: string | null
  publicUrl?: string | null
  listingStatus?: string | null
  title?: string | null
  description?: string | null
  priceDisplay?: string | null
  priceValue?: number | string | null
  currency?: string | null
  bedrooms?: number | string | null
  bathrooms?: number | string | null
  propertyType?: string | null
  livingAreaDisplay?: string | null
  neighborhood?: string | null
  latitude?: number | string | null
  longitude?: number | string | null
  mediaCount?: number | string | null
  primaryMediaUrl?: string | null
  firstSeenAt?: string | null
  lastSeenAt?: string | null
  lastImportedAt?: string | null
}

export type MlsSearchResult = {
  configured: boolean
  query: string
  matches: MlsListingMatch[]
  error?: string
}


let mlsSqlClient: postgres.Sql | null = null

export function normalizeMls(value: string | null | undefined) {
  if (!value) return null

  const normalized = value
    .trim()
    .toUpperCase()
    .replace(/^MLS\s*/i, "")
    .replace(/^#/, "")
    .replace(/[^A-Z0-9]/g, "")

  return normalized.length >= 6 ? normalized : null
}

export function extractMls(text: string | null | undefined) {
  if (!text) return null

  BC_MLS_PATTERN.lastIndex = 0
  const bcMatch = BC_MLS_PATTERN.exec(text)
  if (bcMatch?.[0]) return normalizeMls(bcMatch[0])

  LABELED_MLS_PATTERN.lastIndex = 0
  for (const match of text.matchAll(LABELED_MLS_PATTERN)) {
    const value = normalizeMls(match[1])
    if (value) return value
  }

  return null
}

export function mlsLookupConfigured() {
  return Boolean(
    getMlsDatabaseUrl() ||
      (process.env.MLS_SUPABASE_URL &&
        process.env.MLS_SUPABASE_SERVICE_ROLE_KEY)
  )
}

export async function searchMlsListings(query: string): Promise<MlsSearchResult> {
  const trimmed = query.trim()

  if (trimmed.length < 3) {
    return { configured: mlsLookupConfigured(), query: trimmed, matches: [] }
  }

  if (!mlsLookupConfigured()) {
    return { configured: false, query: trimmed, matches: [] }
  }

  try {
    const matches = getMlsDatabaseUrl()
      ? await searchMlsListingsWithSql(trimmed)
      : await searchMlsListingsWithSupabaseRest(trimmed)

    return { configured: true, query: trimmed, matches }
  } catch (error) {
    return {
      configured: true,
      query: trimmed,
      matches: [],
      error:
        error instanceof Error
          ? error.message
          : "Unknown MLS Supabase lookup error",
    }
  }
}

async function searchMlsListingsWithSql(
  query: string
): Promise<MlsListingMatch[]> {
  const mls = normalizeMls(query) ?? extractMls(query)
  if (mls) {
    const rows = await findByMls(mls, 8)
    if (rows.length > 0) {
      return (await attachMediaSummaries(rows))
        .map((row) => toMlsListingMatch(row, "mls"))
        .filter(isMlsListingMatch)
    }
  }

  const addressMatches = await findAddressCandidates(query, 8)
  if (addressMatches.length > 0) {
    return (await attachMediaSummaries(addressMatches))
      .slice(0, 8)
      .map((row) => toMlsListingMatch(row, "address"))
      .filter(isMlsListingMatch)
  }

  const looseQuery = `%${query.replace(/\s+/g, "%")}%`
  const rows = await getMlsSql()<ListingInventoryRow[]>`
    select
      i.id::text as "listingInventoryId",
      i."sourceId"::text as "sourceId",
      s.slug as "sourceSlug",
      i."sourceListingKey" as "sourceListingKey",
      i."normalizedData" as "normalizedData",
      nullif(btrim(i."normalizedData"::jsonb->>'mls_number'), '') as mls,
      i."addressLine" as address,
      i.city,
      i.region,
      i."postalCode" as "postalCode",
      i."publicUrl" as "publicUrl",
      i."listingStatus" as "listingStatus",
      i.title,
      i.description,
      i."priceDisplay" as "priceDisplay",
      i."priceValue" as "priceValue",
      i.currency,
      i.bedrooms,
      i.bathrooms,
      i."propertyType" as "propertyType",
      i.latitude,
      i.longitude,
      i."firstSeenAt" as "firstSeenAt",
      i."lastSeenAt" as "lastSeenAt",
      i."lastImportedAt" as "lastImportedAt"
    from ${listingInventoryTable()} i
    left join public."ListingImportSource" s on s.id = i."sourceId"
    where i."addressLine" ilike ${looseQuery}
       or i.title ilike ${looseQuery}
       or i."sourceListingKey" ilike ${looseQuery}
    order by
      case when i.region = 'British Columbia' then 0 else 1 end,
      i."lastImportedAt" desc
    limit 8
  `

  return (await attachMediaSummaries(rows))
    .map((row) =>
      toMlsListingMatch(row, looksLikeAddress(query) ? "address" : "query")
    )
    .filter(isMlsListingMatch)
}

async function attachMediaSummaries(rows: ListingInventoryRow[]) {
  const ids = rows
    .map((row) => row.listingInventoryId ?? row.id)
    .filter((id): id is string => Boolean(id))

  if (!ids.length) return rows

  const summaries = await getMlsMediaSummaries(ids)
  const byListingId = new Map(
    summaries.map((summary) => [summary.listingInventoryId, summary])
  )

  return rows.map((row) => {
    const id = row.listingInventoryId ?? row.id
    const summary = id ? byListingId.get(id) : undefined

    if (!summary) return row

    return {
      ...row,
      mediaCount: summary.mediaCount,
      primaryMediaUrl: summary.primaryMediaUrl,
    }
  })
}

async function getMlsMediaSummaries(ids: string[]) {
  if (!ids.length) return []

  return await getMlsSql()<MlsMediaSummary[]>`
    select
      m."listingId"::text as "listingInventoryId",
      count(*)::int as "mediaCount",
      (array_agg(coalesce(nullif(m."cdnUrl", ''), nullif(m."sourceUrl", '')) order by m."sortOrder" asc nulls last, m."createdAt" asc))[1] as "primaryMediaUrl"
    from public."ListingInventoryMedia" m
    where m."listingId" in ${getMlsSql()(ids)}
    group by m."listingId"
  `
}

async function findByMls(mls: string, limit: number) {
  const normalizedMls = normalizeMls(mls)
  if (!normalizedMls) return []

  return await getMlsSql()<ListingInventoryRow[]>`
    select
      i.id::text as "listingInventoryId",
      i."sourceId"::text as "sourceId",
      s.slug as "sourceSlug",
      i."sourceListingKey" as "sourceListingKey",
      i."normalizedData" as "normalizedData",
      nullif(btrim(i."normalizedData"::jsonb->>'mls_number'), '') as mls,
      i."addressLine" as address,
      i.city,
      i.region,
      i."postalCode" as "postalCode",
      i."publicUrl" as "publicUrl",
      i."listingStatus" as "listingStatus",
      i.title,
      i.description,
      i."priceDisplay" as "priceDisplay",
      i."priceValue" as "priceValue",
      i.currency,
      i.bedrooms,
      i.bathrooms,
      i."propertyType" as "propertyType",
      i.latitude,
      i.longitude,
      i."firstSeenAt" as "firstSeenAt",
      i."lastSeenAt" as "lastSeenAt",
      i."lastImportedAt" as "lastImportedAt"
    from ${listingInventoryTable()} i
    left join public."ListingImportSource" s on s.id = i."sourceId"
    where upper(nullif(btrim(i."normalizedData"::jsonb->>'mls_number'), '')) = ${normalizedMls}
       or upper(i."sourceListingKey") = ${normalizedMls}
    order by
      case when i.region = 'British Columbia' then 0 else 1 end,
      i."lastImportedAt" desc
    limit ${limit}
  `
}

async function findAddressCandidates(address: string, limit: number) {
  const addressKey = getStreetAddressKey(address)
  if (!addressKey) return []

  const [streetNumber] = addressKey.split(" ")
  if (!streetNumber) return []

  const rows = await getMlsSql()<ListingInventoryRow[]>`
    select
      i.id::text as "listingInventoryId",
      i."sourceId"::text as "sourceId",
      s.slug as "sourceSlug",
      i."sourceListingKey" as "sourceListingKey",
      i."normalizedData" as "normalizedData",
      nullif(btrim(i."normalizedData"::jsonb->>'mls_number'), '') as mls,
      i."addressLine" as address,
      i.city,
      i.region,
      i."postalCode" as "postalCode",
      i."publicUrl" as "publicUrl",
      i."listingStatus" as "listingStatus",
      i.title,
      i.description,
      i."priceDisplay" as "priceDisplay",
      i."priceValue" as "priceValue",
      i.currency,
      i.bedrooms,
      i.bathrooms,
      i."propertyType" as "propertyType",
      i.latitude,
      i.longitude,
      i."firstSeenAt" as "firstSeenAt",
      i."lastSeenAt" as "lastSeenAt",
      i."lastImportedAt" as "lastImportedAt"
    from ${listingInventoryTable()} i
    left join public."ListingImportSource" s on s.id = i."sourceId"
    where i."addressLine" ilike ${`${streetNumber}%`}
       or i."addressLine" ilike ${`% ${streetNumber} %`}
       or i."addressLine" ilike ${`%- ${streetNumber}%`}
       or i."addressLine" ilike ${`%#${streetNumber}%`}
    order by
      case when i.region = 'British Columbia' then 0 else 1 end,
      i."lastImportedAt" desc
    limit ${Math.max(limit, 50)}
  `

  return rows.filter((row) => getStreetAddressKey(row.address) === addressKey)
}

async function searchMlsListingsWithSupabaseRest(
  query: string
): Promise<MlsListingMatch[]> {
  const supabase = createClient(
    process.env.MLS_SUPABASE_URL!,
    process.env.MLS_SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  )
  const table = getListingInventoryTableName()
  const mls = normalizeMls(query) ?? extractMls(query)

  if (mls) {
    const { data, error } = await supabase
      .from(table)
      .select(MLS_LISTING_COLUMNS)
      .or(
        `sourceListingKey.eq.${escapePostgrestValue(mls)},normalizedData->>mls_number.eq.${escapePostgrestValue(mls)}`
      )
      .order("lastImportedAt", { ascending: false })
      .limit(8)

    if (error) throw error

    const matches = (data ?? [])
      .map((row) => toMlsListingMatch(row as ListingInventoryRow, "mls"))
      .filter(isMlsListingMatch)

    if (matches.length) return matches
  }

  const looseQuery = `%${query.replace(/\s+/g, "%")}%`
  const { data, error } = await supabase
    .from(table)
    .select(MLS_LISTING_COLUMNS)
    .or(
      `addressLine.ilike.${escapePostgrestValue(looseQuery)},title.ilike.${escapePostgrestValue(looseQuery)},sourceListingKey.ilike.${escapePostgrestValue(looseQuery)}`
    )
    .order("lastImportedAt", { ascending: false })
    .limit(8)

  if (error) throw error

  return (data ?? [])
    .map((row) =>
      toMlsListingMatch(
        row as ListingInventoryRow,
        looksLikeAddress(query) ? "address" : "query"
      )
    )
    .filter(isMlsListingMatch)
}

function isMlsListingMatch(
  value: MlsListingMatch | null
): value is MlsListingMatch {
  return value !== null
}

const MLS_LISTING_COLUMNS =
  "id,sourceId,sourceListingKey,normalizedData,addressLine,city,region,postalCode,publicUrl,listingStatus,title,description,priceDisplay,priceValue,currency,bedrooms,bathrooms,propertyType,latitude,longitude,firstSeenAt,lastSeenAt,lastImportedAt"

function toMlsListingMatch(
  row: ListingInventoryRow,
  matchedOn: MlsListingMatch["matchedOn"]
): MlsListingMatch | null {
  const listingInventoryId = row.listingInventoryId ?? row.id
  if (!listingInventoryId) return null

  const normalizedData = row.normalizedData ?? {}
  const mlsValue =
    row.mls ??
    (typeof normalizedData.mls_number === "string"
      ? normalizedData.mls_number
      : row.sourceListingKey)

  return {
    listingInventoryId,
    sourceId: row.sourceId ?? null,
    sourceSlug: row.sourceSlug ?? null,
    sourceListingKey: row.sourceListingKey ?? null,
    mls: normalizeMls(mlsValue),
    address: row.address ?? row.addressLine ?? null,
    city: row.city ?? null,
    region: row.region ?? null,
    postalCode: row.postalCode ?? null,
    publicUrl: row.publicUrl ?? normalizedString(normalizedData, ["public_url", "publicUrl"]),
    listingStatus: row.listingStatus ?? normalizedString(normalizedData, ["listing_status", "listingStatus"]),
    title: row.title ?? normalizedString(normalizedData, ["title"]),
    description: row.description ?? normalizedString(normalizedData, ["description"]),
    priceDisplay: row.priceDisplay ?? normalizedString(normalizedData, ["price_display", "priceDisplay"]),
    priceValue: numberOrNull(row.priceValue) ?? normalizedNumber(normalizedData, ["price_value", "priceValue"]),
    currency: row.currency ?? normalizedString(normalizedData, ["currency"]),
    bedrooms: numberOrNull(row.bedrooms) ?? normalizedNumber(normalizedData, ["bedrooms", "beds"]),
    bathrooms: numberOrNull(row.bathrooms) ?? normalizedNumber(normalizedData, ["bathrooms", "baths"]),
    propertyType: row.propertyType ?? normalizedString(normalizedData, ["property_type", "propertyType"]),
    livingAreaDisplay: row.livingAreaDisplay ?? normalizedString(normalizedData, ["area", "living_area", "livingArea", "floor_area", "floorArea", "square_feet", "squareFeet", "sqft"]),
    neighborhood: row.neighborhood ?? normalizedString(normalizedData, ["neighborhood", "neighbourhood", "community", "subdivision"]),
    latitude: numberOrNull(row.latitude),
    longitude: numberOrNull(row.longitude),
    mediaCount: numberOrNull(row.mediaCount) ?? 0,
    primaryMediaUrl: row.primaryMediaUrl ?? null,
    firstSeenAt: row.firstSeenAt ?? null,
    lastSeenAt: row.lastSeenAt ?? null,
    lastImportedAt: row.lastImportedAt ?? null,
    matchedOn,
    source: "mls_supabase",
  }
}

function getMlsSql() {
  const databaseUrl = getMlsDatabaseUrl()
  if (!databaseUrl) {
    throw new Error("MLS database URL is not configured")
  }

  mlsSqlClient ??= postgres(databaseUrl, {
    max: 1,
    prepare: false,
  })

  return mlsSqlClient
}

function getMlsDatabaseUrl() {
  return process.env.MLS_DATABASE_URL || process.env.MLS_POSTGRES_URL || null
}

function getListingInventoryTableName() {
  const table = process.env.MLS_SUPABASE_LISTING_TABLE || "ListingInventory"
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(table)) {
    throw new Error("MLS_SUPABASE_LISTING_TABLE must be a simple table name")
  }

  return table
}

function listingInventoryTable() {
  return getMlsSql().unsafe(`public.${quoteIdentifier(getListingInventoryTableName())}`)
}

function quoteIdentifier(identifier: string) {
  return `"${identifier.replaceAll('"', '""')}"`
}

function normalizeAddressToken(value: string) {
  return value
    .toLowerCase()
    .replace(/\b(street|st)\b/g, "st")
    .replace(/\b(avenue|ave)\b/g, "ave")
    .replace(/\b(road|rd)\b/g, "rd")
    .replace(/\b(drive|dr)\b/g, "dr")
    .replace(/\b(boulevard|blvd)\b/g, "blvd")
    .replace(/\b(place|pl)\b/g, "pl")
    .replace(/\b(crescent|cres)\b/g, "cres")
    .replace(/\b(court|ct)\b/g, "ct")
    .replace(/\b(north)\b/g, "n")
    .replace(/\b(south)\b/g, "s")
    .replace(/\b(east)\b/g, "e")
    .replace(/\b(west)\b/g, "w")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function getStreetAddressKey(value: string | null | undefined) {
  if (!value) return null

  for (const segment of value.split(",")) {
    const withoutUnit = segment.replace(
      /\b(?:unit|suite|apt|apartment|#)\s*[a-z0-9-]+/gi,
      " "
    )
    const normalized = normalizeAddressToken(withoutUnit)
    const match = normalized.match(/^(\d{1,6})\s+(.+)$/)
    if (!match) continue

    const streetTokens = match[2].split(" ").slice(0, 4).join(" ")
    return `${match[1]} ${streetTokens}`.trim()
  }

  return null
}

function looksLikeAddress(value: string) {
  return /^\d+\s+/.test(value.trim())
}

function normalizedString(
  data: Record<string, unknown>,
  keys: string[]
) {
  for (const key of keys) {
    const value = data[key]
    if (typeof value === "string" && value.trim()) return value.trim()
    if (typeof value === "number" && Number.isFinite(value)) return String(value)
  }

  return null
}

function normalizedNumber(
  data: Record<string, unknown>,
  keys: string[]
) {
  for (const key of keys) {
    const value = numberOrNull(data[key] as number | string | null | undefined)
    if (value !== null) return value
  }

  return null
}

function numberOrNull(value: number | string | null | undefined) {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string") {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}


function escapePostgrestValue(value: string) {
  return value.replaceAll(",", "\\,")
}
