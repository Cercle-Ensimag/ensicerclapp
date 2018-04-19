from RulesPattern import RulesPattern
from common import OtherRules, StringRules, BooleanRules, isAdmin, isMember, hasEnsimagEmail

class AdminRules (RulesPattern):
    def build(self):
        self.label = "admin"
        self.add(PublicRules())
        self.add(PrivateRules())
        self.add(OtherRules())


# public node
class PublicRules (AdminRules):
    def build(self):
        self.label = "public"
        self.read = isMember()

        self.add(ModulesRules())
        self.add(OtherRules())


class ModulesRules (PublicRules):
    def build(self):
        self.label = "modules"
        self.add(ModuleRules())

class ModuleRules (ModulesRules):
    def build(self):
        self.label = "$module"

        self.add(StringRules("name", 30))
        self.add(BooleanRules("disabled"))
        self.add(OtherRules())


# private node
class PrivateRules (AdminRules):
    def build(self):
        self.label = "private"
        self.read = isAdmin()

        self.add(AdminsRules())
        self.add(OtherRules())

class AdminsRules (PrivateRules):
    def build(self):
        self.label = "admins"
        self.add(AdminEmailsRules())

class AdminEmailsRules (AdminsRules):
    def build(self):
        self.label = "$email"
        self.validate = hasEnsimagEmail()
        self.inLine = True
