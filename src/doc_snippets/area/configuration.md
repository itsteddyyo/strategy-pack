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
{%- for option in AreaStrategyOptions %}
    <tr>
      <td>{{ option.name }}</td>
      <td>{{ option.annotations | find: "tag", "@description" | map: "content" }}</td>
      <td>
      {%- if option.type.type == "reference" -%}
        Object
      {%- elsif option.type.type == "array" -%}
        Array
      {%- else -%}
        {{- option.type.name -}}
      {%- endif -%}
      </td>
      <td>{{ option.flags.isOptional | ternary: "yes", "no" }}</td>
      <td>{{ option.annotations | find: "tag", "@default" | map: "content" }}</td>
      <td>
        <pre>
{{- option.annotations | find: "tag", "@example" | map: "content" -}}
        </pre>
      </td>
    </tr>
{%- endfor %}
  </tbody>
</table>

So a valid dashboard with configration could look like this:

<<<CONFIGURATION_OPTIONS_EXAMPLE>>>

I used all available options in this example. You don`t need to do this!

More on the default configuration [here](#default-config-explained)
