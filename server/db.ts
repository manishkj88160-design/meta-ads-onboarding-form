import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, formSubmissions, FormSubmission, InsertFormSubmission, adminUsers, AdminUser, InsertAdminUser } from "../drizzle/schema";
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

/**
 * Store a form submission in the database
 */
export async function createFormSubmission(data: InsertFormSubmission): Promise<FormSubmission> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(formSubmissions).values(data);
  const submissionId = (result as any)[0]?.insertId;
  
  if (!submissionId) {
    throw new Error("Failed to get insertion ID");
  }

  const submission = await db
    .select()
    .from(formSubmissions)
    .where(eq(formSubmissions.id, submissionId))
    .limit(1);

  if (!submission.length) {
    throw new Error("Failed to retrieve created submission");
  }

  return submission[0];
}

/**
 * Get all form submissions
 */
export async function getAllFormSubmissions(): Promise<FormSubmission[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get submissions: database not available");
    return [];
  }

  return await db.select().from(formSubmissions);
}

/**
 * Get a single form submission by ID
 */
export async function getFormSubmissionById(id: number): Promise<FormSubmission | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get submission: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(formSubmissions)
    .where(eq(formSubmissions.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}


/**
 * Get admin user by ID
 */
export async function getAdminUserByAdminId(adminId: string): Promise<AdminUser | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get admin user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.adminId, adminId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Get all admin users
 */
export async function getAllAdminUsers(): Promise<AdminUser[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get admin users: database not available");
    return [];
  }

  return await db.select().from(adminUsers);
}

/**
 * Create a new admin user
 */
export async function createAdminUser(data: InsertAdminUser): Promise<AdminUser> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(adminUsers).values(data);
  const adminUserId = (result as any)[0]?.insertId;
  
  if (!adminUserId) {
    throw new Error("Failed to get insertion ID");
  }

  const admin = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.id, adminUserId))
    .limit(1);

  if (!admin.length) {
    throw new Error("Failed to retrieve created admin user");
  }

  return admin[0];
}

/**
 * Update admin user password
 */
export async function updateAdminPassword(adminId: string, newPasswordHash: string): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db
    .update(adminUsers)
    .set({ passwordHash: newPasswordHash, updatedAt: new Date() })
    .where(eq(adminUsers.adminId, adminId));
}

/**
 * Delete admin user
 */
export async function deleteAdminUser(adminId: string): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.delete(adminUsers).where(eq(adminUsers.adminId, adminId));
}

/**
 * Deactivate admin user
 */
export async function deactivateAdminUser(adminId: string): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db
    .update(adminUsers)
    .set({ isActive: "false", updatedAt: new Date() })
    .where(eq(adminUsers.adminId, adminId));
}
