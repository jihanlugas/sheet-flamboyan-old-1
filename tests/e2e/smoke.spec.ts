import { expect, test } from "@playwright/test";

const expectedRoutes = [
  { heading: "Masuk ke ruang kerja", path: "/login" },
  { heading: "Dashboard", path: "/dashboard" },
  { heading: "Pemain", path: "/players" },
  { heading: "Andi Pratama", path: "/players/player-001" },
  { heading: "Sesi", path: "/sessions" },
  { heading: "Buat sesi", path: "/sessions/new" },
  { heading: "Sesi 20 Nov 2026", path: "/sessions/session-001" },
  { heading: "Laporan sesi", path: "/sessions/session-001/report" },
  { heading: "Transaksi", path: "/transactions" },
  { heading: "Keuangan PB", path: "/pb-finance" },
];

test("the shell navigates locally and keeps sample tables usable on mobile", async ({ page }) => {
  const unexpectedRequests: string[] = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (url.pathname.startsWith("/api/") || url.hostname !== "127.0.0.1") {
      unexpectedRequests.push(url.href);
    }
  });

  await page.goto("/");
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  await expect(page.getByText("Data contoh, belum tersimpan.")).toBeVisible();

  await page.getByRole("link", { name: "Pemain" }).click();
  await expect(page).toHaveURL(/\/players$/);
  await expect(page.getByRole("heading", { name: "Pemain", exact: true })).toBeVisible();

  await page.setViewportSize({ width: 375, height: 812 });
  const mobileNavigation = page.getByRole("navigation", { name: "Navigasi utama" }).last();
  await expect(mobileNavigation).toBeVisible();
  await mobileNavigation.getByRole("link", { name: "Sesi" }).click();
  await expect(page).toHaveURL(/\/sessions$/);
  await expect(page.getByRole("heading", { name: "Sesi", exact: true })).toBeVisible();
  await mobileNavigation.getByRole("link", { name: "Pemain" }).click();
  await expect(page).toHaveURL(/\/players$/);

  const tableRegion = page.getByRole("region", { name: "Daftar pemain contoh" });
  await expect(tableRegion).toBeVisible();
  expect(
    await tableRegion.evaluate((element) => element.scrollWidth > element.clientWidth),
  ).toBe(true);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBe(true);

  await page.getByRole("link", { name: "Lihat profil" }).first().click();
  await expect(page).toHaveURL(/\/players\/player-001$/);
  await expect(page.getByRole("heading", { name: "Andi Pratama" })).toBeVisible();

  await mobileNavigation.getByRole("link", { name: "Sesi" }).click();
  await page.getByRole("link", { name: "Buat sesi" }).click();
  await expect(page).toHaveURL(/\/sessions\/new$/);
  await page.getByRole("navigation", { name: "Breadcrumb" }).getByRole("link", { name: "Sesi" }).click();
  await page.getByRole("link", { name: "Buka detail" }).first().click();
  await expect(page).toHaveURL(/\/sessions\/session-001$/);
  await page.getByRole("link", { name: "Pratinjau laporan" }).click();
  await expect(page).toHaveURL(/\/sessions\/session-001\/report$/);

  await mobileNavigation.getByRole("link", { name: "Transaksi" }).click();
  await expect(page.getByRole("heading", { name: "Transaksi", exact: true })).toBeVisible();
  await mobileNavigation.getByRole("link", { name: "Keuangan PB" }).click();
  await expect(page.getByRole("heading", { name: "Keuangan PB", exact: true })).toBeVisible();
  expect(unexpectedRequests).toEqual([]);
});

test("all planned routes render their page heading", async ({ page }) => {
  for (const route of expectedRoutes) {
    await page.goto(route.path);
    await expect(
      page.getByRole("heading", { name: route.heading, exact: true }),
      `${route.path} should render its heading`,
    ).toBeVisible();
  }
});
