# Strategy Pack

[![Open in HACS at your Home Assistant instance.][hacsBadge]][strategyPackHacs]

This is a collection of [Home Assistant Strategies](https://developers.home-assistant.io/docs/frontend/custom-ui/custom-strategy/).

A strategy is Javascript code that gets executed to create Dashboards and Views automatically. They make it easy to have auto-populated Dashboards with next to no configuration!

The strategies can be at the dashboard level, generating whole dashboards with multiple views:

```yaml
strategy:
  type: custom:example-dashboard-strategy
  options_and_config_for_this_dashboard: ...
homeassistant_dashboard_options: ...
```

or at the view level, generating a single view in an already existing dashboard.

```yaml
views:
  - strategy: 
      type: custom:example-view-strategy
      options_and_config_for_this_view: ...
    homeassistant_view_options: ...
  - other views you want...
```

The collection currently consists of 3 Strategies (with Area Dashboard Strategy being the main one), but I just started and am looking forward to adding more if there's demand.

>[!NOTE]
>If you want to sort anything in the strategies, you can use "Label Sort".<br>
>It works currently on areas (=sort of navigation areas and views overall) and entities (=sort in the grid).<br>
>Just create Labels with the exact name as below (Sort:1, Sort:2, ... as many as you want) and assign them.<br>
>![Label Sort](/documentation/area-strategy-label-sort.png "Label Sort")

## 1. Area Dashboard Strategy

Fully configurabe Dashboard with View per Area and auto-populating entities ordered in Grids.

 ![Area Strategy](/documentation/area-strategy.gif "Area Strategy")
 
 The dashboard was designed to be fully responsive! You can absolutely use this also on tablets or phones!

 ![Area Strategy Responsive](/documentation/area-strategy-responsive.gif "Area Strategy Responsive")

The Dashboard contains all entities assigned to that Area (either via device or entity itself).

 You may not be able to tell it generates multiple Views because all but one are made invisible in the top menu.

 ![Top Menu](/documentation/area-strategy-top-menu.png "Top Menu")

This is because the navigation is meant to be made with the left-sided navigation menu.

[More on the Design: UI explained](./documentation/UI.md)

### Usage

You need to create a new empty Dashboard for this Strategy Dashboard.

Dashboard -> Edit Dashboard -> Raw Configuration Editor (kebap menu) -> Paste the following

```yaml
strategy:
  type: custom:area-dashboard-strategy
```

This will create a Dashboard with multiple Views for your specific Areas.

### Configuration

This Strategy is completely configurable.
Modifications are possible to:

- the left-sided navigation menu (modifications to the area-card)
- the tabs in the main area (number of tabs, their names, icons, etc.)
- the content of the tabs (number of grids, header, cards in the grids, etc.)

[All Configration Options here](./documentation/CONFIGURATION.md#configuration)

There is a sensible default configuration, which is the one i myself use.
So you can start out without configuring anything and have a nice dashboard.
And if you find something you don’t like, just start configuring!

[Default Configuration explained](./documentation/CONFIGURATION.md#default-config-explained)

## 2. Battery View Strategy

View Strategy with one page for all battery entities.

 ![Battery View Strategy](/documentation/battery-view-strategy.png "Battery View Strategy")

### Usage

You add this to already existing dashboards as an extra view.

Dashboard -> Edit Dashboard -> Raw Configuration Editor (kebap menu) -> Add the following

```yaml
... (existing dashboard)
views:
  - strategy:
      type: custom:battery-view-strategy
```

>[!NOTE]
>At the moment there is no configuration possible, but i have it on my list.

## 3. Update View Strategy

View Strategy with one page for all update entities.

 ![Update View Strategy](/documentation/update-view-strategy.png "Update View Strategy")

### Usage

You add this to already existing dashboards as an extra view.

Dashboard -> Edit Dashboard -> Raw Configuration Editor (kebap menu) -> Add the following

```yaml
... (existing dashboard)
views:
  - strategy:
      type: custom:update-view-strategy
```

>[!NOTE]
>At the moment there is no configuration possible, but I have it on my list.

## Installation

[Installation Instructions here](./documentation/INSTALLATION.md)

## Credits

Thanks to everyone working on Home Assistant and the everyone in the community. Without your documentation, code, and forum posts, I wouldn't have even thought about this.

The design is heavily inspired by [Dwains Dashboard][dwainsDashboard], as that the first more advanced dashboard i used because the design and auto-population really hit a nerve with me. I wanna thank Dwain for his great work. His Dashboard is more User-friendly and works without any yaml-Knowledge so it is absolutely a better fit for many Users. Give it a try!

Also have a look at [Mushroom Strategy][mushroomStrategy], which has a very similar concept to the Area Strategy. I must admit i also shamelessly copied their installation instructions.

<!-- Badge References -->
[hacsBadge]: https://my.home-assistant.io/badges/hacs_repository.svg
<!-- URL References -->
[strategyPackHacs]: https://my.home-assistant.io/redirect/hacs_repository/?owner=itsteddyyo&repository=strategy-pack&category=lovelace
<!-- Credit References -->
[dwainsDashboard]: https://github.com/dwainscheeren/dwains-lovelace-dashboard
[mushRoomStrategy]: https://github.com/AalianKhan/mushroom-strategy
