require 'psych'

module Jekyll
  module YamlFormatter
    def toYAMLExclude (input, exclude)
      clonedInput = input.clone
      exclude.each do |x|
        clonedInput.delete(x)
      end
      Psych.dump(clonedInput, :indentation => 4)
    end
    def toYAML (input)
      Psych.dump(input, :indentation => 4)
    end
    def fromYAML (input)
      Psych.safe_load(input)
    end  
  end
end

Liquid::Template.register_filter(Jekyll::YamlFormatter)
