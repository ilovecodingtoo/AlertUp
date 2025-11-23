import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { LocationService } from './services/location.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PushService } from './services/push.service';
import { StatusService } from './services/status.service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, MatDialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  currentOnboardingIndex = 0;
  onboardingCompleted = false;
  sidebarOpen = false;
  darkModeOn = false;
  termsAccepted = false;
  readonly dialog = inject(MatDialog);

  constructor(private router: Router, private auth: AuthService, private location: LocationService, private push: PushService, public status: StatusService) {}

  ngOnInit() {
    this.loadOnboardingStatus();
    this.loadTermsAgreement();
    this.loadTheme();
    this.auth.loadToken();
    this.location.loadLocationAccessPermission();
    this.push.loadLPushNotificationsPermission();
    if(this.onboardingCompleted && !this.termsAccepted) this.openDialog();
  }

  private loadOnboardingStatus() {
    const storedOnboardingCompleted = localStorage.getItem('onboardingCompleted');
    if(storedOnboardingCompleted) this.onboardingCompleted = true;
  }

  private loadTermsAgreement() {
    const storedTermsAccepted = localStorage.getItem('termsAccepted');
    if(storedTermsAccepted) this.termsAccepted = true;
  }

  private loadTheme() {
    const storedDarkModeOn = localStorage.getItem('darkModeOn');
    if(!storedDarkModeOn) localStorage.setItem('darkModeOn', JSON.stringify(false));
    else this.darkModeOn = JSON.parse(storedDarkModeOn);
  }

  completeOnboarding() {
    this.onboardingCompleted = true;
    localStorage.setItem('onboardingCompleted', JSON.stringify(true));
    this.openDialog();
  }

  private openDialog() {
    const dialog = this.dialog.open(TermsComponent, { height:'55vh' });
    dialog.afterClosed().subscribe(() => { this.loadTermsAgreement(); });
  }

  toggleTheme() {
    this.darkModeOn = !this.darkModeOn;
    localStorage.setItem('darkModeOn', JSON.stringify(this.darkModeOn));
  }

  toggleSidebar() { this.sidebarOpen = !this.sidebarOpen; }

  userLoggedIn() { return this.auth.userLoggedIn(); }

  goToMaps() {
    this.toggleSidebar();
    this.router.navigate(['/']);
  }

  goToLogin() {
    this.toggleSidebar();
    this.router.navigate(['/login']);
  }

  goToAlertForm() {
    this.toggleSidebar();
    this.router.navigate(['/alert-form']);
  }

  goToLogout() {
    this.toggleSidebar();
    this.auth.logout();
    this.status.setMessage('Disconnessione effettuata', true);
    this.router.navigate(['/']);
  }

  goToAboutUs() {
    this.toggleSidebar();
    this.router.navigate(['/about-us']);
  }

  goToGeneralSettings() {
    this.toggleSidebar();
    this.router.navigate(['/general-settings']);
  }

  onboardingNext() { ++this.currentOnboardingIndex; }
}


@Component({
  selector: 'app-dialog',
  template: `
    <h2 mat-dialog-title style="font-weight: bold;">Termini e Condizioni</h2>
    <mat-dialog-content class="mat-typography">
      <div style="text-align: left;">
        <strong>Informativa sulla Privacy</strong><br>
        <small>
          <p>
            <u>Ultimo aggiornamento:</u> 16/11/2025<br>
            <u>Sviluppatore:</u> DSH<br>
            <u>Email per la privacy:</u> 890913&#64;stud.unive.it<br><br>
            Benvenuto in AlertUp, l'applicazione dedicata alle segnalazioni di eventi climatici. La tua privacy è una nostra priorità assoluta.
            Questa informativa spiega come raccogliamo, utilizziamo e proteggiamo i tuoi dati personali quando utilizzi la nostra app.
          </p>
          <ol>
            <li><u>Titolare del Trattamento</u></li>
            Il titolare del trattamento dei dati è DSH, con sede in Via Torino 155, 30170 Mestre, Venezia VE, contattabile all'indirizzo email 890913&#64;stud.unive.it.
            <br><br>
            <li><u>Dati che Raccogliamo e Perché</u></li>
            Raccogliamo solo i dati strettamente necessari per fornirti le funzionalità principali di AlertUp:
            <ul>
              <li><em>Dati di Registrazione:</em> Email, nickname e password criptata. Finalità del trattamento: creare e gestire il tuo account personale, autenticarti in modo sicuro nell'app. Base giuridica: esecuzione di un contratto (Art. 6(1)(b) GDPR).</li>
              <li><em>Dati di Segnalazione:</em> Posizione GPS precisa al momento della segnalazione e testo descrittivo. Finalità del trattamento: pubblicare la segnalazione sulla mappa per condividerla con la comunità. Pubblicherai questi dati volontariamente. Base giuridica: consenso esplicito (Art. 6(1)(a) GDPR).</li>
              <li><em>Posizioni Salvate ("I miei luoghi"):</em> Nome del luogo e coordinate geografiche. Finalità del trattamento: invio di notifiche push personalizzate solo se viene fatta una segnalazione vicino a una delle tue posizioni salvate. Attiverai tu questa funzione. Base giuridica: consenso esplicito (Art. 6(1)(a) GDPR).</li>
              <li><em>Token per Notifiche Push:</em> Un identificativo del tuo dispositivo. Finalità del trattamento: invio di notifiche push relative alle tue posizioni salvate. Attiverai tu questa funzione. Base giuridica: consenso esplicito (Art. 6(1)(a) GDPR).</li>
              <li><em>Preferenze App:</em> Impostazioni come "darkModeOn". Finalità del trattamento: migliorare la tua esperienza utente personalizzando l'interfaccia.	Base giuridica: legittimo interesse per fornire un servizio personalizzato (Art. 6(1)(f) GDPR).</li>
            </ul>
            <br>
            <li><u>Come Proteggiamo i Tuoi Dati</u></li>
            La sicurezza dei tuoi dati è fondamentale per noi.
            <ul>
              <li><em>Archiviazione Locale e Sicura:</em> Tutti i dati personali sono memorizzati su server di nostra proprietà e in nostro esclusivo controllo, situati nell'Unione Europea. Non utilizziamo server di terze parti per l'archiviazione dei dati principali.</li>
              <li><em>Autenticazione Sicura:</em> Utilizziamo il protocollo JSON Web Token per le sessioni di login. Il token JWT viene memorizzato in modo sicuro nell'archivio protetto del tuo dispositivo per prevenire furti.</li>
              <li><em>Misure Tecniche Organizzative:</em> Adottiamo misure di sicurezza avanzate, inclusa la cifratura dei dati in transito e, ove possibile, dei dati in archivio, per proteggere i tuoi dati da accessi non autorizzati, divulgazione, alterazione o distruzione.</li>
            </ul>
            <br>
            <li><u>Condivisione dei Dati</u></li>
            Non vendiamo né cediamo i tuoi dati personali a terze parti per scopo di marketing. Condividiamo i dati solo nelle seguenti circostanze limitate:
            <ul>
              <li><em>Con gli Altri Utenti:</em> Le tue segnalazioni sono pubbliche e visibili a tutti gli utenti dell'app. Il tuo nickname è l'unico identificativo mostrato.</li>
              <li><em>Con Fornitori di Servizi:</em> Ci avvaliamo di fornitori di servizi terzi di fiducia ("Responsabili del Trattamento") che ci supportano nell'operatività (ad esempio, servizi di notifica push). Questi soggetti sono vincolati da contratti che impediscono loro di utilizzare i tuoi dati per qualsiasi altro scopo.</li>
            </ul>
            <br>
            <li><u>I Tuoi Diritti (Diritti GDPR)</u></li>
            In conformità al Regolamento Europeo GDPR, hai i seguenti diritti:
            <ul>
              <li><em>Accesso e Portabilità:</em> Puoi richiedere una copia di tutti i dati che ti riguardano.</li>
              <li><em>Rettifica:</em> Puoi modificare le tue credenziali direttamente dall'app.</li>
              <li><em>Diritto all'Oblio:</em> Puoi eliminare permanentemente il tuo account e tutti i dati associati dalle impostazioni dell'app, ad eccezione di quelli che siamo tenuti a conservare per obblighi di legge.</li>
              <li><em>Revoca del Consenso:</em> Puoi revocare il consenso per le notifiche push o per la geolocalizzazione in qualsiasi momento dalle impostazioni dell'app. Puoi gestire i tuoi luoghi salvati dall'interno dell'app.</li>
              <li><em>Opposizione e Limitazione:</em> Puoi opporti a determinati trattamenti.</li>
            </ul>
            Per esercitare questi diritti, contattaci a 890913&#64;stud.unive.it.
            <br><br>
            <li><u>Conservazione dei Dati</u></li>
            Conserveremo i tuoi dati personali solo per il tempo necessario a fornirti i nostri servizi.
          </ol>
        </small><br>
        <strong>Accettazione dei Termini</strong><br>
        <small>
          <p>Utilizzando l'applicazione AlertUp, accetti integralmente i presenti Termini e Condizioni.</p>
          <ol>
            <li><u>Account e Sicurezza</u></li>
            Devi avere almeno l'età minima richiesta nel tuo paese per utilizzare AlertUp.
            Sei responsabile della custodia della tua password e di tutte le attività che avvengono sotto il tuo account.
            Ti impegni a fornire informazioni di registrazione accurate e veritiere.
            <br><br>
            <li><u>Regole di Comportamento e Contenuti</u></li>
            AlertUp è una piattaforma per la sicurezza collettiva. Ti impegni a:
            <ul>
              <li><em>Pubblicare Solo Segnalazioni Veritiere:</em> Le segnalazioni devono riguardare eventi climatici reali e potenzialmente pericolosi (es. allagamenti, forti raffiche di vento, grandine, incendi). È severamente vietato diffondere allarmi ingiustificati o fake news.</li>
              <li><em>Non Pubblicare Contenuti Illeciti o Offensivi:</em> Sono vietati contenuti diffamatori, osceni, molesti o che violino la privacy altrui.</li>
              <li>Non Utilizzare l'App per Scopi Commerciali o di Spam.</li>
            </ul>
            <br>
            <li><u>Licenza d'Uso e Proprietà Intellettuale</u></li>
            Noi concediamo a te una licenza limitata, non esclusiva e revocabile per utilizzare l'app per scopi personali e non commerciali.
            Tu concedi a noi e agli altri utenti di AlertUp una licenza globale e gratuita per utilizzare, visualizzare e condividere le segnalazioni che pubblichi all'interno dell'app.
            <br><br>
            <li><u>Limitazione di Responsabilità</u></li>
            AlertUp non sostituisce in alcun modo i servizi di soccorso ufficiali, come Carabinieri, Protezione Civile o Vigili del Fuoco. In caso di pericolo imminente o critico, contatta immediatamente il 112.
            Per ulteriori informazioni riguardo i diversi tipi di emergenza climatica, visitare il sito web della Protezione Civile.
            Non garantiamo l'accuratezza, la tempestività o l'affidabilità al 100% delle segnalazioni. L'utente utilizza le informazioni a proprio rischio.
            Non siamo responsabili per interruzioni del servizio o per le azioni intraprese da altri utenti basandosi sulle segnalazioni.
            <br><br>
            <li><u>Modifiche e Legge Applicabile</u></li>
            Ci riserviamo il diritto di modificare i suddetti Termini. Le modifiche saranno comunicate tramite l'app.
          </ol>
          <br>
          I presenti Termini sono regolati e interpretati secondo la legge italiana. Per qualsiasi controversia sarà competente il Foro di Venezia.<br><br>
          Grazie per aver scelto AlertUp e per contribuire a rendere la comunità più sicura e informata.
        </small>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button class="w3-button w3-round-large w3-green" style="outline: none; border: none;" mat-dialog-close (click)="acceptTerms()">Accetto</button>
    </mat-dialog-actions>
  `,
  imports: [MatDialogModule]
})
export class TermsComponent {
  acceptTerms() { localStorage.setItem('termsAccepted', JSON.stringify(true)); }
}