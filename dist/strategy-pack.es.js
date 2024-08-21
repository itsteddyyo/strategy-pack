const I = "ll-strategy-dashboard-", S = "ll-strategy-view-";
var q = /* @__PURE__ */ ((t) => (t.entity = "entity", t.domain = "domain", t.device = "device", t.integration = "integration", t.label = "label", t.state = "state", t.attribute = "attribute", t))(q || {}), g = /* @__PURE__ */ ((t) => (t.equal = "equal", t.in = "in", t.greater_than = "greater_than", t.lower_than = "lower_than", t.is_null = "is_null", t.is_numeric = "is_numeric", t))(g || {});
const $ = (t) => !t.disabled_by && !t.hidden_by, M = (t, n) => (e) => {
  var a, r, s;
  const i = { type: q.domain, comparator: Array.isArray(t.domain) ? g.in : g.equal, value: t.domain };
  return t.filter = { ...t.filter || {}, include: [...((a = t.filter) == null ? void 0 : a.include) || [], i] }, t.filter && ((((r = t.filter) == null ? void 0 : r.include) || []).forEach((o) => {
    if (!V[o.type](e, n, o.value, o.comparator || g.equal))
      return !1;
  }), (((s = t.filter) == null ? void 0 : s.exclude) || []).forEach((o) => {
    if (!!V[o.type](e, n, o.value, o.comparator || g.equal))
      return !1;
  })), !0;
}, v = (t, n, e) => {
  const i = parseFloat(n), a = parseFloat(e);
  switch (t) {
    case g.equal:
      return n == e;
    case g.in:
      if (Array.isArray(e))
        return e.includes(n);
      throw Error("Cannot compare. Value must be array.");
    case g.greater_than:
      if (isNaN(i) || isNaN(a))
        throw Error("Cannot compare. One or more values are not numeric");
      return i > a;
    case g.lower_than:
      if (isNaN(i) || isNaN(a))
        throw Error("Cannot compare. One or more values are not numeric");
      return i < a;
    case g.is_null:
      return !!n;
    case g.is_numeric:
      return !isNaN(i);
  }
}, V = {
  entity: (t, n, e, i) => {
    const a = t.entity_id;
    return v(i, a, e);
  },
  domain: (t, n, e, i) => {
    const a = t.entity_id.split(".")[0];
    return v(i, a, e);
  },
  device: (t, n, e, i) => {
    const a = t.device_id;
    return v(i, a, e);
  },
  integration: (t, n, e, i) => {
    const a = t.platform;
    return v(i, a, e);
  },
  label: (t, n, e, i) => t.labels.map((r) => v(i, r, e)).indexOf(!0) > 0,
  state: (t, n, e, i) => {
    var r;
    const a = (r = n.states[t.entity_id]) == null ? void 0 : r.state;
    return v(i, a, e);
  },
  attribute: (t, n, e, i) => {
    var s;
    const a = (s = n.states[t.entity_id]) == null ? void 0 : s.attributes;
    if (((c) => !!e && typeof e == "object" && e.hasOwnProperty("key") && e.hasOwnProperty("value"))())
      return v(i, a[e.key], e.value);
    throw Error("value is not defined correctly");
  }
}, k = (t, n) => {
  const e = (r) => {
    const s = r.filter((c) => c.startsWith("sort_")).map((c) => c.replace("sort_", ""));
    return s.push(1 / 0), s;
  }, i = e(t.labels || [])[0], a = e(n.labels || [])[0];
  return i - a;
};
function D(t) {
  return t != null;
}
const T = {
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
}, C = (t, n, e, i, a) => {
  const r = [], s = [];
  return t.forEach((c) => {
    var l;
    const p = ((l = (a || {})[c.entity_id]) == null ? void 0 : l.card) || n.card, o = Object.entries(p).filter(([y, _]) => JSON.stringify(_).includes("$entity")).map(([y, _]) => {
      const d = JSON.stringify(_);
      return [y, JSON.parse(d.replace("$entity", c.entity_id))];
    });
    s.push({
      ...p,
      ...Object.fromEntries(o)
    });
  }), s.length > 0 && (i && r.push({
    type: "custom:mushroom-title-card",
    title: i,
    subtitle_tap_action: {
      action: "none"
    }
  }), r.push({
    type: "custom:layout-card",
    layout_type: "custom:grid-layout",
    layout: {
      "grid-template-rows": "auto",
      "grid-template-columns": `repeat(auto-fit, minmax(${e}px, 1fr))`,
      padding: "0px 10px"
    },
    cards: s
  })), r;
};
class F extends HTMLTemplateElement {
  static async generate(n, e) {
    var p;
    const [i, a, r] = await Promise.all([
      e.callWS({ type: "config/entity_registry/list" }),
      e.callWS({ type: "config/device_registry/list" }),
      e.callWS({ type: "config/area_registry/list" })
    ]);
    return {
      views: [...r.filter((o) => {
        var l;
        return !((l = n.config) != null && l.areaBlacklist) || n.config.areaBlacklist.indexOf(o.area_id) == -1;
      }).sort(k).map((o, l) => ({
        strategy: {
          type: "custom:area-view-strategy",
          meta: {
            entities: i,
            devices: a,
            areas: r
          },
          config: {
            ...T,
            ...n.config || {},
            area: o.area_id
          }
        },
        title: o.name,
        path: o.area_id,
        icon: "mdi:home",
        type: "panel",
        subview: !1,
        visible: l == 0
      })), ...((p = n.config) == null ? void 0 : p.extraViews) || []]
    };
  }
}
class U extends HTMLTemplateElement {
  static async generate(n, e) {
    const { config: i, meta: a } = n, r = { ...T, ...i }, { area: s, tabs: c, minColumnWidth: p, replaceCards: o, topCards: l, areaColors: y, areaCardConfig: _, areaBlacklist: d } = r;
    let u = Array(), f = Array(), h = Array();
    if (a)
      u = a.entities, f = a.devices, h = a.areas;
    else {
      const m = await Promise.all([
        e.callWS({ type: "config/entity_registry/list" }),
        e.callWS({ type: "config/device_registry/list" }),
        e.callWS({ type: "config/area_registry/list" })
      ]);
      u = m[0], f = m[1], h = m[2];
    }
    u = [...u].sort(k), f = [...f].sort(k), h = [...h].sort(k);
    const R = h.filter((m) => !d || d.indexOf(m.area_id) == -1), E = h.find((m) => m.area_id == s);
    if (!E)
      throw Error("No area defined");
    const W = /* @__PURE__ */ new Set();
    for (const m of f)
      m.area_id === E.area_id && W.add(m.id);
    const z = {
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
    }, O = R.reduce(
      (m, b, w) => {
        const x = {
          ..._,
          type: "area",
          area: b.area_id,
          navigation_path: `${b.area_id}#main`
        };
        return m.cards[0].cards.push({
          type: "conditional",
          conditions: [{
            condition: "screen",
            media_query: "(max-width: 1000px)"
          }],
          card: {
            ...x,
            card_mod: {
              style: `
                  hui-image {
                    opacity: 0.3;
                  }
                  div.navigate {
                    background-color: ${y[w]};
                  }`
            }
          }
        }), m.cards[0].cards.push(
          {
            type: "conditional",
            conditions: [{
              condition: "screen",
              media_query: "(min-width: 1001px)"
            }],
            card: b.area_id == E.area_id ? x : {
              ...x,
              card_mod: {
                style: `
                        hui-image {
                          opacity: 0.3;
                        }
                        div.navigate {
                          background-color: ${y[w]};
                        }`
              }
            }
          }
        ), m;
      },
      z
    );
    O.cards = [...l || [], ...O.cards];
    const P = (m) => m.reduce((b, w) => {
      let x = u.filter($).filter((A) => A.area_id ? A.area_id === E.area_id : W.has(A.device_id)).filter(M(w, e));
      const B = C(x, w, p, w.title, o);
      return b.push(...B), b;
    }, Array()), H = c.map((m) => {
      const b = P(m.rows);
      return b.length > 0 ? {
        attributes: {
          label: m.label,
          icon: m.icon,
          stacked: !0
        },
        card: {
          type: "vertical-stack",
          cards: b
        }
      } : null;
    }).filter(D), L = {
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
                    O,
                    {
                      type: "custom:gap-card",
                      height: 60
                    }
                  ]
                },
                default: {
                  type: "vertical-stack",
                  cards: [
                    L,
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
              cards: [O, L]
            }
          }
        ]
      }]
    };
  }
}
customElements.define(`${I}area-dashboard-strategy`, F);
customElements.define(`${S}area-view-strategy`, U);
const N = { minColumnWidth: 300 };
class j extends HTMLTemplateElement {
  static async generate(n, e) {
    const { config: i } = n, a = {
      ...N,
      ...i
    }, { minColumnWidth: r, replaceCards: s, rows: c } = a;
    if (!c)
      throw Error("rows not defined!");
    const [p] = await Promise.all([
      e.callWS({ type: "config/entity_registry/list" })
    ]);
    return {
      panel: !0,
      cards: [
        {
          type: "vertical-stack",
          cards: c.reduce((l, y) => {
            const _ = p.filter($).filter(M(y, e));
            return l.push(...C(_, y, r, y.title, s)), l;
          }, new Array())
        }
      ]
    };
  }
}
customElements.define(`${S}grid-view-strategy`, j);
class G extends HTMLTemplateElement {
  static async generate(n, e) {
    const { config: i } = n, a = {
      platforms: [
        { platform: "mqtt", title: "Zigbee" },
        { platform: "switchbot", title: "Switchbot" }
      ],
      ...N,
      ...i
    }, { minColumnWidth: r, replaceCards: s, platforms: c } = a, [p] = await Promise.all([
      e.callWS({ type: "config/entity_registry/list" })
    ]), o = {
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
    }, l = p.filter($).filter((d) => {
      var f, h;
      return d.entity_id.split(".")[0] == "sensor" && ((h = (f = e.states[d.entity_id]) == null ? void 0 : f.attributes) == null ? void 0 : h.device_class) == "battery";
    }), y = (d) => !c.map((u) => u.platform).includes(d.platform), _ = C(l.filter(y), o, r, "Other", s);
    return c.forEach((d) => {
      const u = (f) => f.platform === d.platform;
      _.push(...C(l.filter(u), o, r, d.title, s));
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
customElements.define(`${S}battery-view-strategy`, G);
class J extends HTMLTemplateElement {
  static async generate(n, e) {
    const { config: i } = n, a = {
      platforms: [
        { platform: "unifi", title: "UniFi" },
        { platform: "esphome", title: "ESPHome" },
        { platform: "mqtt", title: "Zigbee" }
      ],
      ...N,
      ...i
    }, { minColumnWidth: r, replaceCards: s, platforms: c } = a, [p] = await Promise.all([
      e.callWS({ type: "config/entity_registry/list" })
    ]), o = {
      card: {
        type: "tile",
        entity: "$entity",
        hide_state: !0,
        features: [
          { type: "update-actions", backup: "ask" }
        ]
      }
    }, l = p.filter($).filter((d) => d.entity_id.split(".")[0] == "update"), y = (d) => !c.map((u) => u.platform).includes(d.platform), _ = C(l.filter(y), o, r, "Other", s);
    return c.forEach((d) => {
      const u = (f) => f.platform === d.platform;
      _.push(...C(l.filter(u), o, r, d.title, s));
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
customElements.define(`${S}update-view-strategy`, J);
