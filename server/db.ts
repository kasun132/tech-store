import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertProduct, InsertUser, products, storefrontSettings, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function listProducts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products);
}

export async function upsertProduct(product: InsertProduct) {
  const db = await getDb();
  if (!db) return undefined;
  if (product.id) {
    await db.update(products).set({ name: product.name, category: product.category, price: product.price, image: product.image, tag: product.tag, description: product.description }).where(eq(products.id, product.id));
    const result = await db.select().from(products).where(eq(products.id, product.id)).limit(1);
    return result[0];
  }
  const result = await db.insert(products).values(product);
  const id = Number(result[0].insertId);
  const created = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return created[0];
}

export async function getStorefrontSettings() {
  const db = await getDb();
  if (!db) return { id: 0, sourceOverride: "" };
  const result = await db.select().from(storefrontSettings).limit(1);
  return result[0] ?? { id: 0, sourceOverride: "" };
}

export async function saveStorefrontSettings(sourceOverride: string) {
  const db = await getDb();
  if (!db) return { id: 0, sourceOverride };
  const current = await db.select().from(storefrontSettings).limit(1);
  if (current[0]) {
    await db.update(storefrontSettings).set({ sourceOverride }).where(eq(storefrontSettings.id, current[0].id));
    return { ...current[0], sourceOverride };
  }
  await db.insert(storefrontSettings).values({ sourceOverride });
  return getStorefrontSettings();
}
