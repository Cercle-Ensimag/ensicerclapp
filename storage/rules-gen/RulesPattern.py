class RulesPattern:

	def __init__(self):
		self.label = ""
		self.read = ""
		self.write = ""

		self.RulesList = []
		self.build()

	def add(self, rule):
		self.RulesList.append(rule)

	def build(self):
		pass

	def toStrings(self):
		lines = []
		lines.append("match /" + self.label + " {\n")

		if self.read != "": lines.append('\tallow read: if ' + self.read + ';\n')
		if self.write != "": lines.append('\tallow write: if ' + self.write + ';\n')

		for rule in self.RulesList:
			for line in rule.toStrings():
				lines.append("\t" + line)
		
		lines.append("}\n")
		return lines

	def __str__(self):
		string = "service firebase.storage {\n"
		for line in self.toStrings():
			string += "\t" + line
		string += "}\n"
		return string
