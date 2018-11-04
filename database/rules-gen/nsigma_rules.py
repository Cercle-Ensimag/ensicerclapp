from RulesPattern import RulesPattern
from common import OtherRules, BooleanRules, StringRules, BornedNumberRules, NumberRules, IdRules, doAnd, doOr, isAdmin, isMember, isOneAdmin

class NsigmaRules (RulesPattern):
    def build(self):
        self.label = "nsigma"
        self.add(NsigmaJobAdsListRules())
        self.add(OtherRules())

# nsigma jobads list node
class NsigmaJobAdsListRules (NsigmaRules):
	def build(self):
		self.label = "jobads"
		self.read = isMember()
		self.write = isOneAdmin("nsigma")
		self.indexOn = ["start"]
		self.add(NsigmaJobAdRules())

# nsigma jobad node

class NsigmaJobAdRules (NsigmaJobAdsListRules):
    def __init__(self):
        self.nsigmaJobAdId = "$nsigmaJobAdId"
        super().__init__()

    def build(self):
        self.label = self.nsigmaJobAdId
        self.write = isOneAdmin("nsigma")

        self.add(IdRules("id", self.nsigmaJobAdId))
        self.add(StringRules("title", 50))
        self.add(StringRules("description", 5000))
        self.add(BornedNumberRules("type", 0, 6))
        self.add(NumberRules("start"))
        self.add(NumberRules("end"))
        self.add(StringRules("technologies", 100))
        self.add(StringRules("difficulty", 100))
        self.add(BornedNumberRules("remuneration", 0, 500000))
        self.add(StringRules("form", 100))
        self.add(BooleanRules("done"))
        self.add(OtherRules())
