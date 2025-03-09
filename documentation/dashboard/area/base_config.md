---
layout: page
title: Base Config Explained
parent: Area Dashboard Strategy
---

{% assign config = site.data.area %}

{% include base_config.md config="areaDefaultConfig" %}

## Global

{% include global.md %}

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

## Navigation

```yaml
{{ config.navigation | toYAML }}
```

<img src="{{site.baseurl}}/assets/area/area-strategy-navigation.png" alt="Area Card" style="max-height: 20rem;" />

## Main

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
