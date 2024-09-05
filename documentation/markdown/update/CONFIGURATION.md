

# Configuration

## Configuration Options

<details>
<summary>Click for Configuration Options</summary>

<table>
  <thead>
    <tr><th>option</th><th>description</th><th>type</th><th>required</th><th>default</th><th>example</th></tr>
  </thead>
  <tbody>
    <tr><td>platforms</td><td>Platforms (= integrations) for which the strategy should generate rows<blockquote>You need the internal HA id of the integration. <a href="https://community.home-assistant.io/t/how-to-get-an-integration-name-for-an-entity/447635">Here</a> is described how to obtain it</blockquote></td><td>Array</td><td>yes</td><td>
UniFi, HACS, ESPHome, Zigbee, Other (always present everything that is not defined in platforms!)
</td><td>
        <pre>
platforms:
  - platform: hacs
    title: HACS
  - platform: MQTT
    title: Everything MQTT
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
  type: custom:update-view-strategy
  config:
    platforms:
      - platform: hacs
        title: HACS
      - platform: MQTT
        title: Everything MQTT
    minColumnWidth: 300
    replaceCards:
      button.test:
        type: entity
        entities:
          - $entity
icon: mdi:test
path: test
title: Test

```

I used all available options in this example. You don`t need to do this!

# Default Config explained

The default config is written as yaml. This should make it easy to make your own changes because it is written exactly as you would in your dashboard.

You can find it [here](/src/config/gridDefaultConfig.yml)

Additionally for this View Strategy the platforms options is hard-coded so it is not defined in yaml but can be overwritten!

There are Rows for:

- UniFi
- HACS
- ESPHome
- Zigbee
- Other (always present everything that is not defined in platforms!)