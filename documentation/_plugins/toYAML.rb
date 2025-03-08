require 'psych'

module Jekyll
  module YamlFormatter
    def toYAML (input)
      Psych.dump(input, :indentation => 4)
    end
    def fromYAML (input)
      Psych.safe_load(input)
    end  
  end
end

Liquid::Template.register_filter(Jekyll::YamlFormatter)
