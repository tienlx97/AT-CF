# Spec: Gallery

## Requirement: Paging

- **GIVEN** 120 items in the selected filter
- **THEN** 24 render first and `Xem thêm` adds 24 more

## Requirement: Lightbox

- **GIVEN** the lightbox is open on item 5 of 120
- **THEN** the counter reads `5 / 120`
- **WHEN** the user presses ArrowRight (or swipes left)
- **THEN** item 6 shows
- **WHEN** the user presses Esc
- **THEN** the lightbox closes, any video stops and focus returns to the opened tile