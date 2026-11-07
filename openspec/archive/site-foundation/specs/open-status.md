# Spec: Open status (Vietnam time)

## Requirement: The site shows whether the shop is open, selling online or closed

The system SHALL compute the status from the current instant in `Asia/Ho_Chi_Minh`
and the hours in `site.json`.

### Scenario: counter hours

- **GIVEN** VN time 07:15
- **WHEN** the status is computed
- **THEN** state is `open` and the label is `Đang mở cửa · đến 11:00`

### Scenario: online hours

- **GIVEN** VN time 11:00 (inclusive) to 19:59
- **WHEN** the status is computed
- **THEN** state is `online` and the label is `Đang bán online · đến 20:00`

### Scenario: closed overnight

- **GIVEN** VN time 20:00 or later, or before 05:30
- **WHEN** the status is computed
- **THEN** state is `closed` and the label is `Đã đóng cửa · mở lại 5:30`

### Scenario: browser in another time zone

- **GIVEN** the UTC instant 2026-11-07T23:00Z (06:00 next day in VN)
- **WHEN** the status is computed
- **THEN** state is `open`

## Requirement: Header order button follows order links

### Scenario: both links filled during online hours

- **GIVEN** `shopeefood` and `grabfood` are non-empty and the state is `online`
- **THEN** the header CTA reads `Đặt online`

### Scenario: links missing

- **GIVEN** either link is empty
- **THEN** the header CTA reads `Gọi đặt món` and links to `tel:+84932311434`
