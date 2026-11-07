# Proposal: menu-page

**Status:** draft
**Created:** 2026-11-07

## Why

Menu and prices are the second thing every visitor wants. The owner must be able
to add items and categories by editing JSON only. Source: `ANH-TU-PROMP.md` section 5.

## What changes

- `src/data/menu.json` with the provisional items (Cà phê ×6, Đồ uống khác ×7), options (đường, đá), flags `bestseller`, `featured`, `available`.
- `src/features/menu`: config reader with validation, price formatting, `/menu` page with sticky category tabs (scroll-spy), item cards (image or labelled placeholder, name, price, description, `Bán chạy`, `Tạm hết` dimmed), options shown per category.
- Layout holds for 2–3 items and for 20+ items per category.

## Out of scope

- Ordering/cart. Print menu (`print-menu`).

## Decision log

| Date | Decision | Why |
|---|---|---|