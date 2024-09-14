---
layout: page
title: Configuration
parent: Grid View Strategy
---

{% capture disable_default %}
default: true
{% endcapture %}

{% assign grid_view_options = site.data.types['src/grid-view-strategy.ts'].GridViewOptions %}
{% assign row_config = site.data.types['src/grid-view-strategy.ts'].RowConfig %}
{% assign disable_default = disable_default | fromYAML %}

# Configuration

## Configuration Options

{% include configuration_required_optional.md options=grid_view_options %}

{% include table.md options=grid_view_options %}

{% include example.md options=grid_view_options type="grid-view-strategy" %}

{% include rows.md %}

{% include table.md options=row_config disable=disable_default %}

{% include example.md options=row_config %}

{% include filter.md %}
