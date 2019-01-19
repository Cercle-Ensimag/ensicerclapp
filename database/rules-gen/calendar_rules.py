from RulesPattern import RulesPattern
from common import StringRules, NumberRules, BornedNumberRules, BooleanRules, OtherRules, IdRules, validateUid

class CalendarRules (RulesPattern):
    def build(self):
        self.label = "calendar"
        self.add(UsersRules())
        self.add(OtherRules())

class UsersRules (CalendarRules):
    def build(self):
        self.label = "users"
        self.add(UserRules())

class UserRules (UsersRules):
    def __init__(self):
        self.uid = "$userId"
        super().__init__()

    def build(self):
        self.label = self.uid
        self.add(SettingsRules())
        self.add(AssosEventsRules())
        self.add(PersoEventsRules())
        self.add(OtherRules())


# settings node
class SettingsRules (UserRules):
	def build(self):
		self.label = "settings"
		self.read = validateUid(self.uid)
		self.write = validateUid(self.uid)
		self.add(ResourcesRules())
		self.add(BooleanRules("icsDownload"))
		self.add(BooleanRules("assosEventsByDefault"))
		self.add(OtherRules())

class ResourcesRules (SettingsRules):
    def build(self):
        self.label = "resources"
        self.validate = "newData.val().matches(/^[0-9]*(,[0-9]+)*$/)"
        self.inLine = True


# assos events node
class AssosEventsRules (UserRules):
    def build(self):
        self.label = "assos"
        self.read = validateUid(self.uid)
        self.write = validateUid(self.uid)
        self.add(AssosEventRules())

class AssosEventRules (AssosEventsRules):
    def __init__(self):
        self.eventId = "$eventId"
        super().__init__()

    def build(self):
        self.label = self.eventId
        self.add(IdRules("eventId", self.eventId))
        self.add(OtherRules())


# Perso events node
class PersoEventsRules (UserRules):
    def build(self):
        self.label = "perso"
        self.read = validateUid(self.uid)
        self.add(PersoEventRules())

class PersoEventRules (PersoEventsRules):
    def __init__(self):
        self.eventId = "$eventId"
        super().__init__()

    def build(self):
        self.label = self.eventId
        self.write = validateUid(self.uid)
        self.add(StringRules("id", 30))
        self.add(StringRules("title", 80))
        self.add(NumberRules("start"))
        self.add(NumberRules("end"))
        self.add(BornedNumberRules("occurences", 1, 42))
        self.add(StringRules("location", 300))
        self.add(StringRules("type", 30))
        self.add(OtherRules())
