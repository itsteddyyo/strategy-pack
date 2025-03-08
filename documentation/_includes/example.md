So valid YAML for this could look like this:

<details>
<summary>Click for full example</summary>

{% highlight yaml %}
{{ include.options | examplify: include.type | toYAML }}
{% endhighlight %}

I used all available options in this example. You don`t need to do this! Take a look at the required fields for what you need!

</details>
