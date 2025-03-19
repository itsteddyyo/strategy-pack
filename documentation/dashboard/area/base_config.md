---
layout: page
title: Base Config Explained
parent: Area Dashboard Strategy
---

{% assign config = site.data.area %}

{% include base_config.md config="areaDefaultConfig" %}

## Anchors

These are just [YAML anchors](https://smcleod.net/2022/11/yaml-anchors-and-aliases/). I use them to deduplicate similar config for the grids. You can use YAML anchors in your Home Assistant Configs too if you want! (Just note that you can not use those anchors i defined in my config (actions-info-ref, etc.)! They get resolved on a lower level so that will not work.)

```yaml
{{ config.anchors | toYAML }}
```

## Global

Everything under the "global" key is defined so you do not to define it again on your grids.
If you want other options just provide your own "global" key in your config.

Global [Filter](#filter) and [Sort](#sort) are described below.

```yaml
{% assign exclude = "filter,sort" | split: ',' %}
{{ config.global | toYAMLExclude: exclude }}
```

### Filter

The base config filters out every entity that has has been hidden or disabled.
Additionally entities that have a "hidden" label will get filtered out.

```yaml
{{ config.global.filter | toYAML }}
```

### Sort

The entities get filtered by multiple "sorts". That means they get sorted by the first of the sort, if they are the same the second, if they are the same again the third and so on.

They get sorted like this:

1. label: sorted by a label matching the regexp = a label called Sort:1, Sort:2, Sort:3, ...
2. integration: the id of the integration
3. entity: the id of the entity

```yaml
{{ config.global.sort | toYAML }}
```

## Grids

This is just one example grid. Most of them have just domain as filter applied as the rest gets merged in from global. The most part of the card gets merged in from the YAML anchors and the rest is manually defined. The id is "control_alarm". Why that matters you can see at [Main](#main).

```yaml
{{ config.grids[0] | toYAML }}
```

## Navigation

Navigation is just another grid with filters, sort, card and so on.
Here i needed to define everything as global just gets merged with "grids"-key and not here!

Areas with a label "hidden" get filtered out.

They get sorted like this:

1. label: sorted by a label matching the regexp = a label called Sort:1, Sort:2, Sort:3, ...
2. floor: the id of the floor
3. area: the id of the area

```yaml
{{ config.navigation | toYAML }}
```

As card the area card is used. With card_mod i apply a background color effect so each area has other colors for easier recognizability at a glance.
The current area will have no such effect to be easily made out.

<img src="{{site.baseurl}}/assets/area/area-strategy-navigation.png" alt="Area Card" style="max-height: 20rem;" />

## Main

In main you just filter the grids in their tabs with the help of a regex.

So with "^control_.*$" you match all grids starting with "control_" like "control_alarm" for example.

```yaml
{{ config.main | toYAML }}
```

There are 3 Tabs:

 - Control is for entities that can be interacted with (think media_players, buttons, selects, etc.).

<img src="{{site.baseurl}}/assets/area/area-strategy-main-control.png" alt="Control" style="max-height: 20rem;" />

 - Stats is for "read-only" entities like binary_sensors and sensors.

<img src="{{site.baseurl}}/assets/area/area-strategy-main-stats.png" alt="Stats" style="max-height: 20rem;" />

 - Camera is for Camera-Streams.

<img src="{{site.baseurl}}/assets/area/area-strategy-main-camera.png" alt="Camera" style="max-height: 20rem;" />
