# Spec: Menu

## Requirement: Menu is data-driven

### Scenario: price change

- **GIVEN** the owner changes `ca-phe-muoi` price to 22000
- **WHEN** the site is rebuilt
- **THEN** `/menu`, the home featured block and `/menu-in` show `22.000đ`

### Scenario: unavailable item

- **GIVEN** an item with `available: false`
- **THEN** it renders dimmed with the label `Tạm hết`

### Scenario: item without photo

- **GIVEN** an item whose image is not in `media.json`
- **THEN** a `surface-alt` frame shows the item name