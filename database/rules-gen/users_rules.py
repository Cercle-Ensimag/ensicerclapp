from RulesPattern import RulesPattern
from common import OtherRules, StringRules, BooleanRules, isAdmin, validateUid, verifyEmailInList

class UsersRules (RulesPattern):
    def build(self):
        self.label = "users"
        self.read = isAdmin()
        self.add(AuthUserRules())


class AuthUserRules (UsersRules):
    def __init__(self):
        self.emailId = "$emailId"
        super().__init__()

    def build(self):
        self.label = self.emailId
        self.add(UidRules())
        self.add(UserRules())


class UidRules (AuthUserRules):
    def build(self):
        self.label = "uid"
        self.validate = "false"
        self.inLine = True


class UserRules (AuthUserRules):
    def __init__(self):
        self.uid = "$user"
        super().__init__()

    def build(self):
        self.label = self.uid
        self.read = validateUid(self.uid)

        self.add(AdminPartRules())
        self.add(AccountPartRules())
        self.add(OtherRules())

# Admin node
class AdminPartRules (UserRules):
    def build(self):
        self.label = "admin"
        self.write = isAdmin()

        self.add(EmailRules())
        self.add(BooleanRules("cafet-admin"))
        self.add(BooleanRules("events-admin"))
        self.add(BooleanRules("actus-admin"))
        self.add(BooleanRules("vote-admin"))
        self.add(BooleanRules("nsigma-admin"))
        self.add(BooleanRules("annonces-admin"))
        self.add(OtherRules())

class EmailRules (AdminPartRules):
    def build(self):
        self.label = "email"
        self.validate = verifyEmailInList(self.emailId, "newData.val()")
        self.inLine = True


# Account node
class AccountPartRules (UserRules):
    def build(self):
        self.label = "account"
        self.write = validateUid(self.uid)

        self.add(NameRules())
        self.add(StringRules("photoURL", 500))
        self.add(OtherRules())

class NameRules (AccountPartRules):
    def build(self):
        self.label = "name"

        childLabel1 = "firstName"
        childLabel2 = "lastName"
        self.validate = "newData.hasChildren(['" + childLabel1 + "', '" + childLabel2 + "'])"

        self.add(StringRules(childLabel1, 30))
        self.add(StringRules(childLabel2, 30))
        self.add(StringRules("login", 30))

        self.add(OtherRules())
