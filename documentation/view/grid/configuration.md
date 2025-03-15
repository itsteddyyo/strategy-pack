---
layout: page
title: Configuration
parent: Grid View Strategy
nav_order: 1
---

{% assign base_grid_options = site.data.types['src/util/types.ts'].BaseGridOptions %}

{% include full_configuration.md options=base_grid_options type="grid-view-strategy" %}

{% include grids.md %}