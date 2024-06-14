# Configuration

## Configuration Options

<table>
  <thead>
    <tr>
      <th>option</th>
      <th>description</th>
      <th>type</th>
      <th>required</th>
      <th>default</th>
      <th>example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>tabs</td>
      <td>Tabs shown in the main area. <a href="#tabs">More</a></td>
      <td>Array</td>
      <td>yes</td>
      <td><a href="/src/defaultConfig.yml#L1">set</a></td>
      <td>
        <pre>
tabs:
  - label: Test
    icon: mdi:test
    rows: [...]
        </pre>
      </td>
    </tr>
    <tr>
      <td>areaColor</td>
      <td>Overlay Colors for navigation area. Must be in the form of a rgba css-value. rgb defines the color and the
        a-channel defines transparency. The colors get repeated when you have more areas than colors. Leave empty for no
        overlay.</td>
      <td>Array</td>
      <td>yes</td>
      <td><a href="/src/defaultConfig.yml#L232">set</a></td>
      <td>
        <pre>
areaColor:
  - rgba(0,0,0,0.5)
        </pre>
      </td>
    </tr>
    <tr>
      <td>areaCardConfig</td>
      <td>The config for the area card. All options allowed expect type, area, navigation_path</td>
      <td>Object</td>
      <td>no</td>
      <td><a href="/src/defaultConfig.yml#L225">set</a></td>
      <td>
        <pre>
areaCardConfig:
  aspect_ratio: 1:1
        </pre>
      </td>
    </tr>
    <tr>
      <td>topCards</td>
      <td>Slot for cards above navigation.</td>
      <td>Array</td>
      <td>no</td>
      <td>-</td>
      <td>
        <pre>
topCards:
  - type: entity
    entities:
      - button.test
      - button.test2
        </pre>
      </td>
    </tr>
    <tr>
      <td>replaceCards</td>
      <td>You can set a card to be used for a specific entity. Overwrites Config in Tabs - Rows - card.</td>
      <td>Object</td>
      <td>no</td>
      <td>-</td>
      <td>
        <pre>
replaceCards:
  button.test:
    type: entity
    entities:
      - $entity
        </pre>
      </td>
    </tr>
  </tbody>
</table>

So a valid dashboard with configration could look like this:

```yaml
type: custom:area-dashboard-strategy
options:
  areaColor:
  areaCardConfig:
    aspect_ratio: 2:1
    sensor_classes:
      - temperature
  topCards:
    - type: picture
      image: https://i.scdn.co/image/ab67616100005174d432d36ca35d0b7a6bf82cef
    - type: tile
      entity: update.home_assistant_core_update
  tabs:
    - label: Updates
      icon: mdi:package-up
      rows:
        - title: Updates
          domain: update
          include:
            - type: state
              value: off
          card:
            type: tile
            entity: $entity
  replaceCards:
    update.home_assistant_core_update:
      card:
        - type: picture
          image: https://i.scdn.co/image/ab67616100005174d432d36ca35d0b7a6bf82cef

```

I used all available options in this example. You don`t need to do this!

More on the default configuration [here](#default-config-explained)

## Tabs

The Tab show in the the main section.
Is using the Tabbed-Card (TODO: See).

```yaml
tabs:
  - label: Control
    icon: mdi:button-pointer
    rows:
      - <row 1 definition>
      - <row 2 definition>
      - ...
  - label: Test
    icon: mdi:test
    rows: [...]
```

More on [rows](#contentrows)

Define as many Tabs as you want.
The Tab will only be shown in the View per Area when it has content.

Example: if the Living Room has a Tab where none of the rows would have entities (like Camera, which has only one row and can easily be empty) the whole Tab is hidden.

## Content/Rows

Define the Rows in the Tab.
Every Row consists of a (optional) title and a Grid with all the cards for the entities.
The row is defined by:

<table>
  <thead>
    <tr>
      <th>attribute</th>
      <th>description</th>
      <th>type</th>
      <th>required</th>
      <th>example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>domain</td>
      <td>Domain or Array of domains the entity must belong to.</td>
      <td>string, Array</td>
      <td>yes</td>
      <td>
        <pre>
domain: button
or
domain:
  - button
  - light
        </pre>
      </td>
    </tr>
    <tr>
      <td>title</td>
      <td>Title shown over Grid. Will not be rendered when not set.</td>
      <td>string</td>
      <td>no</td>
      <td>
        <pre>
title: Test
        </pre>
      </td>
    </tr>
    <td>card</td>
    <td>The cardConfig of the card that should be rendered for every entity in the grid. You can insert the entityId of the entity with the $entity variable. You can use all cards you would normally use in your dashboard!</td>
    <td>Object</td>
    <td>yes</td>
    <td>
      <pre>
card:
  type: tile
  entity: $entity
  iconColor: red
      </pre>
    </td>
    </tr>
    <tr>
      <td>filter</td>
      <td>Define include and exclude function for more fine-grained control of entities selected for row than only
        domain. <a href="#filter">More</a></td>
      <td>Object</td>
      <td>no</td>
      <td>
        <pre>
include:
  - type :state
    comparator: equal
    value: on
exclude:
  - type: attribute
    comparator: is_numeric
    value: key: clickCount
        </pre>
      </td>
    </tr>
  </tbody>
</table>

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

The filter object looks like this.

<table>
  <thead>
    <tr>
      <th>attribute</th>
      <th>description</th>
      <th>type</th>
      <th>required</th>
      <th>example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>type</td>
      <td>Type of filter.
        Available are:
        - entity
        - domain
        - device
        - integration
        - label
        - state
        - attribute</td>
      <td>enum</td>
      <td>yes</td>
      <td>
        <pre>
type: state
        </pre>
      </td>
    </tr>
    <tr>
      <td>comparator</td>
      <td>Comparator used to compare/filter.
        Available are:
        - equal (needs value to be set!)
        - in (needs value to be set!)
        - greater_than (needs value to be set!)
        - lower_than (needs value to be set!)
        - is_numeric (does not need value. when type: attribute you need to specifiy key!)
        - is_null (does not need value. when type: attribute you need to specifiy key!)</td>
      <td>enum</td>
      <td>no (default is equal)</td>
      <td>
        <pre>
comparator: is_numeric
        </pre>
      </td>
    </tr>
    <tr>
      <td>value</td>
      <td>Value to compare against. Can be in variable form. See example.</td>
      <td>dependant on type and comparator</td>
      <td>no (dependant on type and comparator)</td>
      <td>
        <pre>
include:
  - type: entity
    value: media_player.test
  - type: device
    comparator: in
    value:
      - e7130bc20010fd2399f89f1d39666146
      - b52d046e38fff9d5ca2bdb54304f4695
  - type: domain
    value: media_player
  - type: integration
    value: mqtt
  - type: label
    comparator: in
    value:
      - sort_1
      - sort_2
      - sort_3
  - type: state
    value: 5
  - type: state
    comparator: greater_than
    value: 2
  - type: state
    comparator: is_numeric
  - type: state
    comparator: is_null
  - type: state
    value: 5
  - type: attribute
    comparator: greater_than
    value:
      key: uptime
      value: 2
  - type: attribute
    comparator: is_numeric
    value:
      key: uptime
  - type: attribute
    comparator: is_null
    value:
      key: uptime
  - type: attribute
    comparator: in
    value:
      key: uptime
      value:
        - 1
        - 2
        - 3
        </pre>
      </td>
    </tr>
  </tbody>
</table>

# Default Config explained

The default config is written as yaml. This should make it easy to make your own changes because it is written exactly as you would in your dashboard.

You can find it [here](./src/defaultConfig.yml)

The Area Cards shows only device_type: occupancy as an alarm icon and temperature/moisture as info.

![Area Card](/documentation/area-strategy-navigation-single.png "Area Card")

There are 3 Tabs.

Control is for entities that can be interacted with (think media_players, buttons, selects, etc.).

![Control](/documentation/area-strategy-main-control.png "Control")

Stats is for "read-only" entities like binary_sensors and sensors.

![Stats](/documentation/area-strategy-main-stats.png "Stats")

Camera is for Camera-Streams.

![Camera](/documentation/area-strategy-main-camera.png "Camera")
