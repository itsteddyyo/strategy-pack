---
layout: page
title: Grid View Strategy
parent: View Strategies
---

{% assign type = "grid-view-strategy" %}
{% assign grid_view_options = site.data.types['src/grid-view-strategy.ts'].GridViewOptions %}

# Grid View Strategy

Strategy fully customizable with custom rows. You can create auto-populating Dashboards where you can display anything you like with little configuration! Could be used to implement Battery/Update Strategy or something like that.

![Grid View Strategy](/strategy-pack/assets/grid/grid-view-strategy.png "Grid View Strategy")

{% include usage.md type=type %}

{% include configuration_required_optional.md options=grid_view_options %}

Modifications are possible to:

- the rows/grids in the view (number of grids, header, etc.)
