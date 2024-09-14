---
layout: page
title: Log View Strategy
parent: View Strategies
---

{% assign type = "log-view-strategy" %}
{% assign log_view_options = site.data.types['src/log-view-strategy.ts'].LogViewOptions %}

# Log View Strategy

View Strategy with one page for displaying accumulated log entries for fully configurable groups of entitites.

 ![Log View Strategy](/strategy-pack/assets/log/log-view-strategy.gif "Log View Strategy")

{% include usage.md type=type %}

{% include configuration_required_optional.md options=log_view_options %}

Modifications are possible to:

- the number of log presets
- the entities included in the single presets
