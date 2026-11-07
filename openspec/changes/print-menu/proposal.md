# Proposal: print-menu

**Status:** draft
**Created:** 2026-11-07

## Why

The shop needs a menu to print and hang at the counter, always in sync with the
website prices. Source: `ANH-TU-PROMP.md` section 5 (`/menu-in`).

## What changes

- `/menu-in` without site chrome, A4 portrait, `@page { size: A4; margin }`, clean `@media print`, logo, name, phone, QR code (website/Zalo) generated at build time as inline SVG, type readable at 1–2 m, `In menu` button on screen only.

## Out of scope

- Multi-page or landscape menus.

## Decision log

| Date | Decision | Why |
|---|---|---|