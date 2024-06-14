# Strategy Pack

[![Open in HACS at your Home Assistant instance.][hacsBadge]][strategyPackHacs]

This is a collection of [Home Assistant Strategies](https://developers.home-assistant.io/docs/frontend/custom-ui/custom-strategy/).

A strategy is Javascript Code that gets executed to create Dashboards and Views automatically. They make it easy to have auto-populated Dashboards with next to no configuration!

The strategies can be at dashboard level generating whole dashboards with multiple views

```yaml
type: custom:area-dashboard-strategy
other_options: ...
```

or at view level generating a single view in an already existing dashboard.

```yaml
views:
  - strategy: custom:area-view-strategy
    other_options: ...
  - other views you want...
```

The collection currently consists of 3 Strategies (with Area Dashboard Strategy being the main one), but i just started and am looking forward to adding more if theres demand.

>[!NOTE]
>If you want to sort anything in the strategies you can use "Label Sort".<br>
>It works currently on areas (=sort of navigation areas and views overall) and entities (=sort in the grid).<br>
>Just create Labels with the exact name as below (Sort:1,Sort:2,... as many as you want) and assign them.<br>
>![Label Sort](/documentation/area-strategy-label-sort.png "Label Sort")

## 1. Area Dashboard Strategy

Fully configurabe Dashboard with View per Area and auto-populating entities ordered in Grids.

[Click for more Information](./documentation/AREA.md)

 ![Area Strategy](/documentation/area-strategy.gif "Area Strategy")

 The dashboard was designed to be fully responsive! You can absolutely use this also on tablets or phones!

 ![Area Strategy Responsive](/documentation/area-strategy-responsive.gif "Area Strategy Responsive")

## 2. Battery View Strategy

View Strategy with one page for all battery entities.

 ![Battery View Strategy](/documentation/battery-view-strategy.png "Battery View Strategy")

### Usage

You add this to already existing dashboards as an extra view.

Dashboard -> Edit Dashboard -> Add the following

```yaml
... (existing dashboard)
views:
  - type: custom:battery-view-strategy
```

>[!NOTE]
>At the moment there is no configuration possible, but i have it on my list.

## 3. Update View Strategy

View Strategy with one page for all update entities.

 ![Update View Strategy](/documentation/update-view-strategy.png "Update View Strategy")

### Usage

You add this to already existing dashboards as an extra view.

Dashboard -> Edit Dashboard -> Add the following

```yaml
... (existing dashboard)
views:
  - type: custom:update-view-strategy
```

>[!NOTE]
>At the moment there is no configuration possible, but i have it on my list.

## Installation

### Prerequisites

You need to install the following Frontend Components from HACS for the Strategy to work:

- [card-mod][cardMod]

  [![Open in HACS at your Home Assistant instance.][hacsBadge]][cardModHacs]

- [Layout Card][layoutCard]

  [![Open in HACS at your Home Assistant instance.][hacsBadge]][layoutCardHacs]

- [State-Switch][stateSwitch]

  [![Open in HACS at your Home Assistant instance.][hacsBadge]][stateSwitchHacs]

- [Tabbed Card][tabbedCard]

  [![Open in HACS at your Home Assistant instance.][hacsBadge]][tabbedCardHacs]

- [Mushroom Cards][mushroomCards]

  [![Open in HACS at your Home Assistant instance.][hacsBadge]][mushroomCardsHacs]

Optionally you can install:

- [Mini Graph Card][miniGraphCard]

  [![Open in HACS at your Home Assistant instance.][hacsBadge]][miniGraphCardHacs]

It is not really needed for the strategy to run but gets used in the default config for the Area-Dashboard/View-Strategy and is used in the Battery-View-Strategy.

Thanks to the developers of all of these. Could not be done without their incredible work!

### HACS

Click the badge below.

[![Open in HACS at your Home Assistant instance.][hacsBadge]][strategyPackHacs]

or ...

1. Open HACS in Home Assistant.
2. Go to the "Frontend" section.
3. Click the button with the `+` icon.
4. Search for "Strategy Pack" and install.

### Manual

1. Download `strategy-pack.es.js` file from the [`dist`](./dist/) directory.

2. Save this file into your `config/www` folder on your Home Assistant instance.

3. Add a reference to `strategy-pack.es.js` in Dashboard. There are two ways to do that:

>[!NOTE]
>If you do not see the Resources menu, you will need to enable _Advanced Mode_ in your _User Profile_.

   1. **Using UI:** Click the badge...

      [![Open your Home Assistant instance and show your dashboard resources.][resourcesBadge]][resourcesUrl]

      or...

      - Go to _Settings_ → _Dashboards_ → _More Options icon_ → _Resources_ → _Add Resource_ → Set _Url_
        to `/local/strategy-pack.es.js` → Set _Resource type_ to `JavaScript Module`.

   2. **Using YAML:** Add the following code to the `lovelace` section.

      ```yaml
      resources:
        - url: /local/strategy-pack.es.js
          type: module
      ```

## Credits

Thanks to everyone working on Home Assistant and the everyone in the community. Without your Documentation, Code and Forum Posts i wouldn`t have even thought about this.

The design is heavily inspired by [Dwains Dashboard][dwainsDashboard], as that the first more advanced dashboard i used because the design and auto-population really hit a nerve with me. I wanna thank Dwain for his great work. His Dashboard is more User-friendly and works without any yaml-Knowledge so it is absolutely a better fit for many Users. Give it a try!

Also have a look at [Mushroom Strategy][mushroomStrategy], which has a very similar concept to the Area Strategy. I must admit i also shamelessly copied their installation instructions.

<!-- Badge References -->
[hacsBadge]: https://my.home-assistant.io/badges/hacs_repository.svg
[resourcesBadge]: https://my.home-assistant.io/badges/lovelace_resources.svg
[resourcesUrl]: https://my.home-assistant.io/redirect/lovelace_resources
[strategyPackHacs]: https://my.home-assistant.io/redirect/hacs_repository/?owner=itsteddyyo&repository=strategy-pack&category=frontend
<!-- Installation References -->
[cardMod]: https://github.com/thomasloven/lovelace-card-mod
[layoutCard]: https://github.com/thomasloven/lovelace-layout-card
[stateSwitch]: https://github.com/thomasloven/lovelace-state-switch
[tabbedCard]: https://github.com/kinghat/tabbed-card
[mushroomCards]: https://github.com/piitaya/lovelace-mushroom
[miniGraphCard]: https://github.com/kalkih/mini-graph-card

[cardModHacs]: https://my.home-assistant.io/redirect/hacs_repository/?owner=thomasloven&repository=lovelace-card-mod&category=frontend
[layoutCardHacs]: https://my.home-assistant.io/redirect/hacs_repository/?owner=thomasloven&repository=lovelace-layout-card&category=frontend
[stateSwitchHacs]: https://my.home-assistant.io/redirect/hacs_repository/?owner=thomasloven&repository=lovelace-state-switch&category=frontend
[tabbedCardHacs]: https://my.home-assistant.io/redirect/hacs_repository/?owner=kinghat&repository=tabbed-card&category=frontend
[mushroomCardsHacs]: https://my.home-assistant.io/redirect/hacs_repository/?owner=piitaya&repository=lovelace-mushroom&category=frontend
[miniGraphCardHacs]: https://my.home-assistant.io/redirect/hacs_repository/?owner=kalkih&repository=mini-graph-card&category=frontend
<!-- Credit References -->
[dwainsDashboard]: https://github.com/dwainscheeren/dwains-lovelace-dashboard
[mushRoomStrategy]: https://github.com/AalianKhan/mushroom-strategy
