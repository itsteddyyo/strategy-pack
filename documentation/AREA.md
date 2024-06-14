# Area Strategy

The Area Strategy is a Dashboard Strategy, meaning it does not only create a single view but multiple views at once.

It generates a Dashboard with one View per Area configured in your Home Assistant. The Dashboard contains all entities assigned to that Area (either via device or entity itself).

 ![Area Strategy](/documentation/area-strategy.gif "Area Strategy")

 You may not be able to tell it generates multiple Views because all but one are made invisible in the top menu (last three are other custom views).

 ![Top Menu](/documentation/area-strategy-top-menu.png "Top Menu")

This is because the navigation is meant to be made with the left-sided navigation menu.

## Usage

You need to create a new empty Dashboard for this Strategy Dashboard.

Dashboard -> Edit Dashboard -> Raw Configuration Editor (kebap menu) -> Paste the following

```yaml
strategy:
  type: custom:area-dashboard-strategy
```

This will create a Dashboard with multiple View for your specific Areas.

If you want to personalize and configure this auto-generated Dashboard, take a look at [the configuration documentation](#configuration).

## Configuration

This Strategy is completely configurable.
Modifications are possible to:

- the left-sided navigation menu (modifications to the area-card)
- the tabs in the main area (number of tabs, their names, icons, etc.)
- the content of the tabs (number of grids, header, cards in the grids, etc.)

[Details here](./CONFIGURATION.md#configuration)

There is a sensible default configuration, which is the one i myself use.
So you can start out without configuring anything and have a nice dashboard.
And if you find something you don’t like, just start configuring!

[Default Configuration explained](./CONFIGURATION.md#default-config-explained)

## UI explained

### Navigation

The Area Cards are forming a navigation menu. You can navigate the Views with a Click on the Area Card on the left Side.

![Navigation](/documentation/area-strategy-navigation.png "Navigation")

You can see the Areas have a colored overlay.
I hope this helps with navigation at a glance, but honestly i also just like the look.

The currently selected Room will have no overlay to distinguish it from the others.

All the details of the area card, the overlay color and even a blacklist of areas you want to hide [can be configured](./CONFIGURATION.md#configuration-options).

>[!NOTE]
>If you want the area card to show a background image you need to [upload an image to your area.](https://www.home-assistant.io/docs/organizing/areas/#creating-an-area)

### Main

On the right Side you can see Entities assigned to the Area in this View.

![Main](/documentation/area-strategy-main.png "Main")

#### <ins>Tabs</ins>

The Entities/Cards are grouped in different tabs. Those can be [configured freely](./CONFIGURATION.md#tabs).

In the default configuration there are tabs for:

- Control
- Stats
- Camera

#### <ins>Content/Rows</ins>

A Tab can contains as many rows of entities as you like. The rows are supposed to represent different domains and their entities.

For example one row for media_players and another row for switches.

![Row](/documentation/area-strategy-main-rows.png "Row")

The number of rows, their content, the heading and the cards used to display the entities are also completly [configurable](./CONFIGURATION.md#contentrows)

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

The area above the navigation is completly configurable with a slot (of sorts) ["topCards"](./CONFIGURATION.md).

![TopCards](/documentation/area-strategy-top-cards.png "TopCards")

With the topCards option you can pass any array of cards you like. Just like with a normal lovelace dashboard config in YAML.
