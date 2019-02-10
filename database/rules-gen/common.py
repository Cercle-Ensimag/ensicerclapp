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
	return (
			"auth.token.email"
			+ ".replace('@ensimag.fr', '')"
			+ ".replace('@phelma.grenoble-inp.fr', '')"
			+ ".replace('.', '|')"
	)

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
	return doOr([
			email + ".endsWith('@ensimag.fr')",
			email + ".endsWith('@phelma.grenoble-inp.fr')"
	])

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
	"""
	Returns a condition that is true if the authentified user is admin of the given domain
	"""
	path = "'users/'+" + computeEmailId() + "+'/'+auth.uid+'/admin/" + domain + "-admin'"
	isOneAdmin_v = "root.child(" + path + ").val() == true"
	return isOneAdmin_v + " && " + isMember()

def getJournalistPath():
	"""
	Returns the path in the database for journalist data
	"""
	return "'actus/journalists/users/'+" + computeEmailId()

def isJournalist():
	"""
	Returns a condition that is true if the authentified user is journalist
	"""
	isJournalist_v = "root.child(" + getJournalistPath() + ").exists()"
	return isJournalist_v + " && " + isMember()

def journalistsGroupExists(groupId):
	"""
	Returns a condition that is true if the given groupId (newData.val())
	matches a groupId of the authentified user
	"""
	return doOr([
			doAnd([
					"root.child(" + getJournalistPath() + "+'/groupId" + str(i) + "').exists()",
					"root.child(" + getJournalistPath() + "+'/groupId" + str(i) + "').val() !== null",
					"root.child(" + getJournalistPath() + "+'/groupId" + str(i) + "').val() !== ''",
					"root.child(" + getJournalistPath() + "+'/groupId" + str(i) + "').val() === " + groupId
			]) for i in range(1, 3)
	])

def journalistsGroupTheSame(snap):
	"""
	Returns a condition that is true if on of the comResp groupId matches
	one of the actu groupId
	"""
	return doOr([
			journalistsGroupExists(snap + ".child('groupId" + str(i) + "').val()") for i in range (1, 2)
	])

def actusGroupIdExists(groupId):
	"""
	Returns a condition that is true if the given groupId is defined
	"""
	return "root.child('actus/journalists/groups/'+" + groupId + ").exists()"

def getComRespPath():
	"""
	Returns the path in the database for comResp data
	"""
	return "'events/com-resps/resps/'+" + computeEmailId()

def isComResp():
	"""
	Returns a condition that is true if the authentified user is comResp
	"""
	isComResp_v = "root.child(" + getComRespPath() + ").exists()"
	return isComResp_v + " && " + isMember()

def comRespGroupExists(groupId):
	"""
	Returns a condition that is true if the given groupId (newData.val())
	matches a groupId of the authentified user
	"""
	return doOr([
			doAnd([
					"root.child(" + getComRespPath() + "+'/groupId" + str(i) + "').exists()",
					"root.child(" + getComRespPath() + "+'/groupId" + str(i) + "').val() !== null",
					"root.child(" + getComRespPath() + "+'/groupId" + str(i) + "').val() !== ''",
					"root.child(" + getComRespPath() + "+'/groupId" + str(i) + "').val() === " + groupId
			]) for i in range(1, 3)
	])

def comRespGroupTheSame(snap):
	"""
	Returns a condition that is true if on of the comResp groupId matches
	one of the event groupId
	"""
	return doOr([
			comRespGroupExists(snap + ".child('groupId" + str(i) + "').val()") for i in range (1, 4)
	])

def eventGroupIdExists(groupId):
	"""
	Returns a condition that is true if the given groupId is defined
	"""
	return "root.child('events/com-resps/groups/'+" + groupId + ").exists()"

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
