---
layout: page
title: Configuration
parent: Log View Strategy
---

{% capture disable_default %}
default: true
{% endcapture %}

{% assign log_view_options = site.data.types['src/log-view-strategy.ts'].LogViewOptions %}
{% assign log_preset = site.data.types['src/log-view-strategy.ts'].LogPreset %}
{% assign disable_default = disable_default | fromYAML %}

# Configuration

## Configuration Options

{% include configuration_required_optional.md options=log_view_options %}

{% include table.md options=log_view_options %}

{% include example.md options=log_view_options type="log-view-strategy" %}

## Log Preset

Defines the Button on the side and which entities will be loaded in the Log Card when the Preset Button is clicked.

Define as many Log Presets as you want.

{% include table.md options=log_view_options disable=disable_default %}

{% include example.md options=log_view_options %}

{% include filter.md %}
