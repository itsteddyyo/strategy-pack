---
layout: page
title: Grid View Strategy
parent: View Strategies
---

{% assign type = "grid-view-strategy" %}
{% assign base_grid_options = site.data.types['src/util/types.ts'].BaseGridOptions %}

# Grid View Strategy

Strategy fully customizable with custom rows. You can create auto-populating Dashboards where you can display anything you like with little configuration!

<img src="{{site.baseurl}}/assets/grid/grid-view-strategy.png" alt="Grid View Strategy" style="max-height: 20rem;" />

{% include usage.md type=type %}

{% include configuration_required_optional.md options=base_grid_options %}
