import { registerLocaleData } from '@angular/common';

export abstract class Language {

	constructor(locale) {
		registerLocaleData(locale);
	}

	// Common
	public abstract readonly appName;
	public abstract readonly ok;
	public abstract readonly yes;
	public abstract readonly no;
	public abstract readonly errorLabel;
	public abstract readonly cancelLabel;
	public abstract readonly search;
	public abstract readonly backLabel;
	public abstract readonly modifyLabel;
	public abstract readonly sendLabel;
	public abstract readonly changesApplied;
	// -> time
	public abstract readonly locale;
	public abstract readonly timeFormat;
	public abstract readonly shortDateFormat;
	public abstract readonly longDateFormat;
	public abstract readonly shortDateTimeFormat;
	public abstract readonly longDateTimeFormat;
	// -> form labels
	public abstract readonly firstNameLabel;
	public abstract readonly lastNameLabel;
	public abstract readonly nicknameLabel;
	public abstract readonly loginLabel;
	public abstract readonly passwordlLabel;
	public abstract readonly emailLabel;
	// -> form errors
	public abstract readonly passwordError;
	public abstract readonly firstNameError;
	public abstract readonly lastNameError;
	// -> other errors
	public abstract readonly refreshTokenInfo;
	public abstract readonly emptyMessage;
	// public abstract readonly allLabel;
	public abstract readonly emptyLabel;
	public abstract readonly selectAssoLabel;

	// Account
	// -> update password dialog
	public abstract readonly changePasswordTitle;
	public abstract readonly changePasswordInfo;
	public abstract readonly passwordConfirmationError;
	public abstract readonly pwdChangeValidationButtonLabel;
	public abstract readonly passwordChangedInfo;
	// -> component
	public abstract readonly accountPageTitle;
	public abstract readonly outdatedAccountInfo;
	public abstract readonly changePasswordButtonLabel;
	public abstract readonly deleteAccountButtonLabel;
	public abstract readonly deleteAccountDialogTitle;
	public abstract readonly deleteAccountDialogContent;
	public abstract readonly deletedAccountInfo;

	// Actus
	// -> admin
	public abstract readonly actus;
	public abstract readonly actuAssoLabel;
	public abstract readonly actuAssoError;
	// -> actus-home
	public abstract readonly noActu;
	// -> component/actu-card
	public abstract readonly deleteActuDialogTitle;
	public abstract readonly deleteActuDialogContent;
	public abstract readonly deletedActuInfo;
	// edit-actus
	public abstract readonly actuTitleLabel;
	public abstract readonly actuTitleError;
	public abstract readonly actuDescriptionLabel;
	public abstract readonly actuDescriptionError;
	public abstract readonly actuImageLabel;
	public abstract readonly actuImageError;
	public abstract readonly actuPdfLinkLabel;
	public abstract readonly actuPdfLinkError;
	public abstract readonly actuDateLabel;
	public abstract readonly actuDateError;
	public abstract readonly actuAuthorLabel;
	public abstract readonly actuAuthorError;

	// Admin
	// -> home
	public abstract readonly adminLabel;
	public abstract readonly nbMembersLabel;
	public abstract readonly notOnTheList;
	public abstract readonly addGroupInfo;
	public abstract readonly addGroupButtonLabel;
	public abstract readonly groupsLabel;

	// -> vote
	public abstract readonly voteAdminLabel;
	public abstract readonly voteAdminPlLabel;
	public abstract readonly assessorLabel;
	public abstract readonly assessorPlLabel;
	public abstract readonly addAssessorInfo;
	public abstract readonly addAssessorButtonLabel;
	// -> cafet
	public abstract readonly cafetAdminLabel;
	public abstract readonly cafetAdminPlLabel;
	public abstract readonly cafetRespLabel;
	public abstract readonly cafetRespPlLabel;
	public abstract readonly addCafetRespInfo;
	public abstract readonly addCafetRespButtonLabel;
	// -> events
	public abstract readonly eventsAdminLabel;
	public abstract readonly eventsAdminPlLabel;
	public abstract readonly comRespLabel;
	public abstract readonly comRespPlLabel;
	public abstract readonly addComRespInfo;
	public abstract readonly addComRespButtonLabel;
	// -> nsigma
	public abstract readonly nsigmaAdminLabel;
	public abstract readonly nsigmaAdminPlLabel;
	// -> jobadments
	public abstract readonly jobadsAdminLabel;
	public abstract readonly jobadsAdminPlLabel;
	// -> actus
	public abstract readonly actusAdminLabel;
	public abstract readonly actusAdminPlLabel;
	public abstract readonly journalistLabel;
	public abstract readonly journalistPlLabel;
	public abstract readonly addJournalistInfo;
	public abstract readonly addJournalistButtonLabel;

	// Auth
	public abstract readonly logOutLabel;
	// -> login
	public abstract readonly signInPageTitle;
	public abstract readonly askForExistingEmailLabel;
	public abstract readonly askForExistingPwdLabel;
	public abstract readonly signInButtonLabel;
	public abstract readonly toSignInLabel;
	public abstract readonly passwordForgottenLabel;
	// -> auth-service
	public abstract readonly noEmailError;
	public abstract readonly emailFormatError;
	public abstract readonly emailDomainError;
	// -> signup
	public abstract readonly signUpPageTitle;
	// -> email-verif
	public abstract readonly verificationEmailSentTitle;
	public abstract readonly verificationEmailSentInfo;
	public abstract readonly sendEmailAgainButtonLabel;
	public abstract readonly emailSentToInfo;
	// -> password-reset
	public abstract readonly beforePwdRstEmailInfo;
	public abstract readonly afterPwdRstEmailInfo;

	// Cafet
	public abstract readonly creditLabel;
	public abstract readonly addButtonLabel;
	public abstract readonly substractButtonLabel;
	public abstract readonly informAboutTransaction;
	// -> admin-accounts
	public abstract readonly printAccountsToPdf;
	public abstract readonly leaveAccountsToPdfPreview;
	public abstract readonly saveAccountsToPdf;
	public abstract readonly displayDayAccountsPreview;
	public abstract readonly leaveDayAccountsPreview;
	public abstract readonly validateDayTransactionsButtonLabel;
	public abstract readonly noDayTransactions;
	// -> admin-archives
	public abstract readonly noArchivedUsers;
	// -> admin-users
	public abstract readonly cafetAccountsMatch;
	public abstract readonly orderByCreditLabel;
	public abstract readonly orderByLastTransactionDateLabel;
	public abstract readonly createAccountLabel;
	public abstract readonly confirmCafetAccountCreationDialogTitle;
	public abstract readonly confirmCafetAccountCreationDialogContent;
	public abstract readonly informAboutCafetCreation;
	// -> edit-cafet-user
	public abstract readonly achiveCafetUserButtonLabel;
	public abstract readonly restoreCafetUserButtonLabel;
	public abstract readonly deleteCafetUserButtonLabel;
	// -> trezo
	public abstract readonly nbOfRegisteredCafetAccountsLabel;
	public abstract readonly totalOnRegisteredCafetAccountsLAbel;
	public abstract readonly nbOfPositiveCafetAccountsLabel;
	public abstract readonly totalOnPositiveCafetAccountsLabel;
	public abstract readonly nbOfNegativeCafetAccountsLabel;
	public abstract readonly totalOnNegativeCafetAccountsLabel;
	// ->cafet-admin
	public abstract readonly clientListLabel;
	public abstract readonly cafetAccountsLabel;
	public abstract readonly cafetArchivesLabel;
	public abstract readonly cafetTrezoLabel;
	// -> cafet-history
	public abstract readonly transactionDateLabel;
	public abstract readonly transactionValueLabel;
	public abstract readonly cafetAccountCreationDateLabel;
	// -> cafet-home
	public abstract readonly negativeCreditError;
	// -> cafet-info
	public abstract readonly noCafetAccountInfo;
	// -> cafet-service
	public abstract readonly cafetUserNoLonguerExists;

	// TODO: do not allow changing cafet profile if day transactions
	// public abstract readonly achiveUserPermissionDenied = "Action refusée, le client a des transactions non validées";
	// public abstract readonly weekIngredientLabel;

	// Calendar
	// -> edit-all
	public abstract readonly nbOfSubscriptionsToDeletedEvents;
	public abstract readonly deleteEventSubsciptionsButtonLabel;
	public abstract readonly deletePersoEventDialogTitle;
	public abstract readonly deletePersoEventDialogContent;
	public abstract readonly deletedPersoEventInfo;
	// -> settings
	public abstract readonly calSettingsTitle;
	public abstract readonly calSettingsResourcesLabel;
	public abstract readonly calSettingsResourcesError;
	public abstract readonly gatherFromZenithInfo;
	public abstract readonly gatherFromZenithButtonLabel;
	public abstract readonly updatedResourcesInfo;
	public abstract readonly ZenithCredentialsDialogTitle;
	public abstract readonly ZenithCredentialsDialogContent;
	public abstract readonly waitZenithConnectionInfo;
	public abstract readonly invalidZenithCredentialsError;
	public abstract readonly dangerousZenithCredentialsError;
	public abstract readonly ZenithConnectionError;
	public abstract readonly ZenithConnectionOk;
	public abstract readonly displayICSDownloadInfo;
	public abstract readonly eventsByDefaultInfo;
	public abstract readonly eventsCipherInfo;
	public abstract readonly keyHashOkInfo;
	public abstract readonly passwordOkInfo;
	public abstract readonly keyNotConfiguredError;
	public abstract readonly cipherLabel;
	public abstract readonly cipherChangePasswordTitle;
	public abstract readonly cipherChangePasswordInfo;
	// -> day-column
	public abstract readonly noCalEvent;
	// -> edit-cal
	public abstract readonly eventOccurencesLabel;
	public abstract readonly eventOccurencesError;

	// Events
	// -> event/cal-event form
	public abstract readonly eventTitleLabel;
	public abstract readonly eventTitleError;
	public abstract readonly eventStartLabel;
	public abstract readonly eventStartError;
	public abstract readonly eventStartTimeLabel;
	public abstract readonly eventStartTimeError;
	public abstract readonly eventEndLabel;
	public abstract readonly eventEndError;
	public abstract readonly eventEndTimeLabel;
	public abstract readonly eventEndTimeError;
	public abstract readonly eventLocationLabel;
	public abstract readonly eventLocationError;
	// -> event-card
	public abstract readonly isNowLabel;
	public abstract readonly isPasssedLabel;
	public abstract readonly deleteEventDialogTitle;
	public abstract readonly deleteEventDialogContent;
	public abstract readonly deletedEventInfo;
	// -> edit-event
	public abstract readonly eventDescriptionLabel;
	public abstract readonly eventDescriptionError;
	public abstract readonly eventImageLabel;
	public abstract readonly eventImageError;
	public abstract readonly eventAssoLabel;
	public abstract readonly eventAssoError;
	public abstract readonly eventPriceLabel;
	public abstract readonly eventPriceError;
	public abstract readonly free;
	// -> event
	public abstract readonly eventStart;
	public abstract readonly eventEnd;
	public abstract readonly eventOrganizer;
	public abstract readonly eventLocation;
	public abstract readonly eventPrice;
	public abstract readonly participate;
	public abstract readonly doNotParticipate;
	// -> event-admin
	public abstract readonly events;
	// -> event-home
	public abstract readonly noEvent;

	// Info
	// -> legal-notice
	public abstract readonly legalNoticeLabel;
	// -> user-guide
	public abstract readonly userGuideLabel;

	// JobAd
	public abstract readonly jobadDone;
	// -> jobad-jobad
	public abstract readonly jobadTechnologiesIntro;
	public abstract readonly jobadDurationIntro;
	// -> jobad-edit
	public abstract readonly jobadOngoing;
	public abstract readonly jobadTitleLabel;
	public abstract readonly jobadTitleError;
	public abstract readonly jobadDescriptionLabel;
	public abstract readonly jobadDescriptionError;
	public abstract readonly jobadTypeLabel;
	public abstract readonly jobadTypeError;
	public abstract readonly jobadType0;
	public abstract readonly jobadType1;
	public abstract readonly jobadType2;
	public abstract readonly jobadStartLabel;
	public abstract readonly jobadStartError;
	public abstract readonly jobadLengthLabel;
	public abstract readonly jobadLengthError;
	public abstract readonly jobadContactLabel;
	public abstract readonly jobadContactError;
	public abstract readonly jobadAuthorLabel;
	public abstract readonly jobadAuthorError;
	public abstract readonly jobadTechnologiesLabel;
	public abstract readonly jobadTechnologiesError;
	// -> jobad-home
	public abstract readonly noJobAds;
	// -> jobad-card
	public abstract readonly deleteJobAdsDialogTitle;
	public abstract readonly deleteJobAdsDialogContent;
	public abstract readonly deletedJobAdsInfo;

	// Nsigma
	public abstract readonly nsigmaJobAdsDone;
	public abstract readonly nsigmaJobAdsOngoing;
	// -> nsigma-card
	public abstract readonly deleteNsigmaJobAdsDialogTitle;
	public abstract readonly deleteNsigmaJobAdsDialogContent;
	public abstract readonly deletedNsigmaJobAdsInfo;
	// -> jobad
	public abstract readonly remuneration;
	public abstract readonly technologies;
	public abstract readonly difficulty;
	public abstract readonly applyToNsigmaJobAds;
	// -> edit
	public abstract readonly nsigmaTitleLabel;
	public abstract readonly nsigmaTitleError;
	public abstract readonly nsigmaDescriptionLabel;
	public abstract readonly nsigmaDescriptionError;
	public abstract readonly nsigmaTypeLabel;
	public abstract readonly nsigmaTypeError;
	public abstract readonly nsigmaType0;
	public abstract readonly nsigmaType1;
	public abstract readonly nsigmaType2;
	public abstract readonly nsigmaType3;
	public abstract readonly nsigmaType4;
	public abstract readonly nsigmaType5;
	public abstract readonly nsigmaType6;
	public abstract readonly nsigmaStartLabel;
	public abstract readonly nsigmaStartError;
	public abstract readonly nsigmaEndLabel;
	public abstract readonly nsigmaEndError;
	public abstract readonly nsigmaTechnologiesLabel;
	public abstract readonly nsigmaTechnologiesError;
	public abstract readonly nsigmaDifficultyLabel;
	public abstract readonly nsigmaDifficultyError;
	public abstract readonly nsigmaRemunerationLabel;
	public abstract readonly nsigmaRemunerationError;
	public abstract readonly nsigmaFormLabel;
	public abstract readonly nsigmaFormError;
	// -> home
	public abstract readonly noNsigmaJobAd;

	// AppModules
	// -> cafet
	public abstract readonly cafetModuleDisplayName;
	public abstract readonly cafetModuleDescription;
	public abstract readonly cafetModuleFullName;
	// -> calendar
	public abstract readonly calendarModuleDisplayName;
	public abstract readonly calendarModuleDescription;
	public abstract readonly calendarModuleFullName;
	// -> event
	public abstract readonly eventsModuleDisplayName;
	public abstract readonly eventsModuleDescription;
	public abstract readonly eventsModuleFullName;
	// -> actus
	public abstract readonly actusModuleDisplayName;
	public abstract readonly actusModuleDescription;
	public abstract readonly actusModuleFullName;
	// -> jobad
	public abstract readonly jobadsModuleDisplayName;
	public abstract readonly jobadsModuleDescription;
	public abstract readonly jobadsModuleFullName;
	// -> nsigma
	public abstract readonly nsigmaModuleDisplayName;
	public abstract readonly nsigmaModuleDescription;
	public abstract readonly nsigmaModuleFullName;
	// -> vote
	public abstract readonly votesModuleDisplayName;
	public abstract readonly votesModuleDescription;
	public abstract readonly votesModuleFullName;
	// -> infos
	public abstract readonly infosModuleDisplayName;
	public abstract readonly infosModuleDescription;
	public abstract readonly infosModuleFullName;

	// Vote
	public abstract readonly startLabel;
	// -> assessor
	public abstract readonly markAsVotedEmailInfo;
	public abstract readonly markAsVotedDomainInfo;
	public abstract readonly votedButtonLabel;
	public abstract readonly pollChoiceLabel;
	public abstract readonly noPoll;
	public abstract readonly unknownUserInfo;
	public abstract readonly markedAsVoted;
	// -> vote-card
	public abstract readonly votedLabel;
	public abstract readonly deletePollDialogTitle;
	public abstract readonly deletePollDialogContent;
	public abstract readonly deletedPollInfo;
	// -> edit
	public abstract readonly pollTitleLabel;
	public abstract readonly pollTitleError;
	public abstract readonly pollDescriptionLabel;
	public abstract readonly pollDescriptionError;
	public abstract readonly choiceTitleLabel;
	public abstract readonly choiceImageLabel;
	public abstract readonly choiceShortNameLabel;
	public abstract readonly addChoiceLabel;
	// -> poll
	public abstract readonly notStartedInfo;
	public abstract readonly voteForTemplate;
	public abstract readonly confirmVoteDialogTitle;
	public abstract readonly confirmVoteDialogContent;
	public abstract readonly voteComfirmationMessage;
	// -> results
	public abstract readonly pollResultsLabel;
	public abstract readonly pollResultsTemplate;
	// -> admin
	public abstract readonly polls;
	// -> users
	public abstract readonly nbVoteUsersLabel;
	public abstract readonly noUserMatchInfo;

}
