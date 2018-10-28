from RulesPattern import RulesPattern
from common import OtherRules, NumberRules, StringRules, IdRules, doAnd, doOr, isAdmin, isMember, isJournalist, journalistsGroupTheSame, actusGroupIdExists, isOneAdmin

class ActusRules (RulesPattern):
    def build(self):
        self.label = "actus"
        self.add(JournalistsRules())
        self.add(ArticlesRules())
        self.add(OtherRules())


# journalists node
class JournalistsRules (ActusRules):
    def build(self):
        self.label = "journalists"
        self.read = doOr([ isJournalist(), isOneAdmin("actus") ])
        self.write = isOneAdmin("actus")

        self.add(GroupsRules())
        self.add(UsersRules())
        self.add(OtherRules())

class GroupsRules (JournalistsRules):
    def build(self):
        self.label = "groups"
        self.add(GroupRules())

class GroupRules (GroupsRules):
    def build(self):
        self.label = "$groupId"
        self.add(StringRules("groupId", 30))
        self.add(StringRules("displayName", 30))
        self.add(OtherRules())

class UsersRules (JournalistsRules):
    def build(self):
        self.label = "users"
        self.add(UserRules())

class UserRules (UsersRules):
    def build(self):
        self.label = "$emailId"
        self.add(IdRules("emailId", self.label))
        self.add(GroupIdRules(1))
        self.add(GroupIdRules(2))
        self.add(OtherRules())

class GroupIdRules (StringRules):
	def __init__(self, number):
		self.number = str(number)
		super().__init__("groupId", 30)

	def build(self):
		super().build()
		self.label += self.number
		self.validate = doAnd([
			self.validate,
			actusGroupIdExists("newData.val()")
		])

# actus node
class ArticlesRules (ActusRules):
    def build(self):
        self.label = "actus"
        self.read = isMember()
        self.add(ArticleRules())

class ArticleRules (ArticlesRules):
    def __init__(self):
        self.articleId = "$actuId"
        super().__init__()

    def build(self):
        self.label = self.articleId
        self.write = doOr([
			isOneAdmin("actus"),
			doAnd([
				isJournalist(),
				doOr([
					journalistsGroupTheSame("newData"),
					doAnd([
						"!newData.exists()",
						journalistsGroupTheSame("data")
					])
				])
			])
		])
        self.indexOn = ["date"]

        self.add(IdRules("id", self.articleId))
        self.add(StringRules("title", 30))
        self.add(StringRules("description", 2000))
        self.add(StringRules("image", 500))
        self.add(StringRules("pdfLink", 500))
        self.add(NumberRules("date"))
        self.add(StringRules("author", 50))
        self.add(ArticleGroupIdRules(1))
        self.add(OtherRules())

class ArticleGroupIdRules (StringRules):
	def __init__(self, number):
		self.number = str(number)
		super().__init__("groupId", 30)

	def build(self):
		super().build()
		self.label += self.number
		self.validate = doAnd([
			self.validate,
			actusGroupIdExists("newData.val()")
		])
		self.inLine = True
