from RulesPattern import RulesPattern
from common import OtherRules, BooleanRules, StringRules, BornedNumberRules, NumberRules, IdRules, doAnd, doOr, isAdmin, isMember, isOneAdmin

class AnnoncesRules (RulesPattern):
    def build(self):
        self.label = "annonces"
        self.add(AnnoncesListRules())
        self.add(OtherRules())

# annonces list node
class AnnoncesListRules (AnnoncesRules):
    def build(self):
        self.label = "annonces"
        self.read = isMember()
        self.write = isOneAdmin("annonces")
        self.add(AnnonceRules())

# annonce node

class AnnonceRules (AnnoncesListRules):
    def __init__(self):
        self.annonceId = "$annonceId"
        super().__init__()

    def build(self):
        self.label = self.annonceId
        self.write = isOneAdmin("annonces")
        self.indexOn = ["start"]

        self.add(IdRules("id", self.annonceId))
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
