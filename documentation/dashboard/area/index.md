---
layout: page
title: Area Dashboard Strategy
parent: Dashboard Strategies
---

{% assign type = "area-dashboard-strategy" %}
{% assign area_strategy_options = site.data.types['src/area-dashboard-strategy.ts'].AreaStrategyOptions %}

# Area Dashboard Strategy

Fully configurabe Dashboard with View per Area and auto-populating entities ordered in Grids.

<img src="{{site.baseurl}}/assets/area/area-strategy.gif" alt="Area Strategy" style="max-height: 20rem;" />
 
The dashboard was designed to be fully responsive! You can absolutely use this also on tablets or phones!

<img src="{{site.baseurl}}/assets/area/area-strategy-responsive-new.gif" alt="Area Strategy Responsive" style="max-height: 20rem;" />

The Dashboard contains all entities assigned to the Area selected in the Navigation (either via device or entity itself) that are not hidden or disabled.

Internally it uses a Filtering System many of the Strategies use to seek out the desired entities.
The filter it uses would look like this:

```yaml
include:
  - type: area
    value: your area_id
  - type: domain
    value: your_domain (for example light)
exclude:
  - type: disabled_by
    comparator: match
    value: ".*"
  - type: hidden_by
    comparator: match
    value: ".*"
```

You can add to this base-filter by adding a filter to your configuration. More is explained in the Configuration Page.

This Dashboard Strategy generates multiple Views. One per Area configured in your Home Assistant instance.

{: .note }
> You may not be able to tell it generates multiple Views because all but one are made invisible in the top menu.
>
> <img src="{{site.baseurl}}/assets/area/area-strategy-top-menu.png" alt="Top Menu" style="max-height: 20rem;" />
>
> This is because the navigation is meant to be made with the left-sided navigation menu.

{% include usage.md type=type %}

{% include configuration_required_optional.md options=area_strategy_options %}

Modifications are possible to:

- the left-sided navigation menu (modifications to the area-card)
- the tabs in the main area (number of tabs, their names, icons, etc.)
- the content of the tabs (number of grids, titles, cards in the grids, etc.)

{: .note }
> If you’re looking to add a single row or tab without changing the whole default configuration, you can do it like this!
>
> ````yaml
> strategy:
>   type: custom:area-dashboard-strategy
>   config:
>     tabs:
>       - title: Control
>         icon: mdi:button-pointer
>         rows:
>             - title: Lights
>               filter:
>                   include:
>                       - type: domain
>                         value: light
>               card:
>                   type: tile
>                   entity: $entity
>             - ~Cover
>             - ~Media
>       - ~Control
>       - ~Camera
> ```
>
> You can reference Tab and Row entries from the [default config](https://github.com/itsteddyyo/strategy-pack/blob/main/src/config/areaDefaultConfig.yml){:target="_blank"} by just writing '~' + title of Row/Tab. With that you can easily change a single Tab/Row while just referencing the others. No need to copy everthing anymore!
