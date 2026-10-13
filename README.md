# Sito Circoletto FASF

Sito statico (HTML/CSS/JS puri, nessuna build, nessuna dipendenza da installare) per il Circoletto FASF di Borgo Trevi e la sua festa annuale Sant'Egidio in Festa.

## Struttura

```
25_Sito_Web_CircolettoFASF/
├── index.html                    Home
├── chi-siamo.html                Storia del circolo + intervista al presidente
├── spazi.html                    Il parco: planimetria interattiva e aree
├── sant-egidio-in-festa.html     Programma completo 2026 + mappa
├── galleria.html                 Foto reali per tutte le 10 serate + link alle gallery Lightroom
├── calendario.html               Appuntamenti FASF durante l'anno
├── prenotazioni.html             Eventi su prenotazione (letti da assets/data/eventi.json)
├── sponsor.html                  Sponsor della festa
├── contatti.html                 Form di contatto + crediti
├── gestione-eventi.html          Dashboard nascosta (non linkata, noindex) per creare/modificare/eliminare eventi
├── grazie-prenotazione.html      Pagina di conferma dopo una prenotazione
├── 404.html                      Pagina "non trovata"
├── robots.txt, sitemap.xml       Per i motori di ricerca
├── netlify.toml                  Configurazione Netlify (cartella funzioni, intestazioni)
├── netlify/functions/manage-events.js   Funzione che salva gli eventi della dashboard su GitHub
└── assets/
    ├── css/style.css
    ├── js/main.js
    ├── data/eventi.json          Elenco eventi prenotabili (scritto dalla dashboard)
    └── img/
        ├── galleria/thumbs/      160 miniature (~640px, per la griglia)
        ├── galleria/full/        160 foto a risoluzione maggiore (~1600px, aperte al click)
        ├── sponsor/              loghi sponsor
        └── ...                   loghi ufficiali (logo-cf-sm/md = versioni leggere), hero, planimetria
```

## Come funziona la pubblicazione

Il sito è su **Netlify** (https://circolettofasf.netlify.app) collegato al repository GitHub `alessiocipicciani07/sitoFASF`: ogni `git push` su `main` ripubblica il sito in automatico, senza nessuna build. Anche la dashboard eventi lavora così: salva su GitHub e Netlify ripubblica.

In locale basta avviare un piccolo server nella cartella (`python3 -m http.server`) e aprire `http://localhost:8000`: la lettura degli eventi (`fetch`) non funziona aprendo il file con doppio click.

## Form (Netlify Forms)

- **Prenotazioni** (`prenotazioni.html`, form `prenotazioni`) e **Contatti** (`contatti.html`, form `contatti`) arrivano nella dashboard di Netlify → *Forms*. Per riceverli anche via email: Netlify → *Forms* → *Form notifications* → *Add notification* → *Email notification*.
- Il dominio `circolettofasf.netlify.app` compare in `canonical`, `og:url`, `og:image`, `robots.txt` e `sitemap.xml`. Se in futuro si collega un dominio proprio, va sostituito in quei file (cerca e sostituisci).

## Da completare / tenere aggiornato

1. **Calendario eventi FASF** (`calendario.html`) — contiene solo Sant'Egidio in Festa 2026. Aggiungi gli altri appuntamenti dell'anno quando li pianificate.
2. **Edizione 2026 conclusa** — le date "28 agosto — 6 settembre 2026" compaiono in home, nel menu, nelle meta description e nella pagina del programma; vanno riviste in vista della prossima edizione.

## Contenuti reali già usati

- I 3 loghi ufficiali (estratti dal PDF logo pack): logo evento oro/nero, monogramma "CF" (il logo del circolo), logo "FASF Borgo Trevi" con le mani (non usato come logo del circolo, su richiesta).
- Palette colori (blu notte + oro) presa dalla locandina ufficiale e dal materiale Instagram.
- Programma completo delle 10 serate 2026, dalla locandina ufficiale.
- Indirizzo e orari del ristorante/piadineria, dalla locandina e dal profilo Instagram @fasf.borgotrevi.
- Planimetria del parco (versione ottimizzata per il web).
- Foto reali del merch FASF nella home e in "Chi siamo".
- Citazioni autentiche del presidente, trascritte dall'intervista video (C0296.MP4).
- **160 foto reali in galleria** (16 per serata, tutte le 10 serate della festa), scelte automaticamente dalle gallery Lightroom del fotografo: distribuite lungo la serata e filtrate per punteggio estetico più alto (dato calcolato da Adobe su ogni scatto). Ogni serata linka alla propria gallery Lightroom completa per chi vuole vedere tutti gli scatti.
- Nome completo della fotografa (Ilaria Damiani) nei crediti, trovato nel titolo di una delle gallery Lightroom.

## Modificare i testi

Non c'è un CMS: i testi sono scritti direttamente nell'HTML di ogni pagina. Per cambiare un testo, apri il file `.html` della pagina con un editor di testo e modifica il contenuto tra i tag (es. `<p>...</p>`).
