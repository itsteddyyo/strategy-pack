# UI

## UI explained

![UI Explained](/documentation/area-strategy-ui-explained.png "UI Explained")

### 1. Navigation

The Area Cards are forming a navigation menu. You can navigate the Views with a Click on the Area Card on the left Side.

You can see the Areas have a colored overlay.
I hope this helps with navigation at a glance, but honestly i also just like the look.

The currently selected Room will have no overlay to distinguish it from the others.

All the details of the area card, the overlay color and even a blacklist of areas you want to hide [can be configured](./CONFIGURATION.md#configuration-options).

>[!NOTE]
>If you want the area card to show a background image you need to [upload an image to your area.](https://www.home-assistant.io/docs/organizing/areas/#creating-an-area)

### 2. Tabs

The Entities/Cards are grouped in different tabs.

They should be used to add another logical layer to dashboard apart from the rows and make the dashboard less cluttered.

Those can be [configured freely](./CONFIGURATION.md#tabs).

### 3. Content/Rows

A Tab can contains as many rows of entities as you like. The rows are supposed to represent different domains and their entities.

For example one row for media_players and another row for switches.

The number of rows, their content, the heading and the cards used to display the entities are also completly [configurable](./CONFIGURATION.md#contentrows)

### 4. Top

The area above the navigation is completly configurable with a slot (of sorts) ["topCards"](./CONFIGURATION.md#topCards).

That means nothing is displayed there in the default configuration as this is individual.
