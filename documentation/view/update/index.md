---
layout: page
title: Update View Strategy
parent: View Strategies
---

{% assign type = "update-view-strategy" %}
{% assign update_view_options = site.data.types['src/update-view-strategy.ts'].UpdateViewOptions %}

# Update View Strategy

View Strategy with one page for all update entities.

![Update View Strategy](/strategy-pack/assets/update/update-view-strategy.png "Update View Strategy")

{% include usage.md type=type %}

{% include configuration_required_optional.md options=update_view_options %}

Modifications are possible to:

- the rows/grids in the view (number of grids, header, etc.)
