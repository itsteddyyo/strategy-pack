---
layout: page
title: Update View Strategy
parent: View Strategies
---

{% assign type = "update-view-strategy" %}
{% assign update_view_options = site.data.types['src/update-view-strategy.ts'].UpdateViewOptions %}

# Update View Strategy

View Strategy with one page for all update entities.

<img src="{{site.baseurl}}/assets/update/update-view-strategy.png" alt="Update View Strategy" style="max-height: 20rem;" />

{% include usage.md type=type %}

{% include configuration_required_optional.md options=update_view_options %}

Modifications are possible to:

- the rows/grids in the view (number of grids, header, etc.)
