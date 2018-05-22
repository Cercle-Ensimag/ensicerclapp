from RulesPattern import RulesPattern

class OtherRules (RulesPattern):
    def build(self):
        self.label = "$other"
        self.validate = "false"
        self.inLine = True

class StringRules (RulesPattern):
    def __init__(self, label, length):
        self.superLabel = label
        self.length = length
        super().__init__()

    def build(self):
        self.label = self.superLabel
        self.validate = "newData.isString() && newData.val().length <= " + str(self.length)
        self.inLine = True

class NumberRules (RulesPattern):
    def __init__(self, label):
        self.superLabel = label
        super().__init__()

    def build(self):
        self.label = self.superLabel
        self.validate = "newData.isNumber()"
        self.inLine = True

class BornedNumberRules (NumberRules):
    def __init__(self, label, minV, maxV):
        self.minV = minV
        self.maxV = maxV
        super().__init__(label)

    def build(self):
        super().build()
        self.validate = "newData.isNumber() && newData.val() >= " + str(self.minV) + " && newData.val() <= " + str(self.maxV)

class BooleanRules (RulesPattern):
    def __init__(self, label):
        self.superLabel = label
        super().__init__()

    def build(self):
        self.label = self.superLabel
        self.validate = "newData.isBoolean()"
        self.inLine = True

class IdRules (RulesPattern):
    def __init__(self, label, id):
        self.id = id
        self.superLabel = label
        super().__init__()

    def build(self):
        self.label = self.superLabel
        self.validate = "newData.val() === " + self.id
        self.inLine = True


def doAnd(condList):
    return "(" + ") && (".join(condList) + ")"

def doOr(condList):
    return "(" + ") || (".join(condList) + ")"

def doNot(cond):
    return "!(" + cond + ")"

def computeEmailId():
    """
    Returns a string that evalutes to the user emailId
    """
    return "auth.token.email.replace('@ensimag.fr', '').replace('.', '|')"

def isMember():
    """
    Returns a condition that is true if a user can have access to public data
    in the app
    """
    return "auth !== null && auth.token.email_verified == true"

def hasAllowedEmail(email):
    """
    Returns a condition that is true if the given email is authorized to have an
    account
    """
    return email + ".endsWith('@ensimag.fr')"

def validateUid(uid):
    """
    Returns a condition that is true if the given uid is the same as
    the one of user identified
    """
    return uid + " === auth.uid"

def verifyEmailId(emailId):
    """
    Returns a condition that is true if the given emailId actually belong to
    the user identified
    """
    return doAnd([
        isMember(),
        "root.child('users/'+" + emailId + "+'/'+auth.uid).exists()",
        verifyEmailInList(emailId, "auth.token.email")
    ])

def verifyEmailInList(emailId, email):
    """
    Returns a condition that is true if the given emailId and email are a match
    """
    return email + " === root.child('list/users/'+{0}).val()".replace("{0}", emailId)

def isAdmin():
    """
    Returns a condition that is true if the user identified is an admin
    """
    adminEmail = "auth.token.email === root.child('admin/private/admins/admin{0}').val()"
    rule = doOr([adminEmail.replace("{0}", str(i)) for i in range(1, 4)])
    rule = doAnd([ rule, isMember() ])
    return rule

def isOneAdmin(domain):
    path = "'users/'+" + computeEmailId() + "+'/'+auth.uid+'/admin/" + domain + "-admin'"
    isOneAdmin_v = "root.child(" + path + ").val() == true"
    return isOneAdmin_v + " && " + isMember()

def getJournalistPath():
    return "'actus/journalists/users/'+" + computeEmailId()

def isJournalist():
    isJournalist_v = "root.child(" + getJournalistPath() + ").exists()"
    return isJournalist_v + " && " + isMember()

def journalistsGroupExists():
    groupPath = getJournalistPath() + "+'/groupId'"
    return "root.child(" + groupPath + ").val() === newData.val()"

def journalistsGroupTheSame():
    groupPath = getJournalistPath() + "+'/groupId'"
    return "root.child(" + groupPath + ").val() === newData.child('groupId').val()"

def getComRespPath():
    return "'events/com-resps/resps/'+" + computeEmailId()

def isComResp():
    isComResp_v = "root.child(" + getComRespPath() + ").exists()"
    return isComResp_v + " && " + isMember()

def comRespGroupExists():
    groupPath = getComRespPath() + "+'/groupId'"
    return "root.child(" + groupPath + ").val() === newData.val()"

def comRespGroupTheSame():
    groupPath = getComRespPath() + "+'/groupId'"
    return "root.child(" + groupPath + ").val() === newData.child('groupId').val()"

def getAssessorPath():
    return "'vote/assessors/'+" + computeEmailId()

def isAssessor():
    isAssessor_v = "root.child(" + getAssessorPath() + ").exists()"
    return isAssessor_v + " && " + isMember()

def pollStarted(pollId):
    return "root.child('vote/polls/'+" + pollId + "+'/started').val() == true"

def getCafetRespPath():
    return "'cafet/cafetResps/resps/'+" + computeEmailId()

def isCafetResp():
    isCafetResp_v = "root.child(" + getCafetRespPath() + ").exists()"
    return isCafetResp_v + " && " + isMember()
