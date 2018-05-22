from RulesPattern import RulesPattern
from actus_rules import ActusRules

class MainRules (RulesPattern):
    def build(self):
        self.label = "b/{bucket}/o"
        self.add(ActusRules())

if __name__ == "__main__":
    with open("storage/storage_rules", "w") as file:
        file.write(str(MainRules()))
