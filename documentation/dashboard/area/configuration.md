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

## Navigation

## Main

The tabs shown in the the main section.

Define as many Tabs as you want.
The Tab will only be shown in the View per Area when it has content.

Example: if the Living Room has a Tab where none of the rows would have entities (like Camera, which has only one row and can easily be empty) the whole Tab is hidden.

{% include table.md options=tab_config disable=disable_default %}

{% include example.md options=tab_config %}

{% include grids.md %}
