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
      <td>presets</td>
      <td>Minimal Column Width in the Grid = The Minimal Width of the Cards</td>
      <td>number</td>
      <td>yes</td>
      <td><a href="/src/config/gridDefaultConfig.yml#L1">set</a></td>
      <td>
        <pre>
minColumnWidth: 1000
        </pre>
      </td>
    </tr>
  </tbody>
</table>

So a valid dashboard with configration could look like this:

```yaml
strategy:
  type: custom:log-view-strategy
  config:
    presets:
      - icon: mdi:motion-sensor
        title: Occupancy
        filter:
          include:
            - type: entity
              comparator: match
              value: binary_sensor\..*_occupancy

```

I used all available options in this example. You don`t need to do this!

## Presets

The presets generate the different preset buttons and the filter for the entities to include.

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
      <td>title</td>
      <td>Preset Button title</td>
      <td>string</td>
      <td>yes</td>
      <td>
        <pre>
title: Test
        </pre>
      </td>
    </tr>
    <tr>
      <td>icon</td>
      <td>Preset Button icon</td>
      <td>string</td>
      <td>yes</td>
      <td>
        <pre>
icon: mdi:test
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

Complete example:

```yaml
presets:
  - icon: mdi:motion-sensor
    title: Occupancy
    filter:
      include:
        - type: entity
          comparator: match
          value: binary_sensor\..*_occupancy
  - icon: mdi:light-bulb
    title: Lights (but not Living Room)
    filter:
      include:
        - type: domain
          value: 
      exclude:
        - type: area
          value: living_room

```

Define as many Presets as you want.

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
      <td>
        <pre>
Type of filter.
Available are:
- entity
- domain
- device
- integration
- label
- state
- attribute
        </pre>
      </td>
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
      <td>
        <pre>
Comparator used to compare/filter.
Available are:
- equal (needs value to be set!)
- match (needs value to be set!)
- in (needs value to be set!)
- greater_than (needs value to be set!)
- lower_than (needs value to be set!)
- is_numeric (does not need value. when type: attribute you need to specifiy key!)
- is_null (does not need value. when type: attribute you need to specifiy key!)
        </pre>
      </td>
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
  - type: entity
    comparator: match
    value: media_player\..*bedroom.*
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
