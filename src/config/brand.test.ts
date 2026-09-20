import { describe, expect, it } from "vitest";
import { brandConfiguration, waitlistSchema } from "@/config/brand";

describe("brand configuration", () => {
  it("contains the white-label essentials", () => {
    expect(brandConfiguration.name).toBeTruthy();
    expect(brandConfiguration.logo).toBeTruthy();
    expect(brandConfiguration.colors.accent).toMatch(/^#/);
  });
  it("validates a contact email", () => {
    expect(waitlistSchema.safeParse({ email: "hello@example.com" }).success).toBe(true);
    expect(waitlistSchema.safeParse({ email: "not-an-email" }).success).toBe(false);
  });
});
