import { z } from "zod";

// ── Auth ─────────────────────────────────────────────────────────────────
export const registerSchema = z.object({
  firstName: z.string().trim().min(1).max(60),
  lastName:  z.string().trim().min(1).max(60),
  email:     z.string().trim().toLowerCase().email().max(255),
  password:  z.string().min(8).max(128),
  phone:     z.string().trim().regex(/^\+?[0-9\s\-()]{7,20}$/).optional().or(z.literal("")),
  country:   z.string().trim().max(80).optional().or(z.literal("")),
});

export const loginSchema = z.object({
  email:    z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(128),
});

// ── Properties ───────────────────────────────────────────────────────────
export const propertyTypeEnum = z.enum(["HOUSE","APARTMENT","VILLA","LAND","COMMERCIAL"]);
export const transactionTypeEnum = z.enum(["SALE","RENT"]);

export const propertyCreateSchema = z.object({
  title:           z.string().trim().min(6).max(140),
  description:     z.string().trim().min(30).max(20_000),
  price:           z.coerce.number().positive().max(1_000_000_000),
  currency:        z.string().trim().length(3).default("RWF"),
  transactionType: transactionTypeEnum,
  propertyType:    propertyTypeEnum,
  bedrooms:        z.coerce.number().int().min(0).max(50).optional(),
  bathrooms:       z.coerce.number().int().min(0).max(50).optional(),
  areaSqm:         z.coerce.number().int().min(0).max(1_000_000).optional(),
  province:        z.string().trim().min(1).max(80),
  district:        z.string().trim().min(1).max(80),
  sector:          z.string().trim().max(80).optional(),
  village:         z.string().trim().max(80).optional(),
  latitude:        z.coerce.number().min(-90).max(90).optional(),
  longitude:       z.coerce.number().min(-180).max(180).optional(),
  amenities:       z.array(z.string().trim().max(60)).max(40).default([]),
});

export const propertyUpdateSchema = propertyCreateSchema.partial();

export const propertySearchSchema = z.object({
  q:               z.string().trim().max(120).optional(),
  transactionType: transactionTypeEnum.optional(),
  propertyType:    propertyTypeEnum.optional(),
  province:        z.string().trim().max(80).optional(),
  district:        z.string().trim().max(80).optional(),
  minPrice:        z.coerce.number().nonnegative().optional(),
  maxPrice:        z.coerce.number().nonnegative().optional(),
  bedrooms:        z.coerce.number().int().min(0).optional(),
  sort:            z.enum(["newest","oldest","price-asc","price-desc"]).default("newest"),
  page:            z.coerce.number().int().min(1).default(1),
  pageSize:        z.coerce.number().int().min(1).max(48).default(12),
});

// ── Inquiries ────────────────────────────────────────────────────────────
export const inquirySchema = z.object({
  propertyId: z.string().cuid().optional(),
  name:       z.string().trim().min(1).max(120),
  email:      z.string().trim().toLowerCase().email(),
  phone:      z.string().trim().max(30).optional().or(z.literal("")),
  subject:    z.string().trim().min(1).max(160),
  message:    z.string().trim().min(5).max(5000),
});

// ── Payments ─────────────────────────────────────────────────────────────
export const initiatePaymentSchema = z.object({
  propertyId: z.string().cuid().optional(),
  purpose:    z.enum(["PROPERTY_ACCESS","FEATURED_LISTING"]),
  provider:   z.enum(["paypack","stripe"]),
  phone:      z.string().trim().regex(/^\+?[0-9]{9,15}$/).optional(),
});

export type PropertySearchInput = z.infer<typeof propertySearchSchema>;
