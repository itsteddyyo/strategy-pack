---
layout: page
title: Configuration
parent: Update View Strategy
---

{% assign update_view_options = site.data.types['src/update-view-strategy.ts'].UpdateViewOptions %}

# Configuration

## Configuration Options

{% include configuration_required_optional.md options=update_view_options %}

{% include table.md options=update_view_options %}

{% include example.md options=update_view_options type="update-view-strategy" %}

# Default Config explained

The default config is written as yaml. This should make it easy to make your own changes because it is written exactly as you would in your dashboard.

You can find it [here](https://github.com/itsteddyyo/strategy-pack/blob/main/src/config/gridDefaultConfig.yml){:target="_blank"}.

Additionally for this View Strategy the platforms options is hard-coded so it is not defined in yaml but can be overwritten!

There are Rows for:

- UniFi
- HACS
- ESPHome
- Zigbee
- Other (always present everything that is not defined in platforms!)
