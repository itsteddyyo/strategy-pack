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

The cards shown in the navigation section. This is only another [grid](#grid).
Instead of $entity this one replaces $area!
There is also an extra variable $currArea which contains the currently active view/area.

### Main

The tabs shown in the the main section.
You can control which grids are shown with the "match"-key which contains a regexp.

{: .note }
> The Tab will only be shown in the View per Area when it has content (at least 1 grid with at least 1 card).

{% include table.md options=tab_config disable=disable_default %}

{% include example.md options=tab_config %}

{% include grids.md %}
