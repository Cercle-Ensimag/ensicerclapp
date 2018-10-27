import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);

export class French {
  // Common
  public static readonly appName = "Cercle Ensimag";
	public static readonly okLabel = "Ok";
	public static readonly errorLabel = "Erreur";
	public static readonly cancelLabel = "Annuler";
	public static readonly search = "Recherche";
  public static readonly backLabel = "Retour";
	public static readonly modifyLabel = "Modifier";
	public static readonly sendLabel = "Envoyer";
  public static readonly changesApplied = "Changements appliqués avec succès";
	// -> time
  public static readonly locale = "fr";
  public static readonly timeFormat = "H:mm";
  public static readonly shortDateFormat = "E d LLL";
  public static readonly longDateFormat = "EEEE d LLLL";
  public static readonly shortDateTimeFormat = "E d LLL H:mm";
  public static readonly longDateTimeFormat = "EEEE d LLLL H:mm";
	// -> form labels
	public static readonly firstNameLabel = "Prénom";
	public static readonly lastNameLabel = "Nom de famille";
	public static readonly nicknameLabel = "Surnom";
	public static readonly loginLabel = "Nom d'utilisateur";
	public static readonly passwordlLabel = "Mot de passe";
	public static readonly emailLabel = "E-mail";
	// -> form errors
	public static readonly passwordError = "Mot de passe invalide";
	public static readonly firstNameError = "Prénom invalide";
	public static readonly lastNameError = "Nom de famille invalide";
	// -> other errors
	public static readonly refreshTokenInfo = "Cette opréation nécéssite de s'être identifié recemment";
	public static readonly emptyMessage = "Aucun élément à afficher !";

	// Account
	// -> update password dialog
	public static readonly changePasswordTitle = "Changement de mot de passe";
	public static readonly changePasswordInfo = "Saisissez votre nouveau mot de passe :";
	public static readonly passwordConfirmationError = "Confirmation invalide";
	public static readonly pwdChangeValidationButtonLabel = "Mettre à jour le mot de passe";
	public static readonly passwordChangedInfo = "Ton mot de passe a été modifié avec succès";
	// -> component
	public static readonly accountPageTitle = "Informations personnelles";
	public static readonly outdatedAccountInfo = "Ton compte n'est plus actif... si tu es encore à l'Ensimag, contacte-nous pour le réactiver"
	public static readonly changePasswordButtonLabel = "Changer le mot de passe";
	public static readonly deleteAccountButtonLabel = "Supprimer le compte";
	public static readonly deleteAccountDialogTitle = "Confirmation de la suppression";
	public static readonly deleteAccountDialogContent = "Êtes-vous certain de vouloir supprimer votre compte ?";
	public static readonly deletedAccountInfo = "Suppression effectuée";

	// Actus
	// -> admin
	public static readonly actus = "Actualités";
	// -> actus-home
	public static readonly noActu = "Aucune actualité";
	// -> component/actu-card
	public static readonly deleteActuDialogTitle = "Confirmation de la suppression";
	public static readonly deleteActuDialogContent = "Êtes-vous certain de vouloir supprimer \"{0}\" ?";
	public static readonly deletedActuInfo = "Actualité supprimée";
	// edit-actus
	public static readonly actuTitleLabel = "Titre";
	public static readonly actuTitleError = "Titre invalide";
	public static readonly actuDescriptionLabel = "Description (Markdown pour la mise en forme)";
	public static readonly actuDescriptionError = "Description invalide";
	public static readonly actuImageLabel = "URL de l'image";
	public static readonly actuImageError = "URL invalide";
	public static readonly actuPdfLinkLabel = "URL du document pdf";
	public static readonly actuPdfLinkError = "URL invalide";
	public static readonly actuDateLabel = "Date";
	public static readonly actuDateError = "Date invalide";
	public static readonly actuAuthorLabel = "Auteur";
	public static readonly actuAuthorError = "Auteur invalide";

	// Admin
	// -> home
	public static readonly adminLabel = "Admin";
	public static readonly nbMembersLabel = "{0} membres";
	public static readonly notOnTheList = "{0} n'est pas dans la liste";
	// -> vote
	public static readonly voteAdminLabel = "Admin vote";
	public static readonly voteAdminPlLabel = "Admins vote";
	public static readonly assessorLabel = "Assesseur";
	public static readonly assessorPlLabel = "Assesseurs";
	public static readonly addAssessorInfo = "Entrer l'e-mail d'un assesseur";
	public static readonly addAssessorButtonLabel = "Ajouter";
	// -> cafet
	public static readonly cafetAdminLabel = "Master cafet";
	public static readonly cafetAdminPlLabel = "Masters cafet";
	public static readonly cafetRespLabel = "Respo cafet";
	public static readonly cafetRespPlLabel = "Respos cafet";
	public static readonly addCafetRespInfo = "Entrer l'e-mail d'un respo cafet";
	public static readonly addCafetRespButtonLabel = "Ajouter";
	// -> events
	public static readonly eventsAdminLabel = "Admin events";
	public static readonly eventsAdminPlLabel = "Admins events";
	public static readonly comRespLabel = "Respo com'";
	public static readonly comRespPlLabel = "Respos com'";
	public static readonly addComRespInfo = "Entrer l'e-mail d'un respo com";
	public static readonly addComRespButtonLabel = "Ajouter";
	// -> nsigma
	public static readonly nsigmaAdminLabel = 'Admin Nsigma';
	public static readonly nsigmaAdminPlLabel = 'Admins Nsigma';
	// -> jobadments
	public static readonly jobadsAdminLabel = 'Admin annonces';
	public static readonly jobadsAdminPlLabel = 'Admins annonces';
	// -> actus
	public static readonly actusAdminLabel = "Admin actus";
	public static readonly actusAdminPlLabel = "Admins actus";
	public static readonly journalistLabel = "Journaliste";
	public static readonly journalistPlLabel = "Journalistes";
	public static readonly addJournalistInfo = "Entrer l'e-mail d'un journaliste";
	public static readonly addJournalistButtonLabel = "Ajouter";

  // Auth
	public static readonly logOutLabel = "Déconnexion";
	// -> login
	public static readonly signInPageTitle = "Identifie-toi<br><small>ou crée un compte si tu n'en as pas encore !</small>";
	public static readonly askForExistingEmailLabel = "Entre ton e-mail";
	public static readonly askForExistingPwdLabel = "Entre ton mot de passe";
	public static readonly signInButtonLabel = "Connexion";
	public static readonly toSignInLabel = "Crée-toi un compte !";
	public static readonly passwordForgottenLabel = "Mot de passe oublié ?";
	// -> auth-service
	public static readonly noEmailError = "L'e-mail est exigé";
	public static readonly emailFormatError = "L'e-mail est incorrect";
	public static readonly emailDomainError = "L'e-mail doit appartenir au domaine '@ensimag.fr'";
	// -> signup
	public static readonly signUpPageTitle = "Inscription";
	// -> email-verif
	public static readonly verificationEmailSentTitle = "Compte non confirmé";
	public static readonly verificationEmailSentInfo = "Un e-mail de confirmation a été envoyé à l'adresse utilisée lors de ton votre inscription.<br><br>Vérifie ta boîte e-mail et ton dossier spam puis clique sur le lien de confirmation.";
	public static readonly sendEmailAgainButtonLabel = "Renvoyer l'email";
	// -> password-reset
	public static readonly beforePwdRstEmailInfo = "Un e-mail de réinitialisation de mot de passe va être envoyé à l'adresse donnée.";
	public static readonly afterPwdRstEmailInfo = "Si l'adresse <b>{0}</b> est correcte, un lien de réinitialisation lui a été envoyé.";

	// Cafet
	public static readonly creditLabel = "Solde";
	public static readonly addButtonLabel = "Crediter";
	public static readonly substractButtonLabel = "Débiter";
	public static readonly informAboutTransaction = "Le solde du compte de {0} a bien été modifié de {1}€";
	// -> admin-accounts
	public static readonly printAccountsToPdf = "Imprimer les comptes";
	public static readonly leaveAccountsToPdfPreview = "Quitter l'aperçu";
	public static readonly saveAccountsToPdf = "Enregistrer les comptes";
	public static readonly displayDayAccountsPreview = "Verifier les transactions du jour";
	public static readonly leaveDayAccountsPreview = "Quitter l'aperçu";
	public static readonly validateDayTransactionsButtonLabel = "Valider les transactions du jour";
	public static readonly noDayTransactions = "Aucune transaction en attente de validation";
	// -> admin-archives
	public static readonly noArchivedUsers = "Aucun utilisateur archivé ne correspond";
	// -> admin-users
	public static readonly cafetAccountsMatch = "{0} compte existe déjà";
	public static readonly orderByCreditLabel = "par solde";
	public static readonly orderByLastTransactionDateLabel = "par date";
	public static readonly createAccountLabel = "Créer le compte";
	public static readonly confirmCafetAccountCreationDialogTitle = "Utilisateur introuvable";
	public static readonly confirmCafetAccountCreationDialogContent = "Voulez-vous ajouter \"{0}\" en tant qu'externe ?";
	public static readonly informAboutCafetCreation = "Le compte de {0} a bien été créé et crédité de {1}€";
	// -> edit-cafet-user
	public static readonly achiveCafetUserButtonLabel = "Archiver";
	public static readonly restoreCafetUserButtonLabel = "Restaurer";
	public static readonly deleteCafetUserButtonLabel = "Supprimer";
	// -> trezo
	public static readonly nbOfRegisteredCafetAccountsLabel = "Comptes enregistrés : {0}";
	public static readonly totalOnRegisteredCafetAccountsLAbel = "Total sur les comptes : {0}";
	public static readonly nbOfPositiveCafetAccountsLabel = "Comptes enregistrés dans le posiitif : {0}";
	public static readonly totalOnPositiveCafetAccountsLabel = "Total sur les comptes dans le positif : {0}";
	public static readonly nbOfNegativeCafetAccountsLabel = "Comptes enregistrés dans le négatif : {0}";
	public static readonly totalOnNegativeCafetAccountsLabel = "Total sur les comptes dans le négatif : {0}";
	// ->cafet-admin
	public static readonly clientListLabel = "Clients";
	public static readonly cafetAccountsLabel = "Comptes";
	public static readonly cafetArchivesLabel = "Archives";
	public static readonly cafetTrezoLabel = "Trezo";
	// -> cafet-history
	public static readonly transactionDateLabel = "Date";
	public static readonly transactionValueLabel = "Montant";
	public static readonly cafetAccountCreationDateLabel = "Création du compte";
	// -> cafet-home
	public static readonly negativeCreditError = "<b>Ton</b> compte est dans le <b>négatif</b>!<small>Tu devrais mettre de l'argent sur ton compte.</small>";
	// -> cafet-info
	public static readonly noCafetAccountInfo = "<b>Tu n'as pas encore de compte à la cafet</b><br><br>Contacte les respo' cafet afin que ces derniers te créent un compte !<br><br>";
	// -> cafet-service
	public static readonly cafetUserNoLonguerExists = "Erreur : le compte de {0} n'existe plus";

	// TODO : public static readonly achiveUserPermissionDenied = "Action refusée, le client a des transactions non validées";
	// public static readonly weekIngredientLabel = "Ingrédient de la semaine";

	// Calendar
	// -> edit-all
	public static readonly nbOfSubscriptionsToDeletedEvents = "{0} abonnements à des événements supprimés";
	public static readonly deleteEventSubsciptionsButtonLabel = "Effacer";
	public static readonly deletePersoEventDialogTitle = "Confirmation de la suppression";
	public static readonly deletePersoEventDialogContent = "Êtes-vous certain de vouloir supprimer \"{0}\" ?";
	public static readonly deletedPersoEventInfo = "Evénement supprimé";
	// -> settings
	public static readonly calSettingsTitle = "Paramètres du calendrier";
	public static readonly calSettingsResourcesLabel = "Ressources ADE";
	public static readonly calSettingsResourcesError = "ex: '1234,5678,1479'";
	public static readonly gatherFromAdeInfo = "<b>Kézako ?</b><br><br>Il s'agist de la liste des modules que vous suivez au format \"ADE\" (n1, n2, n3, ...). Vous pouvez récupérer cette information depuis l'URL que vous utilisez pour consulter votre calendrier.<br><br>Laissez-nous récupérer automatiquement cette information depuis votre espace ADE.<br><br> Vos identifiants ne sont <b>pas</b> enregistrés.";
	public static readonly gatherFromAdeButtonLabel = "Récupérer via ADE";
	public static readonly updatedResourcesInfo = "Ressources mises à jour";
	public static readonly ADECredentialsDialogTitle = "Connexion à ADE";
	public static readonly ADECredentialsDialogContent = "Identifiants de connexion à ADE";
	public static readonly waitADEConnectionInfo = "Connexion à ADE...";
	public static readonly invalidADECredentialsError = "Identifiants incorrects";
	public static readonly dangerousADECredentialsError = "Caractère dangereux, désolé";
	public static readonly ADEConnectionError = "Echec de la connexion";
	// -> day-column
	public static readonly noCalEvent = "Rien de prévu";
	// -> edit-cal
	public static readonly eventOccurencesLabel = "Occurences";
	public static readonly eventOccurencesError = "Occurences invalides";

	// Events
	// -> event/cal-event form
	public static readonly eventTitleLabel = "Titre";
	public static readonly eventTitleError = "Titre invalide";
	public static readonly eventStartLabel = "Date de début (mm/dd/yyyy)";
	public static readonly eventStartError = "Date de début invalide";
	public static readonly eventStartTimeLabel = "Heure de début (HH:mm)";
	public static readonly eventStartTimeError = "Heure de début invalide";
	public static readonly eventEndLabel = "Date de fin (mm/dd/yyyy)";
	public static readonly eventEndError = "Date de fin invalide";
	public static readonly eventEndTimeLabel = "Heure de fin (HH:mm)";
	public static readonly eventEndTimeError = "Heure de fin invalide";
	public static readonly eventLocationLabel = "Lieu";
	public static readonly eventLocationError = "Lieu invalide";
	// -> event-card
	public static readonly isNowLabel = "En direct";
	public static readonly isPasssedLabel = "Passé";
	public static readonly deleteEventDialogTitle = "Confirmation de la suppression";
	public static readonly deleteEventDialogContent = "Êtes-vous certain de vouloir supprimer \"{0}\" ?";
	public static readonly deletedEventInfo = "Evénement supprimé";
	// -> edit-event
	public static readonly eventDescriptionLabel = "Description (Markdown pour la mise en forme)";
	public static readonly eventDescriptionError = "Description invalide";
	public static readonly eventImageLabel = "URL de l'image";
	public static readonly eventImageError = "URL invalide";
	public static readonly eventAssoLabel = "Association";
	public static readonly eventAssoError = "Association invalide";
	public static readonly eventPriceLabel = "PAF";
	public static readonly eventPriceError = "Prix invalide";
	public static readonly free = "Gratuit";
	// -> event
	public static readonly eventStart = "Début : {0}";
	public static readonly eventEnd = "Fin : {0}";
	public static readonly eventOrganizer = "Organisateur : {0}";
	public static readonly eventLocation = "Lieu : {0}";
	public static readonly eventPrice = "PAF : {0}";
	public static readonly participate = "Ajouté à mon planning";
	public static readonly doNotParticipate = "Pas dans mon planning";
	// -> event-admin
	public static readonly events = "Evénements";
	// -> event-home
	public static readonly noEvent = "Aucun événement à venir";

  // Info
	// -> legal-notice
  public static readonly legalNoticeLabel = "Mentions légales";
	// -> user-guide
  public static readonly userGuideLabel = "Détail des fonctionnalités";

	// JobAd
	public static readonly jobadDone = "Finie";
	// -> jobad-jobad
	public static readonly jobadTechnologiesIntro = "Technologies : ";
	public static readonly jobadDurationIntro = "Durée : ";
	// -> jobad-edit
	public static readonly jobadOngoing = 'En cours';
	public static readonly jobadTitleLabel = "Titre";
	public static readonly jobadTitleError = "Titre invalide";
	public static readonly jobadDescriptionLabel = "Description (Markdown pour la mise en forme)";
	public static readonly jobadDescriptionError = "Description invalide";
	public static readonly jobadTypeLabel = "Nature de l'offre";
	public static readonly jobadTypeError = "Type invalide";
	public static readonly jobadType0 = "Durée déterminée";
	public static readonly jobadType1 = "Durée indéterminée";
	public static readonly jobadType2 = "Générale";
	public static readonly jobadStartLabel = 'Date de début';
	public static readonly jobadStartError = 'Date invalide';
	public static readonly jobadLengthLabel = 'Durée';
	public static readonly jobadLengthError = 'Durée invalide';
	public static readonly jobadContactLabel = 'Contact';
	public static readonly jobadContactError = 'Contact invalide';
	public static readonly jobadAuthorLabel = 'Auteur';
	public static readonly jobadAuthorError = 'Auteur invalide';
	public static readonly jobadTechnologiesLabel = 'Technologies';
	public static readonly jobadTechnologiesError = 'Technologies invalides';
	// -> jobad-home
	public static readonly noJobAds = 'Aucune annonce';
	// -> jobad-card
	public static readonly deleteJobAdsDialogTitle = "Confirmation de la suppression";
	public static readonly deleteJobAdsDialogContent = "Êtes-vous certain de vouloir supprimer \"{0}\" ?";
	public static readonly deletedJobAdsInfo = "Annonce supprimée";

	// Nsigma
	public static readonly nsigmaJobAdsDone = "Recrutement terminé";
	public static readonly nsigmaJobAdsOngoing = 'En cours';
	// -> nsigma-card
	public static readonly deleteNsigmaJobAdsDialogTitle = "Confirmation de la suppression";
	public static readonly deleteNsigmaJobAdsDialogContent = "Êtes-vous certain de vouloir supprimer \"{0}\" ?";
	public static readonly deletedNsigmaJobAdsInfo = "Annonce supprimée";
	// -> jobad
	public static readonly remuneration = "Rémunération : {0}";
	public static readonly technologies = "<b>Technologies : </b>{0}";
	public static readonly difficulty = "<b>Difficulté : </b>{0}";
	public static readonly applyToNsigmaJobAds = "Candidater";
	// -> edit
	public static readonly nsigmaTitleLabel = "Titre";
	public static readonly nsigmaTitleError = "Titre invalide";
	public static readonly nsigmaDescriptionLabel = "Description (Markdown pour la mise en forme)";
	public static readonly nsigmaDescriptionError = "Description invalide";
	public static readonly nsigmaTypeLabel = "Type de l'étude";
	public static readonly nsigmaTypeError = "Type invalide";
	public static readonly nsigmaType0 = "Web";
	public static readonly nsigmaType1 = "Mobile";
	public static readonly nsigmaType2 = "Maths";
	public static readonly nsigmaType3 = "Telecom";
	public static readonly nsigmaType4 = "Bureautique";
	public static readonly nsigmaType5 = "Sécurité";
	public static readonly nsigmaType6 = "Général";
	public static readonly nsigmaStartLabel = "Début";
	public static readonly nsigmaStartError = "Début invalide";
	public static readonly nsigmaEndLabel = "Fin";
	public static readonly nsigmaEndError = "Fin invalide";
	public static readonly nsigmaTechnologiesLabel = "Technologies";
	public static readonly nsigmaTechnologiesError = "Technologies invalides";
	public static readonly nsigmaDifficultyLabel = "Difficulté";
	public static readonly nsigmaDifficultyError = "Difficulté invalide";
	public static readonly nsigmaRemunerationLabel = "Rémunération";
	public static readonly nsigmaRemunerationError = "Rémunération invalide";
	public static readonly nsigmaFormLabel = "Formulaire Google de contact";
	public static readonly nsigmaFormError = "Formulaire invalide";
	// -> home
	public static readonly noNsigmaJobAd = "Nsigma ne recrute pas en ce moment";

	// AppModules
	// -> cafet
	public static readonly cafetModuleDisplayName = "Cafet";
	public static readonly cafetModuleDescription = "Gère tes comptes en consultant ton solde ainsi que l'historique de tes dépenses !";
	public static readonly cafetModuleFullName = "Gestion de mon compte cafétéria";
	// -> calendar
	public static readonly calendarModuleDisplayName = "Planning";
	public static readonly calendarModuleDescription = "Plus question d'arriver en retard, consulte en direct tes horaires de cours mais aussi des événements auxquels tu participes !";
	public static readonly calendarModuleFullName = "Dates et informations sur mes cours et événements";
	// -> event
	public static readonly eventsModuleDisplayName = "Evénements";
	public static readonly eventsModuleDescription = "Renseigne-toi sur l'ensemble des événements liés à la vie au sein de Grenoble INP et ajoute-les à ton calendrier !";
	public static readonly eventsModuleFullName = "Liste des événements à venir";
	// -> actus
	public static readonly actusModuleDisplayName = "Actus";
	public static readonly actusModuleDescription = "Consulte l'essentiel de l'information grâce à l'engagement des journalistes imag du Pole Com' !";
	public static readonly actusModuleFullName = "Actualités de la vie de l'école et de ses environs";
	// -> jobad
	public static readonly jobadsModuleDisplayName = "Annonces";
	public static readonly jobadsModuleDescription = "Retrouve l'ensemble des offres de stages et d'embauches réservées au réseau Ensimag !";
	public static readonly jobadsModuleFullName = "Offres de stages et recrutements";
	// -> nsigma
	public static readonly nsigmaModuleDisplayName = "Nsigma";
	public static readonly nsigmaModuleDescription = "Les projets d'informatique et de mathématiques appliquées d'Nsigma n'attendent que toi pour commencer !";
	public static readonly nsigmaModuleFullName = "Annonces de recrutement d'Nsigma, Junior Entreprise";
	// -> vote
	public static readonly votesModuleDisplayName = "Votes";
	public static readonly votesModuleDescription = "Vote pour ta liste préférée et aide la à rentrer dans l'Histoire en remportant l'accès au bureau !";
	public static readonly votesModuleFullName = "Vote pour les élections BDE, BDS et BDA";
	// -> infos
	public static readonly infosModuleDisplayName = "Lisez-moi";
	public static readonly infosModuleDescription = "Retrouve ici mentions légales et tutoriels pour l'utilisation de cette application.";
	public static readonly infosModuleFullName = "A propos d'ensicerclapp ;)";

  // Vote
	public static readonly startLabel = "Start";
	// -> assessor
	public static readonly markAsVotedEmailInfo = "Email d'un votant en face-à-face";
	public static readonly markAsVotedDomainInfo = "Domaine";
	public static readonly votedButtonLabel = "A voté !";
	public static readonly pollChoiceLabel = "Choix des scrutins";
	public static readonly noPoll = "Pas de scrutin en cours.";
	public static readonly unknownUserInfo = "Utilisateur inconnu : {0}";
	public static readonly markedAsVoted = "{0} a bien été ajouté";
	// -> vote-card
	public static readonly votedLabel = "A voté";
	public static readonly deletePollDialogTitle = "Confirmation de la suppression";
	public static readonly deletePollDialogContent = "Êtes-vous certain de vouloir supprimer le scrutin \"{0}\" ?";
	public static readonly deletedPollInfo = "Scrutin supprimé";
	// -> edit
	public static readonly pollTitleLabel = "Titre";
	public static readonly pollTitleError = "Titre invalide";
	public static readonly pollDescriptionLabel = "Description (Markdown pour la mise en forme)";
	public static readonly pollDescriptionError = "Description invalide";
	public static readonly choiceTitleLabel = "Nom complet";
	public static readonly choiceImageLabel = "Image URL (public)";
	public static readonly choiceShortNameLabel = "Diminutif";
	public static readonly addChoiceLabel = "Ajouter un choix";
	// -> poll
	public static readonly notStartedInfo = "Le vote n'a pas encore débuté...";
	public static readonly voteForTemplate = "Voter {0}";
	public static readonly confirmVoteDialogTitle = "Confirmation du vote";
	public static readonly confirmVoteDialogContent = "Êtes-vous certain de vouloir voter pour \"{0}\" ?";
	public static readonly voteComfirmationMessage = "Vote pour \"{0}\" enregistré";
	// -> results
	public static readonly pollResultsLabel = "Résultats";
	public static readonly pollResultsTemplate = "{0} : {1} votes ({2}%)";
	// -> admin
	public static readonly polls = "Scrutins";
	// -> users
	public static readonly nbVoteUsersLabel = "{0} votants";
	public static readonly noUserMatchInfo = "Aucun votant ne correspond aux filtres";


}
