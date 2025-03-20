---
layout: page
title: Migration from v1
parent: Get Started
---

# Migration from v1

This guide explains the changes you need to make when upgrading from version 1. It covers breaking changes, new features, bug fixes, and provides
example configurations.

---

## Breaking Changes

| **Change**                                                                              | **Impacts**                                 | **What to Do**                                                                                                                                                                                                                                  |
| --------------------------------------------------------------------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Removed `battery-view-strategy`                                                         | battery-view-strategy                       | Use `grid-view-strategy` instead. See the **Battery View Replacement** example [below](#battery-view-replacement)                                                                                                                               |
| Removed `update-view-strategy`                                                          | update-view-strategy                        | Use `grid-view-strategy` instead. See the **Update View Replacement** example [below](#update-view-replacement)                                                                                                                                 |
| Renamed `rows` key to `grids`                                                           | grid-view-strategy, area-dashboard-strategy | Update your configuration by replacing `rows` with `grids`                                                                                                                                                                                      |
| New required fields for `grids`                                                         | grid-view-strategy, area-dashboard-strategy | Make sure your `grids` configuration includes all required fields - see [area-dashboard-strategy]({{site.baseurl}}/dashboard/area/configuration.html#grid)/[grid-view-strategy]({{site.baseurl}}/view/grid/configuration.html#grid)             |
| Removed `domain` key                                                                    | area-dashboard-strategy                     | Use include-filter with `type: domain` - see [filter]({{site.baseurl}}/dashboard/area/configuration.html#filter)                                                                                                                                |
| Removed reference tabs/rows using `~`                                                   | area-dashboard-strategy                     | Use grid overrides for `grids` instead - see [area-dashboard-strategy]({{site.baseurl}}/dashboard/area/configuration.html#grid-overrides)/[grid-view-strategy]({{site.baseurl}}/view/grid/configuration.html#grid-overrides)                    |
| Removed `tabs`                                                                          | area-dashboard-strategy                     | Replace with the new `main` and `grids` keys – see [main]({{site.baseurl}}/dashboard/area/configuration.md#main)/[grids]({{site.baseurl}}/dashboard/area/configuration.md#grids)                                                                |
| Removed `areaColors`, `areaCardConfig`, and `areaBlacklist`                             | area-dashboard-strategy                     | These settings can now be handled using the `navigation` key – see [navigation]({{site.baseurl}}/dashboard/area/configuration.html#navigation)                                                                                                  |
| Renamed & moved `minColumnWidth` (now `minCardWith`) and `replaceCards` (now `replace`) | grid-view-strategy, area-dashboard-strategy | Use the new global configuration and override in individual `grids` if needed - see [area-dashboard-strategy]({{site.baseurl}}/dashboard/area/configuration.html#grid)/[grid-view-strategy]({{site.baseurl}}/view/grid/configuration.html#grid) |

---

## New Features

- **Grid Sorting:** You can now sort items within grids - see
  [area-dashboard-strategy]({{site.baseurl}}/dashboard/area/configuration.html#sort)/[grid-view-strategy]({{site.baseurl}}/view/grid/configuration.html#sort)
- **Enhanced Navigation:** Navigation in the Area Dashboard now supports all grid features - see
  [area-dashboard-strategy]({{site.baseurl}}/dashboard/area/configuration.html#navigation)
- **Simplified Global Configuration:** A new global config reduces overall setup complexity - see
  [area-dashboard-strategy]({{site.baseurl}}/dashboard/area/configuration.html#global)/[grid-view-strategy]({{site.baseurl}}/view/grid/configuration.html#global)
- **Grid Editing:** Modify grids using grid overrides and `gridMergeStrategy` - see
  [area-dashboard-strategy]({{site.baseurl}}/dashboard/area/configuration.html#grid-merge-strategy)/[grid-view-strategy]({{site.baseurl}}/view/grid/configuration.html#grid-merge-strategy)
- **New Customizations per Grid:** You can now set `replace` and width on each grid individually - see
  [area-dashboard-strategy]({{site.baseurl}}/dashboard/area/configuration.html#grid)/[grid-view-strategy]({{site.baseurl}}/view/grid/configuration.html#grid)
- **Value-Type Floor:** Added capability to filter or sort by floor - see
  [area-dashboard-strategy]({{site.baseurl}}/dashboard/area/configuration.html#value-type)/[grid-view-strategy]({{site.baseurl}}/view/grid/configuration.html#value-type)
- **Improved Error Messages:** Error messages are now more descriptive and helpful.

---

## Bug Fixes

- **card_mod Fix:** The card_mod functionality should work properly in grids.
- **Multiple `$entity` Replacement Issue:** Fixed issues with multiple uses of `$entity`.
- Several minor enhancements have been made.

---

## Example Configurations

### Battery View Replacement

This example shows how to replace the old battery view configuration using `grid-view-strategy`:

```yaml
strategy:
    type: custom:grid-view-strategy
    config:
        global:
            card:
                type: custom:mini-graph-card
                entities:
                    - $entity
                filter:
                    include:
                        - type: domain
                          value: sensor
                        - type: attribute
                          config:
                              key: device_class
                          value: battery
        grids:
            - id: other
              title: Others
              filter:
                  exclude:
                      - type: integration
                        comparator: in
                        value:
                            - mqtt
                            - switchbot
                            - xiaomi_ble
            - id: zigbee
              title: Zigbee
              filter:
                  include:
                      - type: integration
                        value: mqtt
            - id: switchbot
              title: Switchbot
              filter:
                  include:
                      - type: integration
                        value: switchbot
            - id: plant
              title: Plant Sensor
              filter:
                  include:
                      - type: integration
                        value: xiaomi_ble
```

### Update View Replacement

This example shows how to replace the old update view configuration using `grid-view-strategy`:

```yaml
strategy:
    type: custom:grid-view-strategy
    config:
        global:
            card:
                type: tile
                entity: $entity
                hide_state: true
                features:
                    - type: update-actions
                      backup: ask
        grids:
            - id: other
              title: Others
              filter:
                  exclude:
                      - type: integration
                        comparator: in
                        value:
                            - unifi
                            - hacs
                            - esphome
                            - mqtt
            - id: unifi
              title: Unifi
              filter:
                  include:
                      - type: integration
                        value: unifi
            - id: hacs
              title: HACS
              filter:
                  include:
                      - type: integration
                        value: hacs
            - id: esphome
              title: ESPHome
              filter:
                  include:
                      - type: integration
                        value: esphome
            - id: zigbee
              title: Zigbee
              filter:
                  include:
                      - type: integration
                        value: mqtt
```
