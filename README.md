# Strategy Pack

This is a collection of [Home Assistant Strategies](https://developers.home-assistant.io/docs/frontend/custom-ui/custom-strategy/).

A strategy is Javascript Code that gets executed to create Dashboards and Views automatically. They make it easy to have auto-populated Dashboards with next to no configuration!

The strategies can be at dashboard level generating whole dashboards with multiple views

```
type: custom:area-dashboard-strategy
other_options: ...
```

or at view level generating a single view.

```
views:
  - strategy: custom:area-view-strategy
    other_options: ...
  - other views you want...
```

The collection currently consists of 3 Strategies, but i just started and am looking forward to adding more.

## Installation

### Prerequisites

You need to install the following Custom Repos in HACS for the Strategy to work:

- [card-mod](https://github.com/thomasloven/lovelace-card-mod)
- [Layout Card](https://github.com/thomasloven/lovelace-layout-card)
- [State-Switch](https://github.com/thomasloven/lovelace-state-switch)
- [Tabbed Card](https://github.com/kinghat/tabbed-card)
- [Mushroom Cards](https://github.com/piitaya/lovelace-mushroom)

Optionally you can install:

- [Mini Graph Card](https://github.com/kalkih/mini-graph-card)

It is not really needed but gets used in the default config. So if you do not want to make your own configuration you need it.

Thanks to the developers of all of these. Could not be done without their incredible work!

### Installation with HACS

Install with HACS blabla.

### Custom Installation

Do shit

## 1. Area Strategy

The Area Strategy is a Dashboard Strategy, meaning it does not only create a single View but multiple Views at once.

It generates a Dashboard with one View per Area configured in your Home Assistant. The Dashboard contains all entities assigned to that Area (either per device or entity itself).

 ![Area Strategy](/documentation/area-strategy.gif "Area Strategy")

 You may not be able to tell it generates multiple Views because all but one are made invisible in the top menu (last 3 are other custom views).

 ![Top Menu](/documentation/area-strategy-top-menu.png "Top Menu")

This is because the navigation is meant to be made with the left-sided navigation menu.

### Usage
You need to create a new empty Dashboard for this Strategy Dashboard.

Dashboard -> Edit Dasbhoard -> Paste
```
type: custom:area-dashboard-strategy
options: ...
views:
  - any other views you want to see on your dasboard (will just be a passthrough so you can do everything like in a normal dashboard view config)
  - can be battery-view-strategy/update-view-strategy
  - or your own views (https://www.home-assistant.io/dashboards/views/)
  - or even your own strategy?
```

### Configuration
[See here](./CONFIGURATION.md)

### Navigation

The Area Cards are forming a navigation menu. You can navigate the Views with a Click on the Area Card on the left Side.

![Navigation](/documentation/area-strategy-navigation.png "Navigation")

You can see the Areas have a colored overlay.
I hope this helps with navigation at a glance but honestly i also just like the look.

The currently selected Room will have no overlay to distinguish it from the others.
The colors can be [configured](see TODO)
All the details of the area card can also be [configured](see TODO)
If you wanna hide certain areas that can also be [done](see TODO)

### Main

On the right Side you can see Entities assigned to the View-Area ("Living Room" in this case).

![Main](/documentation/area-strategy-main.png "Main")

#### <ins>Tabs</ins>

The Entities/Cards are grouped in different tabs. Those can be [configured freely](see TODO).

In the default configuration there are tabs for:

- Control
- Stats
- Camera

#### <ins>Content/Rows</ins>

A Tab can contains as many rows of entities as you like. The rows are supposed to represent different domains and their entities.

For example one row for media_players and another row for switches.

![Row](/documentation/area-strategy-main-rows.png "Row")

The number of rows, their content, the heading and the cards used to display the entities are also completly [configurable](see TOOD).

In the default configuration there are rows for:

Control:

- media_player
- cover
- vacuum
- switch and input_boolean
- select and input_select
- button and scene
- number

Stats:

- binary_sensor
- sensor (non-numeric ones)
- sensor (numeric ones)

Camera:

- camera

I skipped lights and fans because they already are controllable with the area-card in the navigation but feel free to add them to your configuration!

### Top Cards

The area above the navigation is completly configurable with a slot (of sorts) ["topCards"](see TODO).

![TopCards](/documentation/area-strategy-top-cards.png "TopCards")

With the topCards option you can pass any array of cards you like. Just like with a normal lovelace dashboard config in yaml.

### Default Config explained

There Area Cards show only device_type: occupancy as alarm icon + temperature/moisture as info.

There are 3 Tabs.

Control is for entities that can be interacted with (think media_players, buttons, selects, etc.).

![Control](/documentation/area-strategy-main-control.png "Control")

Stats is for "read-only" entities like binary_sensors and sensors.

![Stats](/documentation/area-strategy-main-stats.png "Stats")

Camera is for Camera-Streams.

![Camera](/documentation/area-strategy-main-camera.png "Camera")

## 2. Battery View Strategy

## 3. Update View Strategy

## Issues

## More

Thanks to everyone working on Home Assistant and the everyone in the community. Without your Documentation, Code and Forum Posts i could not have done this.

The design is heavily inspired by [Dwains Dashboard](https://github.com/dwainscheeren/dwains-lovelace-dashboard), as that was my first dashboard because the design and auto-population really hit a nerve with me. I wanna thank Dwain for his great work. His Dashboard is more User-friendly and works without any yaml-Knowledge so it is absolutely a better fit for many Users. Give it a look!
