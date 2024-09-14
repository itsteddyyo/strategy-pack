---
layout: page
title: Configuration
parent: Battery View Strategy
---

{% assign battery_view_options = site.data.types['src/battery-view-strategy.ts'].BatteryViewOptions %}

# Configuration

## Configuration Options

{% include configuration_required_optional.md options=battery_view_options %}

{% include table.md options=battery_view_options %}

{% include example.md options=battery_view_options type="battery-view-strategy" %}

# Default Config explained

The default config is written as yaml. This should make it easy to make your own changes because it is written exactly as you would in your dashboard.

You can find it [here](https://github.com/itsteddyyo/strategy-pack/blob/main/src/config/gridDefaultConfig.yml){:target="_blank"}.

Additionally for this View Strategy the platforms options is hard-coded so it is not defined in yaml but can be overwritten!

There are Rows for:

- Zigbee
- Switchbot
- Other (always present everything that is not defined in platforms!)
