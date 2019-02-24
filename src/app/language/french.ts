import localeFr from '@angular/common/locales/fr';
import {Language} from './language';

export class French extends Language {

	constructor() {
		super(localeFr);
	}

	// Common
	public readonly appName = "Cercle Ensimag";
	public readonly ok = "Ok";
	public readonly yes = "Oui";
	public readonly no = "Non";
	public readonly errorLabel = "Erreur";
	public readonly cancelLabel = "Annuler";
	public readonly search = "Recherche";
	public readonly backLabel = "Retour";
	public readonly modifyLabel = "Modifier";
	public readonly sendLabel = "Envoyer";
	public readonly changesApplied = "Changements appliqués avec succès";
	// -> time
	public readonly locale = "fr";
	public readonly timeFormat = "H:mm";
	public readonly shortDateFormat = "E d LLL";
	public readonly longDateFormat = "EEEE d LLLL";
	public readonly shortDateTimeFormat = "E d LLL H:mm";
	public readonly longDateTimeFormat = "EEEE d LLLL H:mm";
	// -> form labels
	public readonly firstNameLabel = "Prénom";
	public readonly lastNameLabel = "Nom de famille";
	public readonly nicknameLabel = "Surnom";
	public readonly loginLabel = "Nom d'utilisateur";
	public readonly passwordlLabel = "Mot de passe";
	public readonly emailLabel = "E-mail";
	// -> form errors
	public readonly passwordError = "Mot de passe invalide";
	public readonly firstNameError = "Prénom invalide";
	public readonly lastNameError = "Nom de famille invalide";
	// -> other errors
	public readonly refreshTokenInfo = "Cette opréryation nécéssite de s'être identifié recemment";
	public readonly emptyMessage = "Aucun élément à afficher !";
	// public readonly allLabel = "Tous";
	public readonly emptyLabel = "";
	public readonly selectAssoLabel = "Filtrer les associations";

	// Account
	// -> update password dialog
	public readonly changePasswordTitle = "Changement de mot de passe";
	public readonly changePasswordInfo = "Saisissez votre nouveau mot de passe :";
	public readonly passwordConfirmationError = "Confirmation invalide";
	public readonly pwdChangeValidationButtonLabel = "Mettre à jour le mot de passe";
	public readonly passwordChangedInfo = "Ton mot de passe a été modifié avec succès";
	// -> component
	public readonly accountPageTitle = "Informations personnelles";
	public readonly outdatedAccountInfo = "Ton compte n'est plus actif... si tu es encore à l'Ensimag, contacte-nous pour le réactiver"
	public readonly changePasswordButtonLabel = "Changer le mot de passe";
	public readonly deleteAccountButtonLabel = "Supprimer le compte";
	public readonly deleteAccountDialogTitle = "Confirmation de la suppression";
	public readonly deleteAccountDialogContent = "Êtes-vous certain de vouloir supprimer votre compte ?";
	public readonly deletedAccountInfo = "Suppression effectuée";

	// Actus
	// -> admin
	public readonly actus = "Actualités";
	public readonly actuAssoLabel = "Association";
	public readonly actuAssoError = "Association invalide";
	// -> actus-home
	public readonly noActu = "Aucune actualité";
	// -> component/actu-card
	public readonly deleteActuDialogTitle = "Confirmation de la suppression";
	public readonly deleteActuDialogContent = "Êtes-vous certain de vouloir supprimer \"{0}\" ?";
	public readonly deletedActuInfo = "Actualité supprimée";
	// edit-actus
	public readonly actuTitleLabel = "Titre";
	public readonly actuTitleError = "Titre invalide";
	public readonly actuDescriptionLabel = "Description (Markdown pour la mise en forme)";
	public readonly actuDescriptionError = "Description invalide";
	public readonly actuImageLabel = "URL de l'image";
	public readonly actuImageError = "URL invalide";
	public readonly actuPdfLinkLabel = "URL du document pdf";
	public readonly actuPdfLinkError = "URL invalide";
	public readonly actuDateLabel = "Date";
	public readonly actuDateError = "Date invalide";
	public readonly actuAuthorLabel = "Auteur";
	public readonly actuAuthorError = "Auteur invalide";

	// Admin
	// -> home
	public readonly adminLabel = "Admin";
	public readonly nbMembersLabel = "{0} membres";
	public readonly notOnTheList = "{0} n'est pas dans la liste";
	public readonly addGroupInfo = "Nom de groupe ou association";
	public readonly addGroupButtonLabel = "Ajouter";
	public readonly groupsLabel = "Groupes";

	// -> vote
	public readonly voteAdminLabel = "Admin vote";
	public readonly voteAdminPlLabel = "Admins vote";
	public readonly assessorLabel = "Assesseur";
	public readonly assessorPlLabel = "Assesseurs";
	public readonly addAssessorInfo = "Entrer l'e-mail d'un assesseur";
	public readonly addAssessorButtonLabel = "Ajouter";
	// -> cafet
	public readonly cafetAdminLabel = "Master cafet";
	public readonly cafetAdminPlLabel = "Masters cafet";
	public readonly cafetRespLabel = "Respo cafet";
	public readonly cafetRespPlLabel = "Respos cafet";
	public readonly addCafetRespInfo = "Entrer l'e-mail d'un respo cafet";
	public readonly addCafetRespButtonLabel = "Ajouter";
	// -> events
	public readonly eventsAdminLabel = "Admin events";
	public readonly eventsAdminPlLabel = "Admins events";
	public readonly comRespLabel = "Respo com'";
	public readonly comRespPlLabel = "Respos com'";
	public readonly addComRespInfo = "Entrer l'e-mail d'un respo com";
	public readonly addComRespButtonLabel = "Ajouter";
	// -> nsigma
	public readonly nsigmaAdminLabel = 'Admin Nsigma';
	public readonly nsigmaAdminPlLabel = 'Admins Nsigma';
	// -> jobadments
	public readonly jobadsAdminLabel = 'Admin annonces';
	public readonly jobadsAdminPlLabel = 'Admins annonces';
	// -> actus
	public readonly actusAdminLabel = "Admin actus";
	public readonly actusAdminPlLabel = "Admins actus";
	public readonly journalistLabel = "Journaliste";
	public readonly journalistPlLabel = "Journalistes";
	public readonly addJournalistInfo = "Entrer l'e-mail d'un journaliste";
	public readonly addJournalistButtonLabel = "Ajouter";

	// Auth
	public readonly logOutLabel = "Déconnexion";
	// -> login
	public readonly signInPageTitle = "Identifie-toi<br><small>ou crée un compte si tu n'en as pas encore !</small>";
	public readonly askForExistingEmailLabel = "Entre ton e-mail";
	public readonly askForExistingPwdLabel = "Entre ton mot de passe";
	public readonly signInButtonLabel = "Connexion";
	public readonly toSignInLabel = "Crée-toi un compte !";
	public readonly passwordForgottenLabel = "Mot de passe oublié ?";
	// -> auth-service
	public readonly noEmailError = "L'e-mail est exigé";
	public readonly emailFormatError = "L'e-mail est incorrect";
	public readonly emailDomainError = "L'e-mail doit appartenir au domaine '@ensimag.fr'";
	// -> signup
	public readonly signUpPageTitle = "Inscription";
	// -> email-verif
	public readonly verificationEmailSentTitle = "Compte non confirmé";
	public readonly verificationEmailSentInfo = "Un e-mail a été envoyé à l'adresse \"{0}\".<br>Valide ton compte en cliquant sur le lien de confirmation.<br><br><small>Si tu n'as reçu aucun e-mail : <br>(1) vérifie ton dossier spam<br>(2) vérifie ton adresse, en cas d'erreur tu devras recréer un compte<br>(3) renvoie l'e-mail (plusieurs fois)<br>(4) attends un peu, on ne sait jamais<br>(5) ...<br>(6) retourne à l'étape (1) si tu n'est pas sûr<br>(7) contacte ton Cercle préféré pour trouver une solution ;)<br><br>Si le lien a expiré immédiatement après avoir reçu l'e-mail :<br>(*) contacte ton Cercle préféré pour trouver une solution ;)</small>";
	public readonly sendEmailAgainButtonLabel = "Renvoyer l'email";
	public readonly emailSentToInfo = "Email envoyé à {0}";
	// -> password-reset
	public readonly beforePwdRstEmailInfo = "Un e-mail de réinitialisation de mot de passe va être envoyé à l'adresse donnée.";
	public readonly afterPwdRstEmailInfo = "Si l'adresse <b>{0}</b> est correcte, un lien de réinitialisation lui a été envoyé.";

	// Cafet
	public readonly creditLabel = "Solde";
	public readonly addButtonLabel = "Crediter";
	public readonly substractButtonLabel = "Débiter";
	public readonly informAboutTransaction = "Le solde du compte de {0} a bien été modifié de {1}€";
	// -> admin-accounts
	public readonly printAccountsToPdf = "Imprimer les comptes";
	public readonly leaveAccountsToPdfPreview = "Quitter l'aperçu";
	public readonly saveAccountsToPdf = "Enregistrer les comptes";
	public readonly displayDayAccountsPreview = "Verifier les transactions du jour";
	public readonly leaveDayAccountsPreview = "Quitter l'aperçu";
	public readonly validateDayTransactionsButtonLabel = "Valider les transactions du jour";
	public readonly noDayTransactions = "Aucune transaction en attente de validation";
	// -> admin-archives
	public readonly noArchivedUsers = "Aucun utilisateur archivé ne correspond";
	// -> admin-users
	public readonly cafetAccountsMatch = "{0} compte existe déjà";
	public readonly orderByCreditLabel = "par solde";
	public readonly orderByLastTransactionDateLabel = "par date";
	public readonly createAccountLabel = "Créer le compte";
	public readonly confirmCafetAccountCreationDialogTitle = "Utilisateur introuvable";
	public readonly confirmCafetAccountCreationDialogContent = "Voulez-vous ajouter \"{0}\" en tant qu'externe ?";
	public readonly informAboutCafetCreation = "Le compte de {0} a bien été créé et crédité de {1}€";
	// -> edit-cafet-user
	public readonly achiveCafetUserButtonLabel = "Archiver";
	public readonly restoreCafetUserButtonLabel = "Restaurer";
	public readonly deleteCafetUserButtonLabel = "Supprimer";
	// -> trezo
	public readonly nbOfRegisteredCafetAccountsLabel = "Comptes enregistrés : {0}";
	public readonly totalOnRegisteredCafetAccountsLAbel = "Total sur les comptes : {0}";
	public readonly nbOfPositiveCafetAccountsLabel = "Comptes enregistrés dans le posiitif : {0}";
	public readonly totalOnPositiveCafetAccountsLabel = "Total sur les comptes dans le positif : {0}";
	public readonly nbOfNegativeCafetAccountsLabel = "Comptes enregistrés dans le négatif : {0}";
	public readonly totalOnNegativeCafetAccountsLabel = "Total sur les comptes dans le négatif : {0}";
	// ->cafet-admin
	public readonly clientListLabel = "Clients";
	public readonly cafetAccountsLabel = "Comptes";
	public readonly cafetArchivesLabel = "Archives";
	public readonly cafetTrezoLabel = "Trezo";
	// -> cafet-history
	public readonly transactionDateLabel = "Date";
	public readonly transactionValueLabel = "Montant";
	public readonly cafetAccountCreationDateLabel = "Création du compte";
	// -> cafet-home
	public readonly negativeCreditError = "T'es en <b>négatif</b> !<br><small>Tu devrais mettre de l'argent sur ton compte.</small>";
	// -> cafet-info
	public readonly noCafetAccountInfo = "<b>Tu n'as pas encore de compte à la cafet</b><br><br>Contacte les respo' cafet afin que ces derniers te créent un compte !<br><br>";
	// -> cafet-service
	public readonly cafetUserNoLonguerExists = "Erreur : le compte de {0} n'existe plus";

	// TODO: do not allow changing cafet profile if day transactions
	// public readonly achiveUserPermissionDenied = "Action refusée, le client a des transactions non validées";
	// public readonly weekIngredientLabel = "Ingrédient de la semaine";

	// Calendar
	// -> edit-all
	public readonly nbOfSubscriptionsToDeletedEvents = "{0} abonnements à des événements passés";
	public readonly deleteEventSubsciptionsButtonLabel = "Effacer";
	public readonly deletePersoEventDialogTitle = "Confirmation de la suppression";
	public readonly deletePersoEventDialogContent = "Êtes-vous certain de vouloir supprimer \"{0}\" ?";
	public readonly deletedPersoEventInfo = "Evénement supprimé";
	// -> settings
	public readonly calSettingsTitle = "Paramètres du calendrier";
	public readonly calSettingsResourcesLabel = "Ressources ADE";
	public readonly calSettingsResourcesError = "ex: '1234,5678,1479'";
	public readonly gatherFromZenithInfo = "<b>Ressources ADE</b><br><br>Il s'agist de la liste des reférences de tes cours. Tu peux récupérer cette information depuis l'URL que tu utilises pour consulter ton calendrier.<br><br>Laisse-nous récupérer automatiquement cette information depuis ton espace Zenith.<br><br>Tes identifiants ne sont <b>pas</b> enregistrés.<br><br>Ces ressources sont à <b>mettre à jour tous les semestres</b> environ. Les cours pour un mois à partir de la date du jour sont téléchargés et affichés.";
	public readonly gatherFromZenithButtonLabel = "Récupérer via Zenith";
	public readonly updatedResourcesInfo = "Paramètres mis à jour";
	public readonly ZenithCredentialsDialogTitle = "Connexion à Zenith";
	public readonly ZenithCredentialsDialogContent = "Identifiants de connexion à Zenith";
	public readonly waitZenithConnectionInfo = "Connexion à Zenith...";
	public readonly invalidZenithCredentialsError = "Identifiants incorrects";
	public readonly dangerousZenithCredentialsError = "Caractère dangereux, désolé";
	public readonly ZenithConnectionError = "Echec de la connexion";
	public readonly ZenithConnectionOk = "Ressources récupérées. Enregistre";
	public readonly displayICSDownloadInfo = "Afficher le bouton de téléchargement au format ICS";
	public readonly eventsByDefaultInfo = "Ajouter par défaut les événements associatifs au calendier";
	public readonly eventsCipherInfo = "<b>Chiffrement</b><br><br>Renseigne le mot de passe pour encoder et décoder les informations relatives à tes événements personnels (optionnel).<br>Ce mot de passe ne pourra (pour l'instant) pas être changé et devra être renseigné sur chaque appareil utilisant l'application.";
	public readonly keyHashOkInfo = "Mot de passe déjà créé : {0}";
	public readonly passwordOkInfo = "Mot de passe renseigné sur cet appareil : {0}";
	public readonly keyNotConfiguredError = "Aucun mot de passe n'est configuré pour chiffrer";
	public readonly cipherLabel = "Chiffrer";
	public readonly cipherChangePasswordTitle = "Mot de passe de chiffrement différent";
	public readonly cipherChangePasswordInfo = "Le mot de passe de chiffrement n'est pas celui attendu. Changer le mot de passe maintenant rendra tous les champs chiffrés avec illisibles.<br><br>Est-tu sûr de vouloir changer le mot de passe ?";
	// -> day-column
	public readonly noCalEvent = "Rien de prévu";
	// -> edit-cal
	public readonly eventOccurencesLabel = "Occurences";
	public readonly eventOccurencesError = "Occurences invalides";

	// Events
	// -> event/cal-event form
	public readonly eventTitleLabel = "Titre";
	public readonly eventTitleError = "Titre invalide";
	public readonly eventStartLabel = "Date de début (mm/dd/yyyy)";
	public readonly eventStartError = "Date de début invalide";
	public readonly eventStartTimeLabel = "Heure de début (HH:mm)";
	public readonly eventStartTimeError = "Heure de début invalide";
	public readonly eventEndLabel = "Date de fin (mm/dd/yyyy)";
	public readonly eventEndError = "Date de fin invalide";
	public readonly eventEndTimeLabel = "Heure de fin (HH:mm)";
	public readonly eventEndTimeError = "Heure de fin invalide";
	public readonly eventLocationLabel = "Lieu";
	public readonly eventLocationError = "Lieu invalide";
	// -> event-card
	public readonly isNowLabel = "En direct";
	public readonly isPasssedLabel = "Passé";
	public readonly deleteEventDialogTitle = "Confirmation de la suppression";
	public readonly deleteEventDialogContent = "Êtes-vous certain de vouloir supprimer \"{0}\" ?";
	public readonly deletedEventInfo = "Evénement supprimé";
	// -> edit-event
	public readonly eventDescriptionLabel = "Description (Markdown pour la mise en forme)";
	public readonly eventDescriptionError = "Description invalide";
	public readonly eventImageLabel = "URL de l'image";
	public readonly eventImageError = "URL invalide";
	public readonly eventAssoLabel = "Association";
	public readonly eventAssoError = "Association invalide";
	public readonly eventPriceLabel = "PAF";
	public readonly eventPriceError = "Prix invalide";
	public readonly free = "Gratuit";
	// -> event
	public readonly eventStart = "Début : {0}";
	public readonly eventEnd = "Fin : {0}";
	public readonly eventOrganizer = "Organisateur : {0}";
	public readonly eventLocation = "Lieu : {0}";
	public readonly eventPrice = "PAF : {0}";
	public readonly participate = "Ajouté à mon planning";
	public readonly doNotParticipate = "Pas dans mon planning";
	// -> event-admin
	public readonly events = "Evénements";
	// -> event-home
	public readonly noEvent = "Aucun événement à venir";

	// Info
	// -> legal-notice
	public readonly legalNoticeLabel = "Mentions légales";
	// -> user-guide
	public readonly userGuideLabel = "Détail des fonctionnalités";

	// JobAd
	public readonly jobadDone = "Finie";
	// -> jobad-jobad
	public readonly jobadTechnologiesIntro = "Technologies : ";
	public readonly jobadDurationIntro = "Durée : ";
	// -> jobad-edit
	public readonly jobadOngoing = 'En cours';
	public readonly jobadTitleLabel = "Titre";
	public readonly jobadTitleError = "Titre invalide";
	public readonly jobadDescriptionLabel = "Description (Markdown pour la mise en forme)";
	public readonly jobadDescriptionError = "Description invalide";
	public readonly jobadTypeLabel = "Nature de l'offre";
	public readonly jobadTypeError = "Type invalide";
	public readonly jobadType0 = "Durée déterminée";
	public readonly jobadType1 = "Durée indéterminée";
	public readonly jobadType2 = "Générale";
	public readonly jobadStartLabel = 'Date de début';
	public readonly jobadStartError = 'Date invalide';
	public readonly jobadLengthLabel = 'Durée';
	public readonly jobadLengthError = 'Durée invalide';
	public readonly jobadContactLabel = 'Contact';
	public readonly jobadContactError = 'Contact invalide';
	public readonly jobadAuthorLabel = 'Auteur';
	public readonly jobadAuthorError = 'Auteur invalide';
	public readonly jobadTechnologiesLabel = 'Technologies';
	public readonly jobadTechnologiesError = 'Technologies invalides';
	// -> jobad-home
	public readonly noJobAds = 'Aucune annonce';
	// -> jobad-card
	public readonly deleteJobAdsDialogTitle = "Confirmation de la suppression";
	public readonly deleteJobAdsDialogContent = "Êtes-vous certain de vouloir supprimer \"{0}\" ?";
	public readonly deletedJobAdsInfo = "Annonce supprimée";

	// Nsigma
	public readonly nsigmaJobAdsDone = "Recrutement terminé";
	public readonly nsigmaJobAdsOngoing = 'En cours';
	// -> nsigma-card
	public readonly deleteNsigmaJobAdsDialogTitle = "Confirmation de la suppression";
	public readonly deleteNsigmaJobAdsDialogContent = "Êtes-vous certain de vouloir supprimer \"{0}\" ?";
	public readonly deletedNsigmaJobAdsInfo = "Annonce supprimée";
	// -> jobad
	public readonly remuneration = "Rémunération : {0}";
	public readonly technologies = "<b>Technologies : </b>{0}";
	public readonly difficulty = "<b>Difficulté : </b>{0}";
	public readonly applyToNsigmaJobAds = "Candidater";
	// -> edit
	public readonly nsigmaTitleLabel = "Titre";
	public readonly nsigmaTitleError = "Titre invalide";
	public readonly nsigmaDescriptionLabel = "Description (Markdown pour la mise en forme)";
	public readonly nsigmaDescriptionError = "Description invalide";
	public readonly nsigmaTypeLabel = "Type de l'étude";
	public readonly nsigmaTypeError = "Type invalide";
	public readonly nsigmaType0 = "Web";
	public readonly nsigmaType1 = "Mobile";
	public readonly nsigmaType2 = "Maths";
	public readonly nsigmaType3 = "Telecom";
	public readonly nsigmaType4 = "Bureautique";
	public readonly nsigmaType5 = "Sécurité";
	public readonly nsigmaType6 = "Général";
	public readonly nsigmaStartLabel = "Début";
	public readonly nsigmaStartError = "Début invalide";
	public readonly nsigmaEndLabel = "Fin";
	public readonly nsigmaEndError = "Fin invalide";
	public readonly nsigmaTechnologiesLabel = "Technologies";
	public readonly nsigmaTechnologiesError = "Technologies invalides";
	public readonly nsigmaDifficultyLabel = "Difficulté";
	public readonly nsigmaDifficultyError = "Difficulté invalide";
	public readonly nsigmaRemunerationLabel = "Rémunération";
	public readonly nsigmaRemunerationError = "Rémunération invalide";
	public readonly nsigmaFormLabel = "Formulaire Google de contact";
	public readonly nsigmaFormError = "Formulaire invalide";
	// -> home
	public readonly noNsigmaJobAd = "Nsigma ne recrute pas en ce moment";

	// AppModules
	// -> cafet
	public readonly cafetModuleDisplayName = "Cafet";
	public readonly cafetModuleDescription = "Gère tes comptes en consultant ton solde ainsi que l'historique de tes dépenses !";
	public readonly cafetModuleFullName = "Gestion de mon compte cafétéria";
	// -> calendar
	public readonly calendarModuleDisplayName = "Planning";
	public readonly calendarModuleDescription = "Plus question d'arriver en retard, consulte en direct tes cours et tes événements !";
	public readonly calendarModuleFullName = "Tout sur mes cours et événements";
	// -> event
	public readonly eventsModuleDisplayName = "Evénements";
	public readonly eventsModuleDescription = "Renseigne-toi sur l'ensemble des événements liés à la vie au sein de Grenoble INP et ajoute-les à ton calendrier !";
	public readonly eventsModuleFullName = "Les événements à ne pas manquer !";
	// -> actus
	public readonly actusModuleDisplayName = "Actus";
	public readonly actusModuleDescription = "Consulte l'essentiel de l'information grâce à l'engagement des journalistes imag du Pole Com' !";
	public readonly actusModuleFullName = "Les actualités de l'école";
	// -> jobad
	public readonly jobadsModuleDisplayName = "Annonces";
	public readonly jobadsModuleDescription = "Retrouve l'ensemble des offres de stages et d'embauches réservées au réseau Ensimag !";
	public readonly jobadsModuleFullName = "Offres de stages et recrutements";
	// -> nsigma
	public readonly nsigmaModuleDisplayName = "Nsigma";
	public readonly nsigmaModuleDescription = "Les projets d'informatique et de mathématiques appliquées d'Nsigma n'attendent que toi pour commencer !";
	public readonly nsigmaModuleFullName = "Recrutement de la Junior Entreprise";
	// -> vote
	public readonly votesModuleDisplayName = "Votes";
	public readonly votesModuleDescription = "Vote pour ta liste préférée et aide la à rentrer dans l'Histoire en remportant l'accès au bureau !";
	public readonly votesModuleFullName = "Elections et sondages";
	// -> infos
	public readonly infosModuleDisplayName = "Lisez-moi";
	public readonly infosModuleDescription = "Retrouve ici mentions légales et tutoriels pour l'utilisation de cette application.";
	public readonly infosModuleFullName = "A propos d'ensicerclapp ;)";

	// Vote
	public readonly startLabel = "Start";
	// -> assessor
	public readonly markAsVotedEmailInfo = "Email d'un votant en face-à-face";
	public readonly markAsVotedDomainInfo = "Domaine";
	public readonly votedButtonLabel = "A voté !";
	public readonly pollChoiceLabel = "Choix des scrutins";
	public readonly noPoll = "Pas de scrutin en cours.";
	public readonly unknownUserInfo = "Utilisateur inconnu : {0}";
	public readonly markedAsVoted = "{0} a bien été ajouté";
	// -> vote-card
	public readonly votedLabel = "A voté";
	public readonly deletePollDialogTitle = "Confirmation de la suppression";
	public readonly deletePollDialogContent = "Êtes-vous certain de vouloir supprimer le scrutin \"{0}\" ?";
	public readonly deletedPollInfo = "Scrutin supprimé";
	// -> edit
	public readonly pollTitleLabel = "Titre";
	public readonly pollTitleError = "Titre invalide";
	public readonly pollDescriptionLabel = "Description (Markdown pour la mise en forme)";
	public readonly pollDescriptionError = "Description invalide";
	public readonly choiceTitleLabel = "Nom complet";
	public readonly choiceImageLabel = "Image URL (public)";
	public readonly choiceShortNameLabel = "Diminutif";
	public readonly addChoiceLabel = "Ajouter un choix";
	// -> poll
	public readonly notStartedInfo = "Le vote n'a pas encore débuté...";
	public readonly voteForTemplate = "Voter {0}";
	public readonly confirmVoteDialogTitle = "Confirmation du vote";
	public readonly confirmVoteDialogContent = "Êtes-vous certain de vouloir voter pour \"{0}\" ?";
	public readonly voteComfirmationMessage = "Vote pour \"{0}\" enregistré";
	// -> results
	public readonly pollResultsLabel = "Résultats";
	public readonly pollResultsTemplate = "{0} : {1} votes ({2}%)";
	// -> admin
	public readonly polls = "Scrutins";
	// -> users
	public readonly nbVoteUsersLabel = "{0} votants";
	public readonly noUserMatchInfo = "Aucun votant ne correspond aux filtres";


}
