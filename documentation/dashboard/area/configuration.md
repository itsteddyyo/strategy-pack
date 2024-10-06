---
layout: page
title: Configuration
parent: Area Dashboard Strategy
---

{% capture disable_default %}
default: true
{% endcapture %}

{% assign area_strategy_options = site.data.types['src/area-dashboard-strategy.ts'].AreaStrategyOptions %}
{% assign tab_config = site.data.types['src/area-dashboard-strategy.ts'].TabConfig %}
{% assign row_config = site.data.types['src/area-dashboard-strategy.ts'].RowConfig %}
{% assign disable_default = disable_default | fromYAML %}

# Configuration

## Configuration Options

{% include configuration_required_optional.md options=area_strategy_options %}

{% include table.md options=area_strategy_options %}

{% include example.md options=area_strategy_options type="area-dashboard-strategy" %}

## Tabs

The tabs shown in the the main section.

Define as many Tabs as you want.
The Tab will only be shown in the View per Area when it has content.

Example: if the Living Room has a Tab where none of the rows would have entities (like Camera, which has only one row and can easily be empty) the whole Tab is hidden.

{% include table.md options=tab_config disable=disable_default %}

{% include example.md options=tab_config %}

{% include rows.md %}

{% include table.md options=row_config disable=disable_default %}

{% include example.md options=row_config %}

{% include filter.md %}

# Default Config explained

The default config is written as yaml. This should make it easy to make your own changes because it is written exactly as you would in your dashboard.

You can find it [here](https://github.com/itsteddyyo/strategy-pack/blob/main/src/config/areaDefaultConfig.yml){:target="_blank"}.

The Area Cards shows only device_type: occupancy as an alarm icon and temperature as info.

![Area Card](/strategy-pack/assets/area/area-strategy-navigation.png "Area Card")

There are 3 Tabs.

1. Control is for entities that can be interacted with (think media_players, buttons, selects, etc.).

![Control](/strategy-pack/assets/area/area-strategy-main-control.png "Control")

There are Rows for:

- alarm_control_panel
- media_player
- light
- fan
- cover
- vacuum
- switch and input_boolean
- select and input_select
- button and scene
- number

2. Stats is for "read-only" entities like binary_sensors and sensors.

![Stats](/strategy-pack/assets/area/area-strategy-main-stats.png "Stats")

There are Rows for:

- binary_sensor
- sensor (non-numeric ones)
- sensor (numeric ones)

3. Camera is for Camera-Streams.

![Camera](/strategy-pack/assets/area/area-strategy-main-camera.png "Camera")

There are Rows for:

- camera
