from RulesPattern import RulesPattern
from users_rules import UsersRules
from admin_rules import AdminRules
from actus_rules import ActusRules
from cafet_rules import CafetRules
from nsigma_rules import NsigmaRules
from jobads_rules import JobAdsRules
from calendar_rules import CalendarRules
from events_rules import EventsRules
from vote_rules import VoteRules
from list_rules import ListRules
from common import OtherRules

class MainRules (RulesPattern):
    def build(self):
        self.label = "rules"
        self.add(UsersRules())
        self.add(AdminRules())
        self.add(ActusRules())
        self.add(CafetRules())
        self.add(NsigmaRules())
        self.add(JobAdsRules())
        self.add(CalendarRules())
        self.add(EventsRules())
        self.add(VoteRules())
        self.add(ListRules())

        self.add(OtherRules())

if __name__ == "__main__":
    with open("database/database_rules.json", "w") as file:
        file.write(str(MainRules()))
