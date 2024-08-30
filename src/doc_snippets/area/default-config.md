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