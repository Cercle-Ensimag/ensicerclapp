from RulesPattern import RulesPattern
from common import OtherRules, StringRules, NumberRules, BooleanRules, IdRules, doAnd, doOr, isOneAdmin, isCafetResp, verifyEmailId, isMember

class CafetRules (RulesPattern):
    def build(self):
        self.label = "cafet"
        self.read = isOneAdmin("cafet")
        self.write = isOneAdmin("cafet")

        self.add(CafetRespsRules())
        self.add(TrezoRules())
        self.add(ArchivesRules())
        self.add(ActiveUsersRules())
        self.add(HistoryRules())
        self.add(PublicDataRules())
        self.add(OtherRules())


# common
class UserRules (CafetRules):
    def build(self):
        self.label = "$emailId"
        self.add(IdRules("emailId", self.label))
        self.add(BooleanRules("activated"))
        self.add(NumberRules("credit"))
        self.add(CreationDateRules())
        self.add(NumberRules("lastTransactionDate"))
        self.add(ProfileRules())
        self.add(OtherRules())

class CreationDateRules (UserRules):
    def build(self):
        self.label = "creationDate"
        # compares to old data to avoid creating a new user with the same emailId as an old one
        self.validate = "newData.isNumber() && (!data.exists() || newData.val() === data.val())"
        self.inLine = True

class ProfileRules (UserRules):
    def build(self):
        self.label = "profile"

        childLabel1 = "firstName"
        childLabel2 = "lastName"
        self.validate = "newData.hasChildren(['" + childLabel1 + "', '" + childLabel2 + "'])"
        self.add(StringRules(childLabel1, 30))
        self.add(StringRules(childLabel2, 30))
        self.add(StringRules("email", 50))
        self.add(BooleanRules("exte"))
        self.add(OtherRules())

    def shouldBeNull(self):
        """
        This function should be called to require the profile to be null,
        for example when a profile is not needed
        """
        self.validate = "!newData.exists()"
        self.RulesList = []
        self.inLine = True


# cafet resps node
class CafetRespsRules (CafetRules):
    def build(self):
        self.label = "cafetResps"
        self.read = isCafetResp()
        self.add(CafetRespsListRules())
        self.add(DayTransactionsRules())
        self.add(OtherRules())

class CafetRespsListRules (CafetRespsRules):
    def build(self):
        self.label = "resps"
        self.add(CafetRespRules())

class CafetRespRules (CafetRespsListRules):
    def build(self):
        self.label = "$emailId"
        self.add(IdRules("emailId", self.label))
        self.add(OtherRules())

class DayTransactionsRules (CafetRespsRules):
    def build(self):
        self.label = "dayTransactions"
        self.write = isCafetResp()
        self.add(DayUserRules())

class DayUserRules (DayTransactionsRules):
    def build(self):
        self.label = "$emailId"
        self.add(DayTransactionRules())

class DayTransactionRules (DayUserRules):
    def build(self):
        self.label = "$transaction"
        self.add(BornedNumberRules("value", -1000, 1000))
        self.add(NumberRules("date"))
        self.add(CafetRespRefRules())
        self.add(OtherRules())

class BornedNumberRules (NumberRules):
    def __init__(self, label, minV, maxV):
        self.minV = minV
        self.maxV = maxV
        super().__init__(label)

    def build(self):
        super().build()
        self.validate = "newData.isNumber() && newData.val() >= " + str(self.minV) + " && newData.val() <= " + str(self.maxV)

class CafetRespRefRules (CafetRespsRules):
    def build(self):
        self.label = "resp"
        self.validate = "root.child('cafet/cafetResps/resps/'+newData.val()).exists()"
        self.inLine = True


# trezo node
class TrezoRules (CafetRules):
    def build(self):
        self.label = "trezo"
        self.add(AccountsRules())
        self.add(OtherRules())

class AccountsRules (TrezoRules):
    def build(self):
        self.label = "accounts"
        self.add(AccountRules())

class AccountRules (UserRules):
    def build(self):
        super().build()
        self.validate = "data.exists() && newData.exists()"
        self.RulesList[-2].shouldBeNull()


# archives node
class ArchivesRules (CafetRules):
    def build(self):
        self.label = "archives"
        self.add(ArchivedUsersRules())
        self.add(OtherRules())

class ArchivedUsersRules (ArchivesRules):
    def build(self):
        self.label = "users"
        self.add(ArchivedUserRules())

class ArchivedUserRules (UserRules):
    def build(self):
        super().build()
        stillUser = "data.exists() && newData.exists()"

        # when creating a user/changing id, make sure he doesn't already exists
        noHistory = "!root.child('cafet/history/'+$emailId).exists()"

        # when archiving a user, writen user should be the same as the one that was active
        sameCredit = "root.child('cafet/users/'+" + self.label + "+'/credit').val() === newData.child('credit').val()"
        sameCreation = "root.child('cafet/users/'+" + self.label + "+'/creationDate').val() === newData.child('creationDate').val()"
        sameUser = "(" + sameCredit + ") && (" + sameCreation + ")"

        newUser = doAnd([ "!data.exists()", doOr([ noHistory, sameUser ])])

        self.validate = doOr([ stillUser, newUser ])


# users node
class ActiveUsersRules (ArchivesRules):
    def build(self):
        self.label = "users"
        self.add(ActiveUserRules())

class ActiveUserRules (UserRules):
    def build(self):
        super().build()
        modifUser = "data.exists() && newData.exists()"

        # when creating a user/changing id, make sure he doesn't already exists
        noHistory = "!root.child('cafet/history/'+$emailId).exists()"

        # when restoring a user, writen user should be the same as the one that was archived
        sameCredit = "root.child('cafet/archives/users/'+" + self.label + "+'/credit').val() === newData.child('credit').val()"
        sameCreation = "root.child('cafet/archives/users/'+" + self.label + "+'/creationDate').val() === newData.child('creationDate').val()"
        sameUser = "(" + sameCredit + ") && (" + sameCreation + ")"

        newUser = doAnd([ "!data.exists()", doOr([ noHistory, sameUser ])])

        # check for day transactions before deleting/changing id
        deleteUser = "!newData.exists() && !root.child('cafet/cafetResps/dayTransactions/'+" + self.label + ").exists()"

        self.validate = doOr([modifUser, newUser, deleteUser])
        self.read = verifyEmailId(self.label);


# history node
class HistoryRules (CafetRules):
    def build(self):
        self.label = "history"
        self.add(UserHistoryRules())

class UserHistoryRules (HistoryRules):
    def build(self):
        self.label = "$emailId"
        self.read = verifyEmailId(self.label)
        self.add(TransactionRules())

class TransactionRules (UserHistoryRules):
    def build(self):
        self.label = "$transaction"
        self.add(BornedNumberRules("value", -1000, 1000))
        self.add(NumberRules("newCredit"))
        self.add(NumberRules("oldCredit"))
        self.add(NumberRules("date"))
        self.add(OtherRules())


# public data node
class PublicDataRules (CafetRules):
    def build(self):
        self.label = "public"
        self.read = isMember()
        self.add(IngredientsRules())
        self.add(InfoRules())
        self.add(OtherRules())

class IngredientsRules (PublicDataRules):
    def build(self):
        self.label = "ingredients"
        self.add(GroupsRules())
        self.add(IndividualRules())
        self.add(RecipesRules())
        self.add(OtherRules())

class GroupsRules (IngredientsRules):
    def build(self):
        self.label = "groups"
        self.add(StringRules("$group", 30))

class IndividualRules (IngredientsRules):
    def build(self):
        self.label = "individual"
        self.add(IngredientRules())

class IngredientRules (IndividualRules):
    def build(self):
        self.label = "$ingredient"
        self.add(StringRules("name", 30))
        self.add(StringRules("group", 30)) # FIXME
        self.add(StringRules("alias", 30))
        self.add(StringRules("image", 500))
        self.add(OtherRules())

class RecipesRules (IngredientsRules):
    def build(self):
        self.label = "recipes"
        self.add(RecipeRules())

class RecipeRules (RecipesRules):
    def build(self):
        self.label = "$recipe"
        self.add(StringRules("$ingredients", 30)) # FIXME


class InfoRules (PublicDataRules):
    def build(self):
        self.label = "info"
        self.add(BooleanRules("service-opened"))
        self.add(BooleanRules("service-canceled"))
        self.add(StringRules("cancel-message", 200))
        self.add(NumberRules("day"))
        self.add(OtherRules())
