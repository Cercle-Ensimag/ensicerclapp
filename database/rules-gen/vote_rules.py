from RulesPattern import RulesPattern
from common import OtherRules, StringRules, BooleanRules, IdRules, doAnd, doOr, doNot, isAssessor, isOneAdmin, verifyEmailId, isMember, pollStarted

class VoteRules (RulesPattern):
    def build(self):
        self.label = "vote"
        self.add(AssessorsRules())
        self.add(PollsRules())
        self.add(AssessedVotesRules())
        self.add(ResultsRules())
        self.add(UsersVotesRules())
        self.add(OtherRules())


# assessor node
class AssessorsRules (VoteRules):
    def build(self):
        self.label = "assessors"
        self.read = doOr([ isOneAdmin("vote"), isAssessor() ])
        self.write = isOneAdmin("vote")
        self.add(AssessorRules())

class AssessorRules (AssessorsRules):
    def build(self):
        self.label = "$emailId"
        self.add(IdRules("emailId", self.label))


# polls node
class PollsRules (VoteRules):
    def build(self):
        self.label = "polls"
        self.read = isMember()
        self.write = isOneAdmin("vote")
        self.add(PollRules())

class PollRules (PollsRules):
    def __init__(self):
        self.pollId = "$poll_id"
        super().__init__()

    def build(self):
        self.label = self.pollId

        childLabel1 = "id"
        childLabel2 = "title"
        childLabel3 = "description"
        self.validate = "newData.hasChildren(['" + childLabel1 + "', '" + childLabel2 + "', '" + childLabel3 + "'])"

        self.add(IdRules(childLabel1, self.pollId))
        self.add(StringRules(childLabel2, 30))
        self.add(StringRules(childLabel3, 500))
        self.add(BooleanRules("started"))
        self.add(ChoicesRules())
        self.add(OtherRules())

class ChoicesRules (PollRules):
    def build(self):
        self.label = "choices"
        self.add(ChoiceRules())

class ChoiceRules (ChoicesRules):
    def __init__(self):
        self.choiceId = "$choice_id"
        super().__init__()

    def build(self):
        self.label = self.choiceId

        childLabel1 = "id"
        childLabel2 = "label"
        self.validate = "newData.hasChildren(['" + childLabel1 + "', '" + childLabel2 + "'])"

        self.add(IdRules(childLabel1, self.choiceId))
        self.add(StringRules(childLabel2, 30))
        self.add(StringRules("short", 30))
        self.add(StringRules("image", 500))
        self.add(OtherRules())


# assessed votes node
class AssessedVotesRules (VoteRules):
    def build(self):
        self.label = "votes"
        self.add(PollVotesRules())

class PollVotesRules (AssessedVotesRules):
    def __init__(self):
        self.pollId = "$poll_id"
        super().__init__()

    def build(self):
        self.label = self.pollId
        self.read = doOr([ isAssessor(), isOneAdmin("vote") ])
        self.write = doAnd([ isOneAdmin("vote"), "!newData.exists()" ])
        self.validate = "root.child('vote/polls/'+" + self.pollId + ").exists()"
        self.add(PollUserVoteRules())

class PollUserVoteRules (PollVotesRules):
    def __init__(self):
        self.emailId = "$emailId"
        self.childLabel1 = "emailId"
        self.childLabel2 = "voted"
        super().__init__()

    def build(self):
        self.label = self.emailId
        self.write = doAnd([ isAssessor(), pollStarted(self.pollId) ])
        self.validate = "newData.hasChildren(['" + self.childLabel1 + "', '" + self.childLabel2 + "'])"

        self.add(PollUserVoteEmailIdRules())
        self.add(PollUserVoteAssessedRules())
        self.add(OtherRules())

class PollUserVoteEmailIdRules (PollUserVoteRules):
    def build(self):
        self.label = self.childLabel1
        self.write = doAnd([ verifyEmailId(self.emailId), pollStarted(self.pollId) ])
        self.validate = "newData.val() === " + self.emailId

class PollUserVoteAssessedRules (PollUserVoteRules):
    def build(self):
        self.label = self.childLabel2
        self.write = doAnd([
            verifyEmailId(self.emailId),
            pollStarted(self.pollId),
            "(!data.exists() || data.val() != true) && newData.val() == true"
        ])
        self.validate = "newData.isBoolean()"


# results node
class ResultsRules (VoteRules):
    def build(self):
        self.label = "results"
        self.add(PollResultsRules())

class PollResultsRules (ResultsRules):
    def __init__(self):
        self.pollId = "$poll_id"
        super().__init__()

    def build(self):
        self.label = self.pollId
        self.write = doAnd([ isOneAdmin("vote"), "!newData.exists()" ])
        self.validate = "root.child('vote/polls/'+" + self.pollId + ").exists()"

        self.add(BufferRules())
        self.add(BallotBoxRules())
        self.add(OtherRules())

class BufferRules (PollResultsRules):
    def build(self):
        self.label = "buffer"
        self.add(NamedEnveloppesRules())

class NamedEnveloppesRules (BufferRules):
    def __init__(self):
        self.emailId = "$emailId"
        super().__init__()

    def build(self):
        self.label = self.emailId
        self.write = doAnd([
            verifyEmailId(self.emailId),
            doNot(pollStarted(self.pollId)),
            "root.child('vote/users/'+" + self.pollId + "+'/'+" + self.emailId + "+'/voted').val() != true",
            "!data.exists()"
        ])
        self.validate = "root.child('vote/polls/'+" + self.pollId + "+'/choices/'+newData.val()).exists()"

class BallotBoxRules (PollResultsRules):
    def build(self):
        self.label = "ballot_box"
        self.read = doAnd([ isOneAdmin("vote"), doNot(pollStarted(self.pollId)) ])
        self.add(BallotByChoicesRules())

class BallotByChoicesRules (BallotBoxRules):
    def __init__(self):
        self.choiceId = "$choice_id"
        super().__init__()

    def build(self):
        self.label = self.choiceId
        self.validate = "root.child('vote/polls/'+" + self.pollId + "+'/choices/'+" + self.choiceId + ").exists()"
        self.add(BallotRules())

class BallotRules (BallotByChoicesRules):
    def build(self):
        self.label = "$paper"
        self.validate = "!data.exists() && newData.val() == true"
        self.inLine = True


# users votes node, same data as  assessed votes node, but deffirent point of vue
class UsersVotesRules (VoteRules):
    def build(self):
        self.label = "users"
        self.add(UserVotesRules())

class UserVotesRules (UsersVotesRules):
    def __init__(self):
        self.emailId = "$emailId"
        super().__init__()

    def build(self):
        self.label = self.emailId
        self.add(UserPollsVotesRules())
        self.add(OtherRules())

class UserPollsVotesRules (UserVotesRules):
    def build(self):
        self.label = "votes"
        self.read = verifyEmailId(self.emailId)
        self.add(UserPollVotesRules())

class UserPollVotesRules (UserPollsVotesRules):
    def __init__(self):
        self.pollId = "$poll_id"
        super().__init__()

    def build(self):
        self.label = self.pollId
        self.write = doAnd([
            doOr([ verifyEmailId(self.emailId), isAssessor() ]),
            pollStarted(self.pollId)
        ])
        self.validate = doAnd([
            "root.child('vote/polls/'+" + self.pollId + ").exists()",
            "newData.isBoolean() && newData.val() == true"
        ])
