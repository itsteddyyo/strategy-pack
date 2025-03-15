---
layout: page
title: Dashboard Strategies
nav_order: 2
---

# Dashboard Strategies

Dashboard Strategies are strategies that generate both a dashboard and the views within it.

### *What is a Dashboard?*

A [Dashboard](https://www.home-assistant.io/dashboards/){:target="_blank"} is a page in the navbar that you can navigate to, where you can customize its layout, cards, and other elements.

Take a look at the example image:

<img src="{{site.baseurl}}/assets/dashboard/dashboard.png" alt="Dashboard" style="max-height: 20rem;" />

- The dashboard is the element in the sidebar marked in red
- The views are the pages inside the dashboard marked in orange

A Dashboard Strategy generates both the dashboard and the views contained within it.

### *How do I generate a Dashboard with a Dashboard Strategy?*

Simply write YAML as shown in the following example.

```yaml
strategy:
  type: custom:example-dashboard-strategy
  # The configuration for this dashboard (dependent on the view; not related to HA configuration)
  config: config for this dashboard
# Home Assistant view options (currently, there are none for dashboards)
```
