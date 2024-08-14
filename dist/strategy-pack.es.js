const I = "ll-strategy-dashboard-", L = "ll-strategy-view-";
var v = /* @__PURE__ */ ((e) => (e.equal = "equal", e.in = "in", e.greater_than = "greater_than", e.lower_than = "lower_than", e.is_null = "is_null", e.is_numeric = "is_numeric", e))(v || {});
const V = (e) => !e.disabled_by && !e.hidden_by, E = (e, n, t) => {
  const a = parseFloat(n), i = parseFloat(t);
  switch (e) {
    case v.equal:
      return n == t;
    case v.in:
      if (Array.isArray(t))
        return t.includes(n);
      throw Error("Cannot compare. Value must be array.");
    case v.greater_than:
      if (isNaN(a) || isNaN(i))
        throw Error("Cannot compare. One or more values are not numeric");
      return a > i;
    case v.lower_than:
      if (isNaN(a) || isNaN(i))
        throw Error("Cannot compare. One or more values are not numeric");
      return a < i;
    case v.is_null:
      return !!n;
    case v.is_numeric:
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
    var s;
    const i = (s = n.states[e.entity_id]) == null ? void 0 : s.attributes;
    if (((m) => !!t && typeof t == "object" && t.hasOwnProperty("key") && t.hasOwnProperty("value"))())
      return E(a, i[t.key], t.value);
    throw Error("value is not defined correctly");
  }
}, T = (e, n) => {
  const t = (r) => {
    const s = r.filter((m) => m.startsWith("sort_")).map((m) => m.replace("sort_", ""));
    return s.push(1 / 0), s;
  }, a = t(e.labels || [])[0], i = t(n.labels || [])[0];
  return a - i;
};
function U(e) {
  return e != null;
}
const R = {
  minColumnWidth: 150,
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
}, k = (e, n, t, a, i) => {
  const r = [], s = [];
  return e.forEach((m) => {
    var u;
    const d = ((u = (i || {})[m.entity_id]) == null ? void 0 : u.card) || n.card, l = Object.entries(d).filter(([p, y]) => JSON.stringify(y).includes("$entity")).map(([p, y]) => {
      const o = JSON.stringify(y);
      return [p, JSON.parse(o.replace("$entity", m.entity_id))];
    });
    s.push({
      ...d,
      ...Object.fromEntries(l)
    });
  }), s.length > 0 && (a && r.push({
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
    cards: s
  })), r;
};
class j extends HTMLTemplateElement {
  static async generate(n, t) {
    var d;
    const [a, i, r] = await Promise.all([
      t.callWS({ type: "config/entity_registry/list" }),
      t.callWS({ type: "config/device_registry/list" }),
      t.callWS({ type: "config/area_registry/list" })
    ]);
    return {
      views: [...r.filter((l) => {
        var u;
        return !((u = n.config) != null && u.areaBlacklist) || n.config.areaBlacklist.indexOf(l.area_id) == -1;
      }).sort(T).map((l, u) => ({
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
            area: l.area_id
          }
        },
        title: l.name,
        path: l.area_id,
        icon: "mdi:home",
        type: "panel",
        subview: !1,
        visible: u == 0
      })), ...((d = n.config) == null ? void 0 : d.extraViews) || []]
    };
  }
}
class J extends HTMLTemplateElement {
  static async generate(n, t) {
    const { config: a, meta: i } = n, r = { ...R, ...a }, { area: s, tabs: m, minColumnWidth: d, replaceCards: l, topCards: u, areaColors: p, areaCardConfig: y, areaBlacklist: o } = r;
    let w = Array(), x = Array(), f = Array();
    if (i)
      w = i.entities, x = i.devices, f = i.areas;
    else {
      const c = await Promise.all([
        t.callWS({ type: "config/entity_registry/list" }),
        t.callWS({ type: "config/device_registry/list" }),
        t.callWS({ type: "config/area_registry/list" })
      ]);
      w = c[0], x = c[1], f = c[2];
    }
    w = [...w].sort(T), x = [...x].sort(T), f = [...f].sort(T);
    const P = f.filter((c) => !o || o.indexOf(c.area_id) == -1), $ = f.find((c) => c.area_id == s);
    if (!$)
      throw Error("No area defined");
    const W = /* @__PURE__ */ new Set();
    for (const c of x)
      c.area_id === $.area_id && W.add(c.id);
    const B = {
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
    }, A = P.reduce(
      (c, g, _) => {
        const h = {
          ...y,
          type: "area",
          area: g.area_id,
          navigation_path: `${g.area_id}#main`
        };
        return c.cards[0].cards.push({
          type: "conditional",
          conditions: [{
            condition: "screen",
            media_query: "(max-width: 1000px)"
          }],
          card: {
            ...h,
            card_mod: {
              style: `
                  hui-image {
                    opacity: 0.3;
                  }
                  div.navigate {
                    background-color: ${p[_]};
                  }`
            }
          }
        }), c.cards[0].cards.push(
          {
            type: "conditional",
            conditions: [{
              condition: "screen",
              media_query: "(min-width: 1001px)"
            }],
            card: g.area_id == $.area_id ? h : {
              ...h,
              card_mod: {
                style: `
                        hui-image {
                          opacity: 0.3;
                        }
                        div.navigate {
                          background-color: ${p[_]};
                        }`
              }
            }
          }
        ), c;
      },
      B
    );
    A.cards = [...u || [], ...A.cards];
    const F = (c) => c.reduce((g, _) => {
      let h = w.filter(V).filter((b) => b.area_id ? b.area_id === $.area_id : W.has(b.device_id)).filter((b) => {
        const N = b.entity_id.split(".")[0];
        return Array.isArray(_.domain) ? _.domain.filter((C) => C == N).length > 0 : _.domain == N;
      });
      _.filter && (h = h.filter((b) => {
        var C;
        return (((C = _.filter) == null ? void 0 : C.include) || []).reduce((S, O) => S && M[O.type](b, t, O.value, O.comparator || v.equal), !0);
      }), h = h.filter((b) => {
        var C;
        return (((C = _.filter) == null ? void 0 : C.exclude) || []).reduce((S, O) => S && !M[O.type](b, t, O.value, O.comparator || v.equal), !0);
      }));
      const D = k(h, _, d, _.title, l);
      return g.push(...D), g;
    }, Array()), H = m.map((c) => {
      const g = F(c.rows);
      return g.length > 0 ? {
        attributes: {
          label: c.label,
          icon: c.icon,
          stacked: !0
        },
        card: {
          type: "vertical-stack",
          cards: g
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
const z = { minColumnWidth: 200 };
class G extends HTMLTemplateElement {
  static async generate(n, t) {
    const { config: a } = n, i = { ...z, ...a }, { minColumnWidth: r, replaceCards: s } = i, [m] = await Promise.all([
      t.callWS({ type: "config/entity_registry/list" })
    ]), d = {
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
    }, l = m.filter(V).filter((o) => {
      var x, f;
      return o.entity_id.split(".")[0] == "sensor" && ((f = (x = t.states[o.entity_id]) == null ? void 0 : x.attributes) == null ? void 0 : f.device_class) == "battery";
    }), u = l.filter((o) => !["mqtt", "switchbot"].includes(o.platform)), p = l.filter((o) => ["mqtt"].includes(o.platform)), y = l.filter((o) => ["switchbot"].includes(o.platform));
    return {
      panel: !0,
      cards: [
        {
          type: "vertical-stack",
          cards: [
            ...u.length > 0 ? k(u, d, r, "Other", s) : [],
            ...p.length > 0 ? k(p, d, r, "Zigbee", s) : [],
            ...y.length > 0 ? k(y, d, r, "Switchbot", s) : []
          ]
        }
      ]
    };
  }
}
customElements.define(`${L}battery-view-strategy`, G);
class X extends HTMLTemplateElement {
  static async generate(n, t) {
    const { config: a } = n, i = { ...z, ...a }, { minColumnWidth: r, replaceCards: s } = i, [m] = await Promise.all([
      t.callWS({ type: "config/entity_registry/list" })
    ]), d = {
      card: {
        type: "tile",
        entity: "$entity",
        hide_state: !0,
        features: [
          { type: "update-actions", backup: "ask" }
        ]
      }
    }, l = m.filter(V).filter((o) => {
      const w = o.entity_id.split(".")[0];
      return !o.disabled_by && !o.hidden_by && w == "update";
    }), u = l.filter((o) => !["unifi", "esphome"].includes(o.platform)), p = l.filter((o) => ["unifi"].includes(o.platform)), y = l.filter((o) => ["esphome"].includes(o.platform));
    return {
      panel: !0,
      cards: [
        {
          type: "vertical-stack",
          cards: [
            ...u.length > 0 ? k(u, d, r, "Other", s) : [],
            ...p.length > 0 ? k(p, d, r, "UniFi", s) : [],
            ...y.length > 0 ? k(y, d, r, "ESPHome", s) : []
          ]
        }
      ]
    };
  }
}
customElements.define(`${L}update-view-strategy`, X);
