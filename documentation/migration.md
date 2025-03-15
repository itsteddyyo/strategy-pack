---
layout: page
title: Migration from v1
parent: Get Started
---

# Migration from v1

## Breaking changes

| Change                                                                               | Proposed Solution                                                                                                                                                                                             |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "battery-view-strategy" was removed<br>"update-view-strategy" was removed            | use "grid-view-strategy" with config ([battery](#battery-view-replacement)/[update](#update-view-replacement))                                                                                                |
| rows was renamed to grids<br>new required fields for grids<br>domain-key was removed | move "rows" from "tabs" to single "grids"-key + follow new config options - see [Area Dashboard Strategy](/dashboard/area/configuration.html#grid)/[Grid View Strategy](/view/grid/configuration.html#grid)   |
| reference tab/row with ‘~’ was removed                                               | use grid overrides for grids - see [Area Dashboard Strategy](/dashboard/area/configuration.html#grid-overrides)/[Grid View Strategy](/view/grid/configuration.html#grid-overrides)                         |
| tabs was removed                                                                     | use main + grids - see [Main](/dashboard/area/configuration.html#main)/[Grid](/dashboard/area/configuration.md#grid)                                                                                          |
| areaColors, areaCardConfig, areaBlacklist were removed                               | can be replicated with [Navigation](/dashboard/area/configuration.html#navigation)                                                                                                                            |
| minColumnWidth and replaceCards were renamed and moved                               | moved to grid config = use global config + override in grid if you need it - see [Area Dashboard Strategy](/dashboard/area/configuration.html#grid)/[Grid View Strategy](/view/grid/configuration.html#grid) |

## New Features

- Sorting in grids now possible - see
  [Area Dashboard Strategy](/dashboard/area/configuration.html#sort)/[Grid View Strategy](/view/grid/configuration.html#sort)
- [Navigation in Area Dashboard Strategy](/dashboard/area/configuration.html#navigation) now supports all grid features
- less config with new global config - see
  [Area Dashboard Strategy](/dashboard/area/configuration.html#full)/[Grid View Strategy](/view/grid/configuration.html#full)
- editing grids now possible with grid overrides and gridMergeStrategy - see
  [Area Dashboard Strategy](/dashboard/area/configuration.html#grid-overrides)/[Grid View Strategy](/view/grid/configuration.html#grid-overrides)
- replace and width now possible on a per-grids-basis - see
  [Area Dashboard Strategy](/dashboard/area/configuration.html#grid)/[Grid View Strategy](/view/grid/configuration.html#grid)
- filter/sort by floor now possible - see
  [Area Dashboard Strategy](/dashboard/area/configuration.html#value-types)/[Grid View Strategy](/view/grid/configuration.html#value-types)
- error messages should be more helpful

## Bug Fixes

- card_mod should work again in grids
- replacement bug with multiple $entities should now work
- multiple small improvements

## Attachments

### Battery View Replacement

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
