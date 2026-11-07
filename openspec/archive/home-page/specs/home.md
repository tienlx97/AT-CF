# Spec: Home page

## Requirement: Hero

### Scenario: phone

- **GIVEN** a 390 px viewport without Save-Data
- **THEN** the portrait 9:16 720p video plays muted, looped, inline over its poster

### Scenario: data saver or reduced motion

- **GIVEN** `navigator.connection.saveData` or `prefers-reduced-motion: reduce`
- **THEN** only the poster is shown and no video file is requested

## Requirement: Order online block

### Scenario: links empty

- **GIVEN** `shopeefood` and `grabfood` are empty
- **THEN** no ShopeeFood/GrabFood button renders and the block offers phone and Zalo

### Scenario: link filled

- **GIVEN** `shopeefood` is a URL
- **THEN** a ShopeeFood button links to it (new tab, `rel="noopener"`)

## Requirement: Map loads lazily

- **GIVEN** the page has loaded
- **THEN** no Google Maps request is made until the user taps "Xem bản đồ" or the map block enters the viewport