class RulesPattern:

    def __init__(self):
        self.label = ""
        self.read = ""
        self.write = ""
        self.validate = ""
        self.indexOn = []
        self.inLine = False

        self.RulesList = []
        self.build()

    def add(self, rule):
        self.RulesList.append(rule)

    def build(self):
        pass

    def toStrings(self):
        lines = []

        if not self.inLine:
            lines.append('"' + self.label + '": {\n')

            if self.read != "": lines.append('\t".read" : "' + self.read + '",\n')
            if self.write != "": lines.append('\t".write" : "' + self.write + '",\n')
            if self.validate != "": lines.append('\t".validate" : "' + self.validate + '",\n')
            if self.indexOn != []: lines.append('\t".indexOn" : ' + str(self.indexOn).replace("'", '"') + ',\n')

            for rule in self.RulesList:
                for line in rule.toStrings():
                    lines.append("\t" + line)

            lines.append('},\n')

        else:
            if self.read != "": lines.append('"' + self.label + '": { ".read" : "' + self.read + '" },\n')
            if self.write != "": lines.append('"' + self.label + '": { ".write" : "' + self.write + '" },\n')
            if self.validate != "": lines.append('"' + self.label + '": { ".validate" : "' + self.validate + '" },\n')

        return lines


    def __str__(self):
        string = "{\n"
        for line in self.toStrings():
                string += "\t" + line
        string += "}\n"
        return string
