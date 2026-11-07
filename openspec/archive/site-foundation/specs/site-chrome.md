# Spec: Site chrome

## Requirement: Header

The header SHALL be fixed at the top with the logo, links (Trang chủ, Menu,
Hình ảnh, Liên hệ) and the order button.

### Scenario: over the hero

- **GIVEN** a page with a hero video and scroll position 0
- **THEN** the header is transparent with white text
- **WHEN** the user scrolls more than 24 px
- **THEN** the header becomes solid white with brand-ink text and a shadow

### Scenario: mobile drawer

- **GIVEN** a viewport under 768 px
- **WHEN** the user taps the menu button
- **THEN** a full-screen drawer opens, focus moves into it and stays trapped
- **WHEN** the user presses Esc or the close button
- **THEN** the drawer closes and focus returns to the menu button

## Requirement: Footer

The footer SHALL use the brand green with the white logo, contacts, hours and
`© 2026 Anh Tú Coffee`.

## Requirement: Floating contact bar (mobile only)

### Scenario: mobile

- **GIVEN** a viewport under 768 px
- **THEN** buttons `Gọi` (tel:) and `Zalo` float bottom-right, each ≥ 44 px tall
- **AND** the page has bottom padding so the bar never hides the footer text

### Scenario: lightbox open

- **GIVEN** a lightbox is open
- **THEN** the contact bar is hidden
