from RulesPattern import RulesPattern
from common import OtherRules, doOr, isAdmin, isOneAdmin, isAssessor

class ListRules (RulesPattern):
    def build(self):
        self.label = "list"
        self.add(UpdateRules())
        self.add(UsersRules())
        self.add(OtherRules())

class UpdateRules (ListRules):
    def build(self):
        self.label = "update"
        self.validate = "false"
        self.inLine = True

class UsersRules (ListRules):
    def build(self):
        self.label = "users"
        self.read = doOr([ isAdmin(), isOneAdmin("vote"), isOneAdmin("cafet"), isAssessor() ])