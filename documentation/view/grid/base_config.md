---
layout: page
title: Base Config Explained
parent: Grid View Strategy
---

{% assign config = site.data.grid %}

{% include base_config.md config="gridDefaultConfig" %}

### Global

Everything under the "global" key is defined so you do not to define it again on your grids.
If you want other options just provide your own "global" key in your config.

Global [Filter](#filter) and [Sort](#sort) are described below.

#### Filter

The base config filters out every entity that has has been hidden or disabled.
Additionally entities that have a "hidden" label will get filtered out.

```yaml
{{ config.global.filter | toYAML }}
```

#### Sort

The entities get filtered by multiple "sorts". That means they get sorted by the first of the sort, if they are the same the second, if they are the same again the third and so on.

They get sorted like this:

1. label: sorted by a label matching the regexp = a label called Sort:1, Sort:2, Sort:3, ...
2. area: the id of the area
3. integration: the id of the integration
4. entity: the id of the entity

```yaml
{{ config.global.sort | toYAML }}
```
