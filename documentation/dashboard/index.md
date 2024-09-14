---
layout: page
title: Dashboard Strategies
nav_order: 2
---

# Dashboard Strategies

View Strategies are Strategies that generate a single View.

### *What is a Dashboard?*

A [Dashboard](https://www.home-assistant.io/dashboards/){:target="_blank"} is a Page in the Navbar you can navigate to where you can customize the Layout, Cards you want, etc.

Take a look at the example image:

 ![Dashboard](/assets/dashboard/dashboard.png "Dashboard")

 - the Dashboard is the Thing in the Sidebar with the red mark
 - the Views are the Things inside the Dashboard with the orange mark

A Dashboard Strategy generates the Dashboard and the Views in it.

### *How do i generate a Dashboard with a Dashboard Strategy?*

You just write YAML like in the following example.

```yaml
strategy:
  type: custom:example-dashboard-strategy
  #The Config for this dashboard dependant on the view; nothing to do with HA Config
  config: config for this dashboard
#The Home Assistant View Options like:
##Currently i think there are none for dashboards
```
