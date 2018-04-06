import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);

export class French {
  // Common
  public static readonly appName = "Ensicerclapp";
  public static readonly backLabel = "Retour";
  public static readonly confirmLabel = "Confimer";
  public static readonly cancelLabel = "Annuler";
  public static readonly applyChangesLabel = "Appliquer";
  public static readonly okLabel = "Ok";
  public static readonly changesApplied = "Changements appliqués avec succès";
  public static readonly search = "recherche";
  public static readonly locale = "fr";
  public static readonly timeFormat = "H:mm";
  public static readonly shortDateFormat = "E d LLL";
  public static readonly longDateFormat = "EEEE d LLLL";
  public static readonly shortDateTimeFormat = "E d LLL H:mm";
  public static readonly longDateTimeFormat = "EEEE d LLLL H:mm";

  // Auth
  public static readonly logOutLabel = "Déconnexion";
  public static readonly signInPageTitle = "Identifie-toi<br><small>ou crée un compte si tu n'en a pas encore !</small>";
  public static readonly signInButtonLabel = "Connexion";
  public static readonly signUpPageTitle = "Crée-toi un compte";
  public static readonly signUpButtonLabel = "Créer le compte";
  public static readonly firstNameLabel = "Prénom";
  public static readonly firstNameError = "Prénom exigé";
  public static readonly lastNameLabel = "Nom de famille";
  public static readonly lastNameError = "Nom de famille exigé";
  public static readonly nicknameLabel = "Surnom";
  public static readonly passwordlLabel = "Mot de passe";
  public static readonly askForExistingPwdLabel = "Entre ton mot de passe";
  public static readonly emailLabel = "E-mail";
  public static readonly askForExistingEmailLabel = "Entre ton e-mail";
  public static readonly emailDomainError = "L'e-mail doit appartenir au domaine '@ensimag.fr'";
  public static readonly noEmailError = "L'e-mail est exigé";
  public static readonly emailFormatError = "L'e-mail est incorrect";
  public static readonly beforePwdRstEmailInfo = "Un e-mail de réinitialisation de mot de passe va être envoyé à l'adresse donnée";
  public static readonly sendPwdResetEmailLabel = "Envoyer l'e-mail";
  public static readonly afterPwdRstEmailInfo = "Ouvre le lien contenu dans l'email envoyé à {0}";
  public static readonly verificationEmailSentInfo = "Un e-mail de confirmation a été envoyé.<br>Consulte tes e-mails<br>Pour recevoir un nouvel e-mail ou être redirigé sur la page de connexion, choisis ci-dessous :";
  public static readonly sendEmailAgainLabel = "Renvoyer l'email";
  public static readonly passwordTooShortError = "Mot de passe trop court";
  public static readonly toSignInLabel = "Crée-toi un compte !";
  public static readonly passwordForgottenLabel = "Mot de passe oublié ?";
  public static readonly accountPageTitle = "Informations personnelles";
  public static readonly deleteAccountButtonLabel = "Supprimer le compte";
  public static readonly deleteAccountInfo = "Tu es sur le point de supprimer ton compte !";
  public static readonly refreshTokenInfo = "Cette opréation nécéssite de s'être identifié recemment";
  public static readonly confimDeleteAccountButtonLabel = "Supprimer le compte";
  public static readonly accountDeletedInfo = "Ton compte a été correctement supprimé";
  public static readonly passwordChangedInfo = "Ton mot de passe a été modifié avec succès";
  public static readonly changePasswordButtonLabel = "Changer mot de passe";
  public static readonly changePasswordInfo = "Tu es sur le point de changer de mot de passe";

  // Admin
  public static readonly adminLabel = "Admin";
  public static readonly nbMembersLabel = "{0} membres";

  public static readonly voteAdminLabel = "Admin vote";
  public static readonly voteAdminPlLabel = "Admins vote";
  public static readonly assessorLabel = "Assesseur"
  public static readonly assessorPlLabel = "Assesseurs"
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

  public static readonly actusAdminLabel = "Admin actus";
  public static readonly actusAdminPlLabel = "Admins actus";
  public static readonly journalistLabel = "Journaliste";
  public static readonly journalistPlLabel = "Journalistes";
  public static readonly addJournalistInfo = "Entrer l'e-mail d'un journaliste";
  public static readonly addJournalistButtonLabel = "Ajouter";


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
  public static readonly pollDescriptionLabel = "Description";
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
  public static readonly eventDescriptionLabel = "Description (Utiliser des balises HTML pour la mise en forme)";
  public static readonly eventImageLabel = "URL de l'image";
  public static readonly eventStartLabel = "Date de début (mm/dd/yyyy)";
  public static readonly eventEndLabel = "Date de fin (mm/dd/yyyy)";
  public static readonly eventStartTimeLabel = "Heure de début (HH:mm)";
  public static readonly eventEndTimeLabel = "Heure de fin (HH:mm)";
  public static readonly eventLocationLabel = "Lieu";
  public static readonly eventPriceLabel = "PAF";
  public static readonly eventTitleTooShortError = "Titre trop court";
  public static readonly eventDescriptionError = "";
  public static readonly eventImageError = "";
  public static readonly eventStartError = "Date de début requise";
  public static readonly eventEndError = "Date de fin requise";
  public static readonly eventStartTimeError = "Heure de début requise";
  public static readonly eventEndTimeError = "Heure de fin requise";
  public static readonly eventLocationError = "Lieu requis";
  public static readonly eventPriceError = "Prix requis";
  public static readonly eventStart = "Début : {0}";
  public static readonly eventEnd = "Fin : {0}";
  public static readonly eventLocation = "Lieu : {0}";
  public static readonly eventPrice = "PAF : {0}";
  public static readonly free = "Gratuit";

  // Actus
  public static readonly actus = "Actualités";
  public static readonly noActu = "Aucun article, pour le moment ;)";
  public static readonly addActuLabel = "Créer un nouvel article";
  public static readonly confirmActuDeleteLabel = "Supprimer";
  public static readonly confirmActuDeleteInfo = "Tu es sur le point de supprimer l'article<br>\"{0}\".<br>En es-tu sûr ?";

  public static readonly actuIdLabel = "ID";
  public static readonly actuTitleLabel = "Titre";
  public static readonly actuDescriptionLabel = "Description (Utiliser des balises HTML pour la mise en forme)";
  public static readonly actuImageLabel = "URL de l'image";
  public static readonly actuDateLabel = "Date";
  public static readonly actuAuthorLabel = "Auteur";
  public static readonly actuTitleTooShortError = "Titre trop court";
  public static readonly actuDescriptionError = "";
  public static readonly actuImageError = "";
  public static readonly actuDateError = "Date requise";
  public static readonly actuAuthorError = "Auteur requis";
  public static readonly actuDate = "Date : {0}";
  public static readonly actuAuthor = "Auteur : {0}";

  // Cafet
  public static readonly troll = "T'ES EN NEGATIF !!<br><small>(*non contractuel, t'as pas encore de compte)</small>";
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
  public static readonly negativeCreditError = "T'ES EN NEGATIF !!<br><small>Tu devrais mettre de l'argent sur ton compte</small>";
  public static readonly cafetAccountsLabel = "Comptes";
  public static readonly printAccountsToPdf = "Imprimer les comptes";
  public static readonly leaveAccountsToPdfPreview = "Quitter l'aperçu";
  public static readonly saveAccountsToPdf = "Enregistrer les comptes";
  public static readonly cafetAccountsMatch = "{0} compte existe déjà";
  public static readonly confirmExteCafetAccount = "Créer le compte quand même";
  public static readonly cafetArchivesLabel = "Archives";
  public static readonly cafetAccountCreationDateLabel = "Création du compte";
  public static readonly transactionDateLabel = "Date";
  public static readonly transactionValueLabel = "Montant";
  public static readonly achiveCafetUserButtonLabel = "Archiver";
  public static readonly restoreCafetUserButtonLabel = "Restaurer";
  public static readonly deleteCafetUserButtonLabel = "Supprimer";
  public static readonly deleteCafetUserWarning = "Le compte de {0} va être définitivement supprimé.";

  // Calendar
  public static readonly calSettingsRessourcesLabel = "Ressources ADE";
  public static readonly calSettingsRessourcesError = "ex: '1234,5678,1479'";
  public static readonly calSettingsTitle = "Paramètres du calendrier";
  public static readonly noCalEvent = "Rien de prévu";

}
