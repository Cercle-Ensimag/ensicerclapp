from RulesPattern import RulesPattern
from common import OtherRules, BooleanRules, StringRules, BornedNumberRules, NumberRules, IdRules, doAnd, doOr, isAdmin, isMember, isOneAdmin

class JobAdsRules (RulesPattern):
    def build(self):
        self.label = "jobads"
        self.add(JobAdsListRules())
        self.add(OtherRules())

# jobads list node
class JobAdsListRules (JobAdsRules):
	def build(self):
		self.label = "jobads"
		self.read = isMember()
		self.write = isOneAdmin("jobads")
		self.indexOn = ["start"]
		self.add(JobAdRules())

# jobad node

class JobAdRules (JobAdsListRules):
    def __init__(self):
        self.jobadId = "$jobadId"
        super().__init__()

    def build(self):
        self.label = self.jobadId
        self.write = isOneAdmin("jobads")

        self.add(IdRules("id", self.jobadId))
        self.add(StringRules("title", 50))
        self.add(StringRules("description", 5000))
        self.add(BornedNumberRules("type", 0, 2))
        self.add(NumberRules("start"))
        self.add(StringRules("length", 20))
        self.add(StringRules("technologies", 100))
        self.add(StringRules("contact", 200))
        self.add(StringRules("author", 30))
        self.add(BooleanRules("done"))
        self.add(OtherRules())
