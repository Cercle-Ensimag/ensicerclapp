from RulesPattern import RulesPattern
from common import OtherRules, StringRules, NumberRules, IdRules, doAnd, doOr, isAdmin, isMember, isComResp, comRespGroupExists, comRespGroupTheSame, isOneAdmin

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
        self.add(GroupIdRules())
        self.add(OtherRules())

class GroupIdRules (UserRules):
    def build(self):
        self.label = "groupId"
        self.validate = "root.child('events/com-resps/groups/'+newData.val()).exists()"
        self.inLine = True


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
        self.add(StringRules("title", 30))
        self.add(StringRules("description", 2000))
        self.add(StringRules("image", 500))
        self.add(NumberRules("start"))
        self.add(NumberRules("end"))
        self.add(StringRules("location", 30))
        self.add(StringRules("asso", 30))
        self.add(StringRules("price", 30))
        self.add(EventGroupIdRules())
        self.add(OtherRules())

class EventGroupIdRules (EventRules):
    def build(self):
        self.label = "groupId"
        self.validate = comRespGroupExists()
        self.inLine = True
