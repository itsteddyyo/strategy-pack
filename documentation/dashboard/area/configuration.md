---
layout: page
title: Configuration
parent: Area Dashboard Strategy
nav_order: 1
---

{% capture disable_default %}
default: true
{% endcapture %}

{% assign area_strategy_options = site.data.types['src/area-dashboard-strategy.ts'].AreaStrategyOptions %}
{% assign tab_config = site.data.types['src/area-dashboard-strategy.ts'].TabConfig %}
{% assign disable_default = disable_default | fromYAML %}

{% include full_configuration.md options=area_strategy_options type="area-dashboard-strategy" %}

### Navigation

The cards displayed in the navigation section are generated like any other [grid](#grid).
Instead of the "$entity"-string, this section replaces the "$area"-string
Additionally, an extra variable, $currArea, holds the currently active view/area.

### Main

The tabs displayed in the main section containing the grids defined in "grids".
You can control which grids appear using the "match" key, which accepts a regular expression.

{: .note }
> The tab will only appear in the view if it contains content (at least one grid with at least one card).

{% include table.md options=tab_config disable=disable_default %}

{% include example.md options=tab_config %}

{% include grids.md %}
