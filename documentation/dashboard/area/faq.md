---
layout: page
title: FAQ
parent: Area Dashboard Strategy
---

# Frequently Asked Questions
{: .no_toc }

- TOC
{:toc}

## I want to change the card used in one of the predefined grids

Just use [Grid Overrides](../configuration#grid-overrides) like this:

```yaml
strategy:
  type: custom:area-dashboard-strategy
  config:
    #gridMergeStrategy: add #needs to be set but is default anyway
    grids:
      - gridId: control_media
        card:
          type: custom:mini-media-player
          entity: $entity
          group: true
```

As gridId you need to specify the id from the base config!

## I want to replace a card used for a single entity

You can use global overrides which would be applied to all grids.

```yaml
strategy:
  type: custom:area-dashboard-strategy
  config:
    global:
      replace:
        media_player.living_room:
          type: custom:mini-media-player
          entity: $entity
          group: true
```

If that's not wished for all grids, apply the replace to a specific grid using [Grid Overrides](../configuration#grid-overrides):

```yaml
strategy:
  type: custom:area-dashboard-strategy
  config:
    #gridMergeStrategy: add #needs to be set but is default anyway
    grids:
      - gridId: control_media
        replace:
          media_player.living_room:
            type: custom:mini-media-player
            entity: $entity
            group: true
```

## I want to change the filter for a grid

Just use [Grid Overrides](../configuration#grid-overrides) like this:

```yaml
strategy:
  type: custom:area-dashboard-strategy
  config:
    #gridMergeStrategy: add #needs to be set but is default anyway
    grids:
      - gridId: control_media
        filter:
          exclude:
            - type: disabled_by
              comparator: match
              value: .*
            - type: hidden_by
              comparator: match
              value: .*
            - type: label
              config:
                label: hidden
              value: hidden
            - type: device
              value: fb1d1e1ee3ac594a9b0883d96a995458
```

Redefine the global filters, as they to allow for full control do not merge with overrides.

## I want to configure everything myself and remove your presets

No problem just use gridMergeStrategy: reset.

```yaml
strategy:
  type: custom:area-dashboard-strategy
  config:
    gridMergeStrategy: reset
    grids: <your grids>
```

## I want to remove one of the predefined grids

Assign the grid a filter that excludes everything using [Grid Overrides](../configuration#grid-overrides):

```yaml
strategy:
  type: custom:area-dashboard-strategy
  config:
    #gridMergeStrategy: add #needs to be set but is default anyway
    grids:
      - gridId: control_media
        filter:
          exclude:
            - type: entity
              comparator: match
              value: .*
```

## I want to add my own grid above yours

Add your own [Grid](../configuration#grid) with the "position"-key:

```yaml
strategy:
  type: custom:area-dashboard-strategy
  config:
    #gridMergeStrategy: add #needs to be set but is default anyway
    grids:
      - id: control_climate
        position: -1
        card:
          type: tile
          entity: $entity
        filter:
          include:
            - type: domain
              value: climate
```

You don't need to redefine the global filters here because you are defining a new grid, not an override.

## I want to remove the colors in the navigation cards

Override the card in [Navigation](../configuration#navigation).

```yaml
strategy:
  type: custom:area-dashboard-strategy
  config:
    navigation:
      card:
        type: area
        area: $area
        navigation_path: $area#main
        aspect_ratio: 35:15
        card_mod:
          style: |
            {% if '$area' != '$currArea' %}
            hui-image {
              opacity: 0.3;
            }
            {% endif %}
```

Or like this if you want to remove all style:

```yaml
strategy:
  type: custom:area-dashboard-strategy
  config:
    navigation:
      card:
        type: area
        area: $area
        navigation_path: $area#main
        aspect_ratio: 35:15
```
