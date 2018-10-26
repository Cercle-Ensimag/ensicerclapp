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
  public static readonly confirmLabel = "Confimer";
  public static readonly agreeLabel = "Accepter";
  public static readonly modifyLabel = "Modifier";
	public static readonly applyChangesLabel = "Appliquer";
  public static readonly changesApplied = "Changements appliqués avec succès";
  public static readonly locale = "fr";
  public static readonly timeFormat = "H:mm";
  public static readonly shortDateFormat = "E d LLL";
  public static readonly longDateFormat = "EEEE d LLLL";
  public static readonly shortDateTimeFormat = "E d LLL H:mm";
  public static readonly longDateTimeFormat = "EEEE d LLLL H:mm";
	// -> form errors
	public static readonly passwordError = "Mot de passe invalide";
	public static readonly firstNameError = "Prénom invalide";
	public static readonly lastNameError = "Nom de famille invalide";
	// -> auth errors
	public static readonly refreshTokenInfo = "Cette opréation nécéssite de s'être identifié recemment";

	// Account
	// -> update password dialog
	public static readonly changePasswordTitle = "Changement de mot de passe";
	public static readonly changePasswordInfo = "Saisissez votre nouveau mot de passe :";
	public static readonly passwordConfirmationError = "Confirmation invalide";
	public static readonly pwdChangeValidationButtonLabel = "Mettre à jour le mot de passe";
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
	public static readonly adminLabel = "Admin";
	public static readonly nbMembersLabel = "{0} membres";

	public static readonly voteAdminLabel = "Admin vote";
	public static readonly voteAdminPlLabel = "Admins vote";
	public static readonly assessorLabel = "Assesseur";
	public static readonly assessorPlLabel = "Assesseurs";
	public static readonly addAssessorInfo = "Entrer l'e-mail d'un assesseur";
	public static readonly addAssessorButtonLabel = "Ajouter";

	public static readonly cafetAdminLabel = "Master cafet";
	public static readonly cafetAdminPlLabel = "Masters cafet";
	public static readonly cafetRespLabel = "Respo cafet";
	public static readonly cafetRespPlLabel = "Respos cafet";
	public static readonly addCafetRespInfo = "Entrer l'e-mail d'un respo cafet";
	public static readonly addCafetRespButtonLabel = "Ajouter";

	public static readonly eventsAdminLabel = "Admin events";
	public static readonly eventsAdminPlLabel = "Admins events";
	public static readonly comRespLabel = "Respo com'";
	public static readonly comRespPlLabel = "Respos com'";
	public static readonly addComRespInfo = "Entrer l'e-mail d'un respo com";
	public static readonly addComRespButtonLabel = "Ajouter";

	public static readonly nsigmaAdminLabel = 'Admin Nsigma';
	public static readonly nsigmaAdminPlLabel = 'Admins Nsigma';

	public static readonly announcesAdminLabel = 'Admin announces';
	public static readonly announcesAdminPlLabel = 'Admins announces';

	public static readonly actusAdminLabel = "Admin actus";
	public static readonly actusAdminPlLabel = "Admins actus";
	public static readonly journalistLabel = "Journaliste";
	public static readonly journalistPlLabel = "Journalistes";
	public static readonly addJournalistInfo = "Entrer l'e-mail d'un journaliste";
	public static readonly addJournalistButtonLabel = "Ajouter";

	// Annonce
	public static readonly announceDone = "Finie";
	// -> annonce-annonce
	public static readonly announceTechnologiesIntro = "Technologies : ";
	public static readonly announceDurationIntro = "Durée : ";
	// -> annonce-edit
	public static readonly announceOngoing = 'En cours';
	public static readonly announceTitleLabel = "Titre";
	public static readonly announceTitleError = "Titre invalide";
	public static readonly announceDescriptionLabel = "Description (Markdown pour la mise en forme)";
	public static readonly announceDescriptionError = "Description invalide";
	public static readonly announceTypeLabel = "Nature de l'offre";
	public static readonly announceTypeError = "Type invalide";
	public static readonly announceType0 = "Durée déterminée";
	public static readonly announceType1 = "Durée indéterminée";
	public static readonly announceType2 = "Générale";
	public static readonly announceStartLabel = 'Date de début';
	public static readonly announceStartError = 'Date invalide';
	public static readonly announceLengthLabel = 'Durée';
	public static readonly announceLengthError = 'Durée invalide';
	public static readonly announceContactLabel = 'Contact';
	public static readonly announceContactError = 'Contact invalide';
	public static readonly announceAuthorLabel = 'Auteur';
	public static readonly announceAuthorError = 'Auteur invalide';
	public static readonly announceTechnologiesLabel = 'Technologies';
	public static readonly announceTechnologiesError = 'Technologies invalides';
	// -> annonce-home
	public static readonly noAnnounce = 'Aucune annonce';
	// -> annonce-card
	public static readonly deleteAnnounceDialogTitle = "Confirmation de la suppression";
	public static readonly deleteAnnounceDialogContent = "Êtes-vous certain de vouloir supprimer \"{0}\" ?";
	public static readonly deletedAnnounceInfo = "Annonce supprimée";

  // Auth
  public static readonly logOutLabel = "Déconnexion";
  public static readonly signInPageTitle = "Identifie-toi<br><small>ou crée un compte si tu n'en as pas encore !</small>";
  public static readonly signInButtonLabel = "Connexion";
  public static readonly signUpPageTitle = "Inscription";
  public static readonly signUpButtonLabel = "Créer le compte";
  public static readonly firstNameLabel = "Prénom";
  public static readonly lastNameLabel = "Nom de famille";
  public static readonly nicknameLabel = "Surnom";
  public static readonly passwordlLabel = "Mot de passe";
  public static readonly askForExistingPwdLabel = "Entre ton mot de passe";
  public static readonly emailLabel = "E-mail";
  public static readonly askForExistingEmailLabel = "Entre ton e-mail";
  public static readonly emailDomainError = "L'e-mail doit appartenir au domaine '@ensimag.fr'";
  public static readonly noEmailError = "L'e-mail est exigé";
  public static readonly emailFormatError = "L'e-mail est incorrect";
  public static readonly beforePwdRstEmailInfo = "Un e-mail de réinitialisation de mot de passe va être envoyé à l'adresse donnée.";
  public static readonly sendPwdResetEmailLabel = "Envoyer l'e-mail";
  public static readonly afterPwdRstEmailInfo = "Si l'adresse <b>{0}</b> est correcte, un lien de réinitialisation lui a été envoyé.";
  public static readonly verificationEmailSentInfo = "Un e-mail de confirmation a été envoyé à l'adresse utilisée lors de ton votre inscription.<br><br>Vérifie ta boîte e-mail et ton dossier spam puis clique sur le lien de confirmation.";
  public static readonly sendEmailAgainLabel = "Renvoyer l'email";
  public static readonly passwordTooShortError = "Mot de passe trop court";
  public static readonly toSignInLabel = "Crée-toi un compte !";
  public static readonly passwordForgottenLabel = "Mot de passe oublié ?";
  public static readonly deleteAccountInfo = "Tu es sur le point de supprimer ton compte !";
  public static readonly confimDeleteAccountButtonLabel = "Supprimer le compte";
  public static readonly passwordChangedInfo = "Ton mot de passe a été modifié avec succès";

  // Vote
  public static readonly polls = "Scrutins";
  public static readonly noPoll = "Il n'y a pour l'instant aucun scrutin !";
  public static readonly pollChoiceLabel = "Choix des scrutins";
  public static readonly addPollLabel = "Créer un nouveau scrutin";
  public static readonly confirmPollDeleteLabel = "Supprimer";
  public static readonly confirmPollDeleteInfo = "Tu es sur le point de supprimer<br>\"{0}\"<br> et ses résultats.<br>En es-tu sûr ?";
  public static readonly choiceSelectionInfo = "Tu es sur le point de voter pour";
  public static readonly voteForLabel = "Voter";
  public static readonly pollIdLabel = "ID";
  public static readonly pollTitleLabel = "Titre";
  public static readonly pollDescriptionLabel = "Description (Markdown pour la mise en forme)";
  public static readonly choiceIdLabel = "ID";
  public static readonly choiceLabelLabel = "Nom complet";
  public static readonly choiceImageLabel = "Image URL (public)";
  public static readonly choiceShortLabelLabel = "Diminutif";
  public static readonly addChoiceLabel = "Ajouter un choix";
  public static readonly invalidIdError = "ID trop court ou déjà existant";
  public static readonly pollTitleTooShortError = "Titre trop court";
  public static readonly pollDescriptionError = "Erreur dans la description";
  public static readonly markAsVotedEmailInfo = "Email d'un votant en face-à-face";
  public static readonly markAsVotedDomainInfo = "Domaine";

  public static readonly markedAsVoted = "{0} a bien été ajouté";
  public static readonly votedButtonLabel = "A voté !";
  public static readonly notOnTheList = "{0} n'est pas dans la liste";
  public static readonly nbVoteUsersLabel = "{0} votants";

  // Events
  public static readonly events = "Evénements";
  public static readonly noEvent = "Aucun événement, pour le moment ;)";
  public static readonly periodFormat = "Du {0} au {1}";
  public static readonly addEventLabel = "Créer un nouvel événement";
  public static readonly confirmEventDeleteLabel = "Supprimer";
  public static readonly confirmEventDeleteInfo = "Tu es sur le point de supprimer l'événement<br>\"{0}\".<br>En es-tu sûr ?";

  public static readonly eventIdLabel = "ID";
  public static readonly eventTitleLabel = "Titre";
  public static readonly eventDescriptionLabel = "Description (Markdown pour la mise en forme)";
  public static readonly eventImageLabel = "URL de l'image";
  public static readonly eventStartLabel = "Date de début (mm/dd/yyyy)";
  public static readonly eventEndLabel = "Date de fin (mm/dd/yyyy)";
  public static readonly eventStartTimeLabel = "Heure de début (HH:mm)";
  public static readonly eventEndTimeLabel = "Heure de fin (HH:mm)";
  public static readonly eventLocationLabel = "Lieu";
  public static readonly eventAssoLabel = "Association";
  public static readonly eventPriceLabel = "PAF";
  public static readonly eventTitleTooShortError = "Titre trop court";
  public static readonly eventDescriptionError = '';
  public static readonly eventImageError = '';
  public static readonly eventStartError = "Date de début requise";
  public static readonly eventEndError = "Date de fin requise";
  public static readonly eventStartTimeError = "Heure de début requise";
  public static readonly eventEndTimeError = "Heure de fin requise";
  public static readonly eventLocationError = "Lieu requis";
  public static readonly eventAssoError = "Association requise";
  public static readonly eventPriceError = "Prix requis";
  public static readonly eventStart = "Début : {0}";
  public static readonly eventEnd = "Fin : {0}";
  public static readonly eventLocation = "Lieu : {0}";
  public static readonly eventOrganizer = "Organisateur : {0}";
  public static readonly eventPrice = "PAF : {0}";
  public static readonly free = "Gratuit";


  // Cafet
  public static readonly troll = "<b>Ton</b> compte est dans le <b>négatif</b>!<br><small>(*non contractuel, tu n'as pas encore de compte.)</small>";
  public static readonly creditLabel = "Solde";
  public static readonly informAboutTransaction = "Le solde du compte de {0} a bien été modifié de {1}€";
  public static readonly informAboutCafetCreation = "Le compte de {0} a bien été créé et crédité de {1}€";
  public static readonly clientListLabel = "Clients";
  public static readonly createAccountLabel = "Créer le compte";
  public static readonly cafetEmailInfo = "Entrer l'e-mail d'un client";
  public static readonly cafetSearchInfo = "Chercher un client";
  public static readonly addButtonLabel = "Crediter";
  public static readonly substractButtonLabel = "Débiter";
  public static readonly weekIngredientLabel = "Ingrédient de la semaine";
  public static readonly negativeCreditError = "<b>Ton</b> compte est dans le <b>négatif</b>!<small>Tu devrais mettre de l'argent sur ton compte.</small>";
  public static readonly orderByCreditLabel = "par solde";
  public static readonly orderByLastTransactionDateLabel = "par date";

  public static readonly cafetAccountsLabel = "Comptes";
  public static readonly printAccountsToPdf = "Imprimer les comptes";
  public static readonly leaveAccountsToPdfPreview = "Quitter l'aperçu";
  public static readonly saveAccountsToPdf = "Enregistrer les comptes";

  public static readonly displayDayAccountsPreview = "Verifier les transactions du jour";
  public static readonly leaveDayAccountsPreview = "Quitter l'aperçu";
  public static readonly validateDayTransactionsButtonLabel = "Valider les transactions du jour";
  public static readonly noDayTransactions = "Aucune transaction en attente de validation";
  public static readonly achiveUserPermissionDenied = "Action refusée, le client a des transactions non validées";

  public static readonly cafetAccountsMatch = "{0} compte existe déjà";
  public static readonly confirmExteCafetAccount = "Créer le compte quand même";
  public static readonly cafetAccountCreationDateLabel = "Création du compte";

  public static readonly transactionDateLabel = "Date";
  public static readonly transactionValueLabel = "Montant";

  public static readonly cafetArchivesLabel = "Archives";
  public static readonly achiveCafetUserButtonLabel = "Archiver";
  public static readonly restoreCafetUserButtonLabel = "Restaurer";
  public static readonly deleteCafetUserButtonLabel = "Supprimer";
  public static readonly deleteCafetUserWarning = "Le compte de {0} va être définitivement supprimé.";


  // Calendar
  public static readonly calSettingsRessourcesLabel = "Ressources ADE";
  public static readonly calSettingsRessourcesError = "ex: '1234,5678,1479'";
  public static readonly calSettingsTitle = "Paramètres du calendrier";
  public static readonly noCalEvent = "Rien de prévu";
  public static readonly eventOccurencesLabel = "Occurences";
  public static readonly eventOccurencesError = '';

  public static readonly cafetTrezoLabel = "Trezo";
  public static readonly numberOfAllAccountsLabel = "Nombre de comptes total : {0}";
  public static readonly totalOfAllAccountsLabel = "Total sur les comptes : {0}€";
  public static readonly numberOfNegAccountsLabel = "Nombre de comptes en négatif : {0}";
  public static readonly totalOfNegativeAccountsLabel = "Total sur les comptes en négatif : {0}€";
  public static readonly numberOfPosAccountsLabel = "Nombre de comptes en positif : {0}";
  public static readonly totalOfPositiveAccountsLabel = "Total sur les comptes en positif : {0}€";

  // Nsigma
  public static readonly noNsigmaAnnonce = `Aucune announce Nsigma n'est disponible pour le moment, reviens plus tard.`;
  public static readonly confirmNsigmaAnnonceDeleteInfo = "Voulez-vous vraiment supprimer cette announce ?";
  public static readonly confirmNsigmaAnnonceDeleteLabel = "Confirmer la suppression";
  public static readonly nsigmaTitleLabel = 'Titre';
  public static readonly nsigmaTitleTooShortError = 'Titre trop court';
  public static readonly nsigmaDescriptionLabel = "Description (Markdown pour la mise en forme)";
  public static readonly nsigmaDescriptionError = 'Description trop courte';
  public static readonly nsigmaTypeLabel = 'Type de l\'étude';
  public static readonly nsigmaTypeError = 'Type invalide';
  public static readonly nsigmaStartLabel = 'Début';
  public static readonly nsigmaStartError = 'Début invalide';
  public static readonly nsigmaEndLabel = 'Fin';
  public static readonly nsigmaEndError = 'Fin invalide';
  public static readonly nsigmaTechnologiesLabel = 'Technologies';
  public static readonly nsigmaTechnologiesError = 'Technologies invalides';
  public static readonly nsigmaRemunerationLabel = 'Rémunération';
  public static readonly nsigmaRemunerationError = 'Rémunération invalide';
  public static readonly nsigmaDifficultyLabel = 'Difficulté';
  public static readonly nsigmaDifficultyError = 'Difficulté invalide';
  public static readonly nsigmaFormLabel = 'Formulaire Google de contact';
  public static readonly nsigmaFormError = 'Formulaire invalide';
  public static readonly nsigmaEnCours = 'En cours';
  public static readonly nsigmaFinie = 'Finie';


  // Info
  public static readonly legalNoticeLabel = "Mentions légales";
  public static readonly userGuideLabel = "Détail des fonctionnalités";

}
