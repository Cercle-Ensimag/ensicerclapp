from RulesPattern import RulesPattern
# from common import OtherRules, StringRules, IdRules, doAnd, doOr, isAdmin, isMember, isJournalist, journalistsGroupExists, journalistsGroupTheSame, isOneAdmin
from common import isMember
#
class ActusRules (RulesPattern):
	def build(self):
		self.label = "actus"
		self.read = isMember()


# # journalists node
# class JournalistsRules (ActusRules):
#     def build(self):
#         self.label = "journalists"
#         self.read = doOr([ isJournalist(), isOneAdmin("actus") ])
#         self.write = isOneAdmin("actus")
#
#         self.add(GroupsRules())
#         self.add(UsersRules())
#         self.add(OtherRules())
#
# class GroupsRules (JournalistsRules):
#     def build(self):
#         self.label = "groups"
#         self.add(GroupRules())
#
# class GroupRules (GroupsRules):
#     def build(self):
#         self.label = "$groupId"
#         self.add(StringRules("groupId", 30))
#         self.add(StringRules("displayName", 30))
#         self.add(OtherRules())
#
# class UsersRules (JournalistsRules):
#     def build(self):
#         self.label = "users"
#         self.add(UserRules())
#
# class UserRules (UsersRules):
#     def build(self):
#         self.label = "$emailId"
#         self.add(IdRules("emailId", self.label))
#         self.add(GroupIdRules())
#         self.add(OtherRules())
#
# class GroupIdRules (UserRules):
#     def build(self):
#         self.label = "groupId"
#         self.validate = "root.child('actus/journalists/groups/'+newData.val()).exists()"
#         self.inLine = True
#
#
# # actus node
# class ArticlesRules (ActusRules):
#     def build(self):
#         self.label = "actus"
#         self.read = isMember()
#         self.add(ArticleRules())
#
# class ArticleRules (ArticlesRules):
#     def __init__(self):
#         self.articleId = "$actuId"
#         super().__init__()
#
#     def build(self):
#         self.label = self.articleId
#         self.write = doOr([ isOneAdmin("actus"), doAnd([ isJournalist(), journalistsGroupTheSame() ]) ])
#
#         self.add(IdRules("id", self.articleId))
#         self.add(StringRules("title", 30))
#         self.add(StringRules("description", 2000))
#         self.add(StringRules("image", 500))
#         self.add(StringRules("date", 50))
#         self.add(StringRules("author", 50))
#         self.add(ArticleGroupIdRules())
#         self.add(OtherRules())
#
# class ArticleGroupIdRules (ArticleRules):
#     def build(self):
#         self.label = "groupId"
#         self.validate = journalistsGroupExists()
#         self.inLine = True
