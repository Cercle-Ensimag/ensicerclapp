from RulesPattern import RulesPattern
from common import OtherRules, StringRules, NumberRules, IdRules, doAnd, doOr, isAdmin, isMember, isComResp, comRespGroupExists, comRespGroupTheSame, eventGroupIdExists, isOneAdmin

class EventsRules (RulesPattern):
    def build(self):
        self.label = "events"
        self.add(ComRespsRules())
        self.add(EventsListRules())
        self.add(OtherRules())


# com resps node
class ComRespsRules (EventsRules):
    def build(self):
        self.label = "com-resps"
        self.read = doOr([ isComResp(), isOneAdmin("events")])
        self.write = isOneAdmin("events")

        self.add(GroupsRules())
        self.add(UsersRules())
        self.add(OtherRules())

class GroupsRules (ComRespsRules):
    def build(self):
        self.label = "groups"
        self.add(GroupRules())

class GroupRules (GroupsRules):
    def build(self):
        self.label = "$groupId"
        self.add(StringRules("groupId", 30))
        self.add(StringRules("displayName", 30))
        self.add(OtherRules())

class UsersRules (ComRespsRules):
    def build(self):
        self.label = "resps"
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
			eventGroupIdExists("newData.val()")
		])

# events node
class EventsListRules (EventsRules):
    def build(self):
        self.label = "events"
        self.read = isMember()
        self.add(EventRules())

class EventRules (EventsListRules):
    def __init__(self):
        self.eventId = "$eventId"
        super().__init__()

    def build(self):
        self.label = self.eventId
        self.write = doOr([ isOneAdmin("events"), doAnd([ isComResp(), comRespGroupTheSame() ])])
        self.indexOn = ["start"]

        self.add(IdRules("id", self.eventId))
        self.add(StringRules("title", 50))
        self.add(StringRules("description", 2000))
        self.add(StringRules("image", 500))
        self.add(NumberRules("start"))
        self.add(NumberRules("end"))
        self.add(StringRules("location", 300))
        self.add(StringRules("price", 50))
        self.add(EventGroupIdRules(1))
        self.add(EventGroupIdRules(2))
        self.add(EventGroupIdRules(3))
        self.add(OtherRules())

class EventGroupIdRules (StringRules):
	def __init__(self, number):
		self.number = str(number)
		super().__init__("groupId", 30)

	def build(self):
		super().build()
		self.label += self.number
		self.validate = doAnd([
			self.validate,
			eventGroupIdExists("newData.val()")
		])
		self.inLine = True
