

# Configuration

## Configuration Options

<details>
<summary>Click for Configuration Options</summary>

<table>
  <thead>
    <tr><th>option</th><th>description</th><th>type</th><th>required</th><th>default</th><th>example</th></tr>
  </thead>
  <tbody>
    <tr><td>tabs</td><td>Tabs shown in the main area. <a href="#tabs">More</a><blockquote>You can also reference tab entries from the <a href="/src/config/areaDefaultConfig.yml">default config</a> by just writing ~ + title of tab.
With that you can easily change a single tab while just referencing the other without the need to copy the whole config. Example: - ~Stats instead of whole config</blockquote></td><td>Array</td><td>yes</td><td>
<a href="/src/config/areaDefaultConfig.yml#L2">set</a>
</td><td>
        <pre>
tabs:
  - label: Test
    icon: mdi:test
    rows:
      - rowConfig here
  - ~Camera
  - ~Stats
</pre>
      </td></tr>
    <tr><td>areaColors</td><td>Overlay Colors for navigation area. Must be in the form of a rgba css-value. rgb defines the color and the a-channel defines transparency.<blockquote>The colors get repeated when you have more areas than colors. Leave empty for no overlay.</blockquote></td><td>Array</td><td>yes</td><td>
<a href="/src/config/areaDefaultConfig.yml#L253">set</a>
</td><td>
        <pre>
areaColors:
  - rgba(0,0,0,0.5)
</pre>
      </td></tr>
    <tr><td>areaCardConfig</td><td>The config for the area card.<blockquote>Options type, area, navigation_path are not allowed!</blockquote></td><td>Object</td><td>yes</td><td>
<a href="/src/config/areaDefaultConfig.yml#L246">set</a>
</td><td>
        <pre>
areaCardConfig:
  aspect_ratio: 1:1
</pre>
      </td></tr>
    <tr><td>areaBlacklist</td><td>Which areas should be ignored (no views generated/not shown in navigation)</td><td>Array</td><td>no</td><td>-</td><td>
        <pre>
areaBlacklist:
  - living_room
  - bathroom
</pre>
      </td></tr>
    <tr><td>topCards</td><td>Slot for cards above navigation. <a href="#topCards">More</a></td><td>Array</td><td>no</td><td>-</td><td>
        <pre>
topCards:
  - type: entity
    entities:
      - button.test
      - button.test2
</pre>
      </td></tr>
    <tr><td>extraViews</td><td>You can pass any extra views you want on the dashboard.</td><td>Array</td><td>no</td><td>-</td><td>
        <pre>
extraViews:
  - strategy:
      type: custom:battery-view-strategy
    icon: mdi:test
    path: test
    title: Test
</pre>
      </td></tr>
    <tr><td>minColumnWidth</td><td>Minimal Column Width in the Grid = The Minimal Width of the Cards.</td><td>number</td><td>yes</td><td>
<a href="/src/config/areaDefaultConfig.yml#L1">set</a>
</td><td>
        <pre>
minColumnWidth: 300
</pre>
      </td></tr>
    <tr><td>replaceCards</td><td>You can set a card to be used for a specific entity. Overwrites default card config</td><td>Object</td><td>no</td><td>-</td><td>
        <pre>
replaceCards:
  button.test:
    type: entity
    entities:
      - $entity
</pre>
      </td></tr>
  </tbody>
</table>

</details>
<br />

So a valid configuration could look like this:

```yaml
strategy:
  type: custom:area-dashboard-strategy
  config:
    tabs:
      - label: Test
        icon: mdi:test
        rows:
          - rowConfig here
      - ~Camera
      - ~Stats
    areaColors:
      - rgba(0,0,0,0.5)
    areaCardConfig:
      aspect_ratio: 1:1
    areaBlacklist:
      - living_room
      - bathroom
    topCards:
      - type: entity
        entities:
          - button.test
          - button.test2
    extraViews:
      - strategy:
          type: custom:battery-view-strategy
        icon: mdi:test
        path: test
        title: Test
    minColumnWidth: 300
    replaceCards:
      button.test:
        type: entity
        entities:
          - $entity

```

I used all available options in this example. You don`t need to do this!

More on the default configuration [here](#default-config-explained)

## Tabs

The tabs shown in the the main section.

Define as many Tabs as you want.
The Tab will only be shown in the View per Area when it has content.

Example: if the Living Room has a Tab where none of the rows would have entities (like Camera, which has only one row and can easily be empty) the whole Tab is hidden.

<details>
<summary>Click for Configuration Options</summary>

<table>
  <thead>
    <tr><th>option</th><th>description</th><th>type</th><th>required</th><th>example</th></tr>
  </thead>
  <tbody>
    <tr><td>title</td><td>Title shown in the Tab</td><td>string</td><td>yes</td><td>
        <pre>
title: Test
</pre>
      </td></tr>
    <tr><td>icon</td><td>Icon shown in the Tab</td><td>string</td><td>yes</td><td>
        <pre>
icon: mdi:test
</pre>
      </td></tr>
    <tr><td>rows</td><td>The grid rows definition of the tab. <a href="#contentrows">More</a><blockquote>You can also reference row entries from the <a href="/src/config/areaDefaultConfig.yml">default config</a> by just writing ~ + title of row.
With that you can easily change a single row while just referencing the other without the need to copy the whole config. Example: - ~Buttons instead of whole config</blockquote></td><td>Array</td><td>yes</td><td>
        <pre>
rows:
  - title: test
    domain: media_player
    card:
      type: tile
    filter:
      - filterConfig here
  - ~Switches
  - title: test2
    domain: sensor
    card:
      type: tile
    filter:
      - filterConfig here
  - ~Buttons
  - ~Alerts
</pre>
      </td></tr>
  </tbody>
</table>

</details>
<br />

So a valid configuration could look like this:

```yaml
title: Test
icon: mdi:test
rows:
  - title: test
    domain: media_player
    card:
      type: tile
    filter:
      - filterConfig here
  - ~Switches
  - title: test2
    domain: sensor
    card:
      type: tile
    filter:
      - filterConfig here
  - ~Buttons
  - ~Alerts

```

I used all available options in this example. You don`t need to do this!

## Content/Rows

Define the Rows in the Tab.
Every Row consists of a (optional) title and a Grid with all the cards for the entities.
The row is defined by:

<details>
<summary>Click for Configuration Options</summary>

<table>
  <thead>
    <tr><th>option</th><th>description</th><th>type</th><th>required</th><th>example</th></tr>
  </thead>
  <tbody>
    <tr><td>domain</td><td>Domain or Array of domains the entity must belong to.<blockquote>Is deprecated (will be removed in a future release) and will internally be converted to a <a href="#filter">include filter</a></blockquote></td><td></td><td>yes</td><td>
        <pre>
domain:
  - button
  - media_player
</pre>
      </td></tr>
    <tr><td>title</td><td>Title shown over Grid. Will not be rendered when not set.</td><td>string</td><td>no</td><td>
        <pre>
title: Buttons
</pre>
      </td></tr>
    <tr><td>filter</td><td>Define include and exclude function for more fine-grained control of entities selected for row than only domain.<blockquote>A entity needs to match all include filters to be included but it needs only to match one of the exclude filters to be excluded!</blockquote></td><td></td><td>no</td><td>
        <pre>
filter:
  include:
    - type: domain
      value: binary_sensor
    - type: state
      value: on
  exclude:
    - type: entity
      value: sensor.test123
    - type: is_null
    - type: area
      value: living_room
</pre>
      </td></tr>
    <tr><td>card</td><td>The cardConfig of the card that should be rendered for every entity in the grid. You can use all cards you would normally use in your dashboard!<blockquote>You can insert the entityId of the entity with the $entity variable which will be replaced in the whole object by the entities entity_id.</blockquote></td><td>Object</td><td>yes</td><td>
        <pre>
card:
  type: tile
  entity: $entity
  iconColor: red
</pre>
      </td></tr>
  </tbody>
</table>

</details>
<br />

So a valid configuration could look like this:

```yaml
domain:
  - button
  - media_player
title: Buttons
filter:
  include:
    - type: domain
      value: binary_sensor
    - type: state
      value: on
  exclude:
    - type: entity
      value: sensor.test123
    - type: is_null
    - type: area
      value: living_room
card:
  type: tile
  entity: $entity
  iconColor: red

```

I used all available options in this example. You don`t need to do this!

### Filter

Filters can be defined for more fine-grained control which entities should be matched.
You can use both include and exclude as keys.

```yaml
filter:
  include:
    - ...
  exclude:
    - ...
```

Both accept the same types and syntax.

>[!NOTE]
>A entity needs to match all include filters to be included but it needs only to match one of the exclude filters to be excluded!

The filter object looks like this.

<details>
<summary>Click for Configuration Options</summary>

<table>
  <thead>
    <tr><th>option</th><th>description</th><th>type</th><th>required</th><th>example</th></tr>
  </thead>
  <tbody>
    <tr><td>type</td><td>The type of filter to determine the value or just specify the filter</td><td>Object</td><td>yes</td><td>
        <pre>
type: state
</pre>
      </td></tr>
    <tr><td>comparator</td><td>The comparator to use to compare the left value (the value in the entity described by the type) and the right value (the user specified value)</td><td>Object</td><td>no</td><td>
        <pre>
comparator: equal
</pre>
      </td></tr>
    <tr><td>value</td><td>The user specified value</td><td>unknown</td><td>no</td><td>
        <pre>
value: on
</pre>
      </td></tr>
  </tbody>
</table>

</details>
<br />

So a valid configuration could look like this:

```yaml
type: state
comparator: equal
value: on

```

I used all available options in this example. You don`t need to do this!

#### Filter Type

These are the options for filter type.

<details>
<summary>Click for Configuration Options</summary>

<table>
  <thead>
    <tr><th>option</th><th>description</th><th>example</th></tr>
  </thead>
  <tbody>
    <tr><td>entity</td><td>Filter on the entity_id of the entity.</td><td>
        <pre>
- type: entity
  comparator: equal
  value: sensor.test123
</pre>
      </td></tr>
    <tr><td>domain</td><td>Filter on the domain of the entity.</td><td>
        <pre>
- type: domain
  comparator: equal
  value: sensor
</pre>
      </td></tr>
    <tr><td>device</td><td>Filter on the parent device_id of the entity.</td><td>
        <pre>
- type: device
  comparator: equal
  value: 98b750a482bbf28ea959269981813219
</pre>
      </td></tr>
    <tr><td>area</td><td>Filter on the area_id of the entity.</td><td>
        <pre>
- type: area
  comparator: equal
  value: living_room
</pre>
      </td></tr>
    <tr><td>integration</td><td>Filter on the integration of the entity.</td><td>
        <pre>
- type: integration
  comparator: equal
  value: mqtt
</pre>
      </td></tr>
    <tr><td>label</td><td>Filter on the label of the entity.</td><td>
        <pre>
- type: label
  comparator: equal
  value: sort_1
</pre>
      </td></tr>
    <tr><td>state</td><td>Filter on the state of the entity.</td><td>
        <pre>
- type: state
  comparator: equal
  value: on
</pre>
      </td></tr>
    <tr><td>attribute</td><td>Filter on an attribute of the entity.</td><td>
        <pre>
- type: attribute
  comparator: equal
  value:
    key: volume
    value: 100
</pre>
      </td></tr>
    <tr><td>disabled_by</td><td>Filter on the disabled_by state of the entity.</td><td>
        <pre>
- type: disabled_by
  comparator: match
  value: .*
</pre>
      </td></tr>
    <tr><td>hidden_by</td><td>Filter on the hidden_by state of the entity.</td><td>
        <pre>
- type: hidden_by
  comparator: match
  value: .*
</pre>
      </td></tr>
  </tbody>
</table>

</details>
<br />

#### Filter Comparator

These are the options for filter comparator.

<details>
<summary>Click for Configuration Options</summary>

<table>
  <thead>
    <tr><th>option</th><th>description</th><th>example</th></tr>
  </thead>
  <tbody>
    <tr><td>equal</td><td>Check if the selected type value of the entity and the passed value are equal.</td><td>
        <pre>
- type: state
  comparator: equal
  value: on
</pre>
      </td></tr>
    <tr><td>match</td><td>Check if the selected type value of the entity matches against the passed regexp value.</td><td>
        <pre>
- type: entity
  comparator: match
  value: .*_occupancy
</pre>
      </td></tr>
    <tr><td>in</td><td>Check if the selected type value of the entity is in the list of defined values.</td><td>
        <pre>
- type: state
  comparator: in
  value:
    - on
    - off
</pre>
      </td></tr>
    <tr><td>greater_than</td><td>Check if the selected type value of the entity is greater than the defined value.<blockquote>Works only on numeric type values and defined values!</blockquote></td><td>
        <pre>
- type: state
  comparator: greater_than
  value: 5
</pre>
      </td></tr>
    <tr><td>lower_than</td><td>Check if the selected type value of the entity is lower than the defined value.<blockquote>Works only on numeric type values and defined values!</blockquote></td><td>
        <pre>
- type: state
  comparator: lower_than
  value: 5
</pre>
      </td></tr>
    <tr><td>is_null</td><td>Check if the selected type value of the entity is null.<blockquote>Does not need a value defined!</blockquote></td><td>
        <pre>
- type: state
  comparator: is_null
</pre>
      </td></tr>
    <tr><td>is_numeric</td><td>Check if the selected type value of the entity is numeric.<blockquote>Does not need a value defined!</blockquote></td><td>
        <pre>
- type: attribute
  comparator: is_numeric
  value:
    key: volume
</pre>
      </td></tr>
  </tbody>
</table>

</details>
<br />

# Default Config explained

The default config is written as yaml. This should make it easy to make your own changes because it is written exactly as you would in your dashboard.

You can find it [here](/src/config/areaDefaultConfig.yml)

The Area Cards shows only device_type: occupancy as an alarm icon and temperature/moisture (is used for plants for me) as info.

![Area Card](/documentation/assets/area/area-strategy-navigation.png "Area Card")

There are 3 Tabs.

1. Control is for entities that can be interacted with (think media_players, buttons, selects, etc.).

![Control](/documentation/assets/area/area-strategy-main-control.png "Control")

There are Rows for:

- alarm_control_panel
- media_player
- cover
- vacuum
- switch and input_boolean
- select and input_select
- button and scene
- number

I skipped lights and fans because they already are controllable with the area-card in the navigation but feel free to add them to your configuration!

2. Stats is for "read-only" entities like binary_sensors and sensors.

![Stats](/documentation/assets/area/area-strategy-main-stats.png "Stats")

There are Rows for:

- binary_sensor
- sensor (non-numeric ones)
- sensor (numeric ones)

3. Camera is for Camera-Streams.

![Camera](/documentation/assets/area/area-strategy-main-camera.png "Camera")

There are Rows for:

- camera