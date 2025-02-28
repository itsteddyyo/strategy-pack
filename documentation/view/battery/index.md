---
layout: page
title: Battery View Strategy
parent: View Strategies
---

{% assign type = "battery-view-strategy" %}
{% assign battery_view_options = site.data.types['src/battery-view-strategy.ts'].BatteryViewOptions %}

# Battery View Strategy

View Strategy with one page for all battery entities.

<img src="{{site.baseurl}}/assets/battery/battery-view-strategy.png" alt="Battery View Strategy" style="max-height: 20rem;" />

{% include usage.md type=type %}

{% include configuration_required_optional.md options=battery_view_options %}

Modifications are possible to:

- the rows/grids in the view (number of grids, header, etc.)
