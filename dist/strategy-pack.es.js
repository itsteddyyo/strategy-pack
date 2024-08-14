const I = "ll-strategy-dashboard-", L = "ll-strategy-view-";
var C = /* @__PURE__ */ ((e) => (e.equal = "equal", e.in = "in", e.greater_than = "greater_than", e.lower_than = "lower_than", e.is_null = "is_null", e.is_numeric = "is_numeric", e))(C || {});
const V = (e) => !e.disabled_by && !e.hidden_by, E = (e, n, t) => {
  const a = parseFloat(n), i = parseFloat(t);
  switch (e) {
    case C.equal:
      return n == t;
    case C.in:
      if (Array.isArray(t))
        return t.includes(n);
      throw Error("Cannot compare. Value must be array.");
    case C.greater_than:
      if (isNaN(a) || isNaN(i))
        throw Error("Cannot compare. One or more values are not numeric");
      return a > i;
    case C.lower_than:
      if (isNaN(a) || isNaN(i))
        throw Error("Cannot compare. One or more values are not numeric");
      return a < i;
    case C.is_null:
      return !!n;
    case C.is_numeric:
      return !isNaN(a);
  }
}, M = {
  entity: (e, n, t, a) => {
    const i = e.entity_id;
    return E(a, i, t);
  },
  domain: (e, n, t, a) => {
    const i = e.entity_id.split(".")[0];
    return E(a, i, t);
  },
  device: (e, n, t, a) => {
    const i = e.device_id;
    return E(a, i, t);
  },
  integration: (e, n, t, a) => {
    const i = e.platform;
    return E(a, i, t);
  },
  label: (e, n, t, a) => e.labels.map((r) => E(a, r, t)).indexOf(!0) > 0,
  state: (e, n, t, a) => {
    var r;
    const i = (r = n.states[e.entity_id]) == null ? void 0 : r.state;
    return E(a, i, t);
  },
  attribute: (e, n, t, a) => {
    var c;
    const i = (c = n.states[e.entity_id]) == null ? void 0 : c.attributes;
    if (((l) => !!t && typeof t == "object" && t.hasOwnProperty("key") && t.hasOwnProperty("value"))())
      return E(a, i[t.key], t.value);
    throw Error("value is not defined correctly");
  }
}, T = (e, n) => {
  const t = (r) => {
    const c = r.filter((l) => l.startsWith("sort_")).map((l) => l.replace("sort_", ""));
    return c.push(1 / 0), c;
  }, a = t(e.labels || [])[0], i = t(n.labels || [])[0];
  return a - i;
};
function U(e) {
  return e != null;
}
const R = {
  minColumnWidth: 200,
  tabs: [
    {
      label: "Control",
      icon: "mdi:button-pointer",
      rows: [
        {
          domain: "alarm_control_panel",
          title: "Alarm",
          card: {
            type: "tile",
            entity: "$entity",
            features: [{
              type: "alarm-modes",
              modes: [
                "armed_home",
                "armed_away",
                "armed_night",
                "armed_vacation",
                "armed_custom_bypass",
                "disarmed"
              ]
            }],
            tap_action: { action: "more-info" },
            icon_tap_action: { action: "none" },
            hold_action: { action: "more-info" }
          }
        },
        {
          domain: "media_player",
          title: "Media",
          card: {
            type: "custom:mushroom-media-player-card",
            entity: "$entity",
            use_media_artwork: !0,
            show_volume_level: !0,
            use_media_info: !1,
            collapsible_controls: !0,
            volume_controls: ["volume_set"],
            media_controls: ["play_pause_stop"],
            tap_action: { action: "toggle" },
            icon_tap_action: { action: "none" },
            hold_action: { action: "more-info" }
          }
        },
        {
          domain: "cover",
          title: "Cover",
          card: {
            type: "tile",
            entity: "$entity",
            features: [{ type: "cover-open-close" }],
            tap_action: { action: "more-info" },
            icon_tap_action: { action: "none" },
            hold_action: { action: "more-info" }
          }
        },
        {
          domain: "vacuum",
          title: "Vacuum",
          card: {
            type: "tile",
            entity: "$entity",
            features: [{
              type: "vacuum-commands",
              commands: [
                "start_pause",
                "return_home"
              ]
            }],
            tap_action: { action: "more-info" },
            icon_tap_action: { action: "none" },
            hold_action: { action: "more-info" }
          }
        },
        {
          domain: [
            "switch",
            "input_boolean"
          ],
          title: "Switch",
          card: {
            type: "tile",
            entity: "$entity",
            hide_state: !0,
            color: "amber",
            tap_action: { action: "toggle" },
            icon_tap_action: { action: "none" },
            hold_action: { action: "more-info" }
          }
        },
        {
          domain: [
            "select",
            "input_select"
          ],
          title: "Select",
          card: {
            type: "tile",
            entity: "$entity",
            hide_state: !0,
            color: "primary",
            features: [{ type: "select-options" }],
            tap_action: { action: "more-info" },
            icon_tap_action: { action: "none" },
            hold_action: { action: "more-info" }
          }
        },
        {
          domain: [
            "button",
            "scene"
          ],
          title: "Button",
          card: {
            type: "tile",
            entity: "$entity",
            hide_state: !0,
            color: "primary",
            tap_action: { action: "toggle" },
            icon_tap_action: { action: "none" },
            hold_action: { action: "more-info" }
          }
        },
        {
          domain: "number",
          title: "Number",
          card: {
            type: "tile",
            entity: "$entity",
            hide_state: !0,
            features: [{
              type: "numeric-input",
              style: "slider"
            }],
            tap_action: { action: "more-info" },
            icon_tap_action: { action: "none" },
            hold_action: { action: "more-info" }
          }
        }
      ]
    },
    {
      label: "Stats",
      icon: "mdi:chart-line",
      rows: [
        {
          domain: "binary_sensor",
          title: "Alert",
          filter: { exclude: [
            {
              type: "attribute",
              value: {
                key: "device_class",
                value: "motion"
              }
            },
            {
              type: "attribute",
              value: {
                key: "device_class",
                value: "occupancy"
              }
            }
          ] },
          card: {
            type: "tile",
            entity: "$entity",
            hide_state: !0,
            color: "primary",
            tap_action: { action: "more-info" },
            icon_tap_action: { action: "none" },
            hold_action: { action: "more-info" }
          }
        },
        {
          domain: "sensor",
          title: "Sensor",
          filter: { exclude: [
            {
              type: "attribute",
              value: {
                key: "device_class",
                value: "battery"
              }
            },
            {
              type: "state",
              comparator: "is_numeric"
            }
          ] },
          card: {
            type: "tile",
            entity: "$entity",
            color: "primary",
            tap_action: { action: "more-info" },
            icon_tap_action: { action: "none" },
            hold_action: { action: "more-info" }
          }
        },
        {
          domain: "sensor",
          title: "Graphs",
          filter: {
            exclude: [{
              type: "attribute",
              value: {
                key: "device_class",
                value: "battery"
              }
            }],
            include: [{
              type: "state",
              comparator: "is_numeric"
            }]
          },
          card: {
            type: "custom:mini-graph-card",
            entities: ["$entity"],
            align_header: "left",
            align_icon: "left",
            align_state: "center",
            font_size: 50,
            font_size_header: 12,
            tap_action: { action: "more-info" },
            icon_tap_action: { action: "none" },
            hold_action: { action: "more-info" },
            card_mod: { style: `.header {
  max-width: 80%;
}
.line--rect,
.fill--rect,
.line--points {
  {% set COLOR = 'grey' %}
  {% if state_attr(config.entities[0].entity,'device_class') in ['date', 'timestamp', 'irradiance', 'distance', 'duration', 'illuminance', 'enum', 'monetary'] %} 
    {% set COLOR = 'grey' %}
  {% elif state_attr(config.entities[0].entity,'device_class') in ['apparent_power', 'battery', 'current', 'energy', 'energy_storage', 'power_factor', 'power', 'voltage'] %} 
    {% set COLOR = 'yellow' %}
  {% elif state_attr(config.entities[0].entity,'device_class') in ['aqi', 'sulphur_dioxide', 'volatile_organic_compounds', 'volatile_organic_compounds_parts', 'atmospheric_pressure', 'carbon_dioxide', 'carbon_monoxide', 'nitrogen_dioxide', 'gas', 'nitrogen_monoxide', 'nitrous_oxide', 'ozone', 'pm1', 'pm10', 'pm25'] %} 
    {% set COLOR = 'green' %}
  {% elif state_attr(config.entities[0].entity,'device_class') in ['pressure', 'reactive_power', 'speed', 'temperature', 'weight', 'wind_speed'] %} 
    {% set COLOR = 'orangered' %}
  {% elif state_attr(config.entities[0].entity,'device_class') in ['moisture', 'ph', 'precipitation', 'precipitation_intensity', 'humidity', 'water', 'volume', 'volume_storage'] %} 
    {% set COLOR = 'royalblue' %}
  {% elif state_attr(config.entities[0].entity,'device_class') in ['data_rate', 'data_size', 'signal_strength', 'frequency', 'sound_pressure'] %}
    {% set COLOR = 'orange' %}
  {% endif %}            
  fill: {{COLOR}};
  stroke: {{COLOR}};
}
` }
          }
        }
      ]
    },
    {
      label: "Camera",
      icon: "mdi:camera",
      rows: [{
        domain: "camera",
        card: {
          type: "picture-entity",
          entity: "$entity",
          tap_action: { action: "more-info" },
          icon_tap_action: { action: "none" },
          hold_action: { action: "more-info" }
        }
      }]
    }
  ],
  areaCardConfig: {
    aspect_ratio: "35:15",
    alert_classes: ["occupancy"],
    sensor_classes: [
      "temperature",
      "moisture"
    ]
  },
  areaColors: [
    "rgba(42,72,100,0.3)",
    "rgba(234,162,33,0.3)",
    "rgba(214,64,92,0.3)",
    "rgba(190,70,178,0.3)",
    "rgba(145,142,80,0.3)",
    "rgba(12,162,121,0.3)",
    "rgba(76,159,171,0.3)",
    "rgba(147,72,26,0.3)"
  ]
}, S = (e, n, t, a, i) => {
  const r = [], c = [];
  return e.forEach((l) => {
    var u;
    const y = ((u = (i || {})[l.entity_id]) == null ? void 0 : u.card) || n.card, m = Object.entries(y).filter(([g, _]) => JSON.stringify(_).includes("$entity")).map(([g, _]) => {
      const o = JSON.stringify(_);
      return [g, JSON.parse(o.replace("$entity", l.entity_id))];
    });
    c.push({
      ...y,
      ...Object.fromEntries(m)
    });
  }), c.length > 0 && (a && r.push({
    type: "custom:mushroom-title-card",
    title: a,
    subtitle_tap_action: {
      action: "none"
    }
  }), r.push({
    type: "custom:layout-card",
    layout_type: "custom:grid-layout",
    layout: {
      "grid-template-rows": "auto",
      "grid-template-columns": `repeat(auto-fit, minmax(${t}px, 1fr))`,
      padding: "0px 10px"
    },
    cards: c
  })), r;
};
class j extends HTMLTemplateElement {
  static async generate(n, t) {
    var y;
    const [a, i, r] = await Promise.all([
      t.callWS({ type: "config/entity_registry/list" }),
      t.callWS({ type: "config/device_registry/list" }),
      t.callWS({ type: "config/area_registry/list" })
    ]);
    return {
      views: [...r.filter((m) => {
        var u;
        return !((u = n.config) != null && u.areaBlacklist) || n.config.areaBlacklist.indexOf(m.area_id) == -1;
      }).sort(T).map((m, u) => ({
        strategy: {
          type: "custom:area-view-strategy",
          meta: {
            entities: a,
            devices: i,
            areas: r
          },
          config: {
            ...R,
            ...n.config || {},
            area: m.area_id
          }
        },
        title: m.name,
        path: m.area_id,
        icon: "mdi:home",
        type: "panel",
        subview: !1,
        visible: u == 0
      })), ...((y = n.config) == null ? void 0 : y.extraViews) || []]
    };
  }
}
class J extends HTMLTemplateElement {
  static async generate(n, t) {
    const { config: a, meta: i } = n, r = { ...R, ...a }, { area: c, tabs: l, minColumnWidth: y, replaceCards: m, topCards: u, areaColors: g, areaCardConfig: _, areaBlacklist: o } = r;
    let d = Array(), p = Array(), h = Array();
    if (i)
      d = i.entities, p = i.devices, h = i.areas;
    else {
      const s = await Promise.all([
        t.callWS({ type: "config/entity_registry/list" }),
        t.callWS({ type: "config/device_registry/list" }),
        t.callWS({ type: "config/area_registry/list" })
      ]);
      d = s[0], p = s[1], h = s[2];
    }
    d = [...d].sort(T), p = [...p].sort(T), h = [...h].sort(T);
    const F = h.filter((s) => !o || o.indexOf(s.area_id) == -1), $ = h.find((s) => s.area_id == c);
    if (!$)
      throw Error("No area defined");
    const W = /* @__PURE__ */ new Set();
    for (const s of p)
      s.area_id === $.area_id && W.add(s.id);
    const P = {
      type: "vertical-stack",
      cards: [
        {
          type: "custom:layout-card",
          layout_type: "custom:grid-layout",
          layout: {
            "grid-template-rows": "auto",
            "grid-template-columns": "repeat(auto-fit, minmax(300px, 1fr))"
          },
          cards: []
        }
      ]
    }, A = F.reduce(
      (s, b, f) => {
        const v = {
          ..._,
          type: "area",
          area: b.area_id,
          navigation_path: `${b.area_id}#main`
        };
        return s.cards[0].cards.push({
          type: "conditional",
          conditions: [{
            condition: "screen",
            media_query: "(max-width: 1000px)"
          }],
          card: {
            ...v,
            card_mod: {
              style: `
                  hui-image {
                    opacity: 0.3;
                  }
                  div.navigate {
                    background-color: ${g[f]};
                  }`
            }
          }
        }), s.cards[0].cards.push(
          {
            type: "conditional",
            conditions: [{
              condition: "screen",
              media_query: "(min-width: 1001px)"
            }],
            card: b.area_id == $.area_id ? v : {
              ...v,
              card_mod: {
                style: `
                        hui-image {
                          opacity: 0.3;
                        }
                        div.navigate {
                          background-color: ${g[f]};
                        }`
              }
            }
          }
        ), s;
      },
      P
    );
    A.cards = [...u || [], ...A.cards];
    const B = (s) => s.reduce((b, f) => {
      let v = d.filter(V).filter((w) => w.area_id ? w.area_id === $.area_id : W.has(w.device_id)).filter((w) => {
        const N = w.entity_id.split(".")[0];
        return Array.isArray(f.domain) ? f.domain.filter((x) => x == N).length > 0 : f.domain == N;
      });
      f.filter && (v = v.filter((w) => {
        var x;
        return (((x = f.filter) == null ? void 0 : x.include) || []).reduce((k, O) => k && M[O.type](w, t, O.value, O.comparator || C.equal), !0);
      }), v = v.filter((w) => {
        var x;
        return (((x = f.filter) == null ? void 0 : x.exclude) || []).reduce((k, O) => k && !M[O.type](w, t, O.value, O.comparator || C.equal), !0);
      }));
      const D = S(v, f, y, f.title, m);
      return b.push(...D), b;
    }, Array()), H = l.map((s) => {
      const b = B(s.rows);
      return b.length > 0 ? {
        attributes: {
          label: s.label,
          icon: s.icon,
          stacked: !0
        },
        card: {
          type: "vertical-stack",
          cards: b
        }
      } : null;
    }).filter(U), q = {
      type: "custom:tabbed-card",
      styles: {
        "--mdc-tab-text-label-color-default": "var(--primary-text-color)",
        "--mdc-tab-color-default": "var(--primary-text-color)"
      },
      tabs: H
    };
    return {
      panel: !0,
      cards: [{
        type: "vertical-stack",
        cards: [
          {
            type: "conditional",
            conditions: [{
              condition: "screen",
              media_query: "(max-width: 1000px)"
            }],
            card: {
              type: "custom:state-switch",
              entity: "hash",
              default: "default",
              states: {
                "": {
                  type: "vertical-stack",
                  cards: [
                    A,
                    {
                      type: "custom:gap-card",
                      height: 60
                    }
                  ]
                },
                default: {
                  type: "vertical-stack",
                  cards: [
                    q,
                    {
                      type: "custom:mushroom-chips-card",
                      card_mod: {
                        style: `
                        ha-card { --chip-background: none; }
                        :host {
                          --chip-icon-size: 1em !important;
                          z-index: 2;
                          width: 100%;
                          position: fixed;
                          bottom: 0;
                          margin: 0 !important;
                          padding: 20px;
                          background: var(--app-header-background-color);
                          left: 50%;
                          transform: translateX(-50%);
                        }
                        @media (min-width: 1001px) {
                          :host {
                            display: none;
                          }
                        }`
                      },
                      chips: [
                        { type: "spacer" },
                        {
                          type: "template",
                          icon: "mdi:home",
                          icon_height: "40px",
                          tap_action: {
                            action: "navigate",
                            navigation_path: window.location.pathname
                          }
                        },
                        { type: "spacer" }
                      ]
                    },
                    {
                      type: "custom:gap-card",
                      height: 60
                    }
                  ]
                }
              }
            }
          },
          {
            type: "conditional",
            conditions: [{
              condition: "screen",
              media_query: "(min-width: 1001px)"
            }],
            card: {
              type: "custom:layout-card",
              layout_type: "custom:grid-layout",
              layout: {
                "grid-template-columns": "2fr 3fr",
                "grid-template-areas": "navigation main"
              },
              cards: [A, q]
            }
          }
        ]
      }]
    };
  }
}
customElements.define(`${I}area-dashboard-strategy`, j);
customElements.define(`${L}area-view-strategy`, J);
const z = { minColumnWidth: 300 };
class G extends HTMLTemplateElement {
  static async generate(n, t) {
    const { config: a } = n, i = {
      platforms: [
        { platform: "mqtt", title: "Zigbee" },
        { platform: "switchbot", title: "Switchbot" }
      ],
      ...z,
      ...a
    }, { minColumnWidth: r, replaceCards: c, platforms: l } = i, [y] = await Promise.all([
      t.callWS({ type: "config/entity_registry/list" })
    ]), m = {
      card: {
        type: "custom:mini-graph-card",
        entities: ["$entity"],
        align_header: "left",
        align_icon: "left",
        align_state: "center",
        font_size: 50,
        font_size_header: 12,
        lower_bound: 0,
        upper_bound: 100,
        card_mod: {
          style: `
              .header {
                max-width: 80%;
              }
              .line--rect,
              .fill--rect,
              .line--points {
                fill: amber;
                stroke: amber;
              }`
        }
      }
    }, u = y.filter(V).filter((o) => {
      var p, h;
      return o.entity_id.split(".")[0] == "sensor" && ((h = (p = t.states[o.entity_id]) == null ? void 0 : p.attributes) == null ? void 0 : h.device_class) == "battery";
    }), g = (o) => !l.map((d) => d.platform).includes(o.platform), _ = S(u.filter(g), m, r, "Other", c);
    return l.forEach((o) => {
      const d = (p) => p.platform === o.platform;
      _.push(...S(u.filter(d), m, r, o.title, c));
    }), {
      panel: !0,
      cards: _
    };
  }
}
customElements.define(`${L}battery-view-strategy`, G);
class X extends HTMLTemplateElement {
  static async generate(n, t) {
    const { config: a } = n, i = {
      platforms: [
        { platform: "unifi", title: "UniFi" },
        { platform: "esphome", title: "ESPHome" }
      ],
      ...z,
      ...a
    }, { minColumnWidth: r, replaceCards: c, platforms: l } = i, [y] = await Promise.all([
      t.callWS({ type: "config/entity_registry/list" })
    ]), m = {
      card: {
        type: "tile",
        entity: "$entity",
        hide_state: !0,
        features: [
          { type: "update-actions", backup: "ask" }
        ]
      }
    }, u = y.filter(V).filter((o) => {
      const d = o.entity_id.split(".")[0];
      return !o.disabled_by && !o.hidden_by && d == "update";
    }), g = (o) => !l.map((d) => d.platform).includes(o.platform), _ = S(u.filter(g), m, r, "Other", c);
    return l.forEach((o) => {
      const d = (p) => p.platform === o.platform;
      _.push(...S(u.filter(d), m, r, o.title, c));
    }), {
      panel: !0,
      cards: [
        {
          type: "vertical-stack",
          cards: _
        }
      ]
    };
  }
}
customElements.define(`${L}update-view-strategy`, X);
