# Sito Circoletto FASF

Sito statico (HTML/CSS/JS puri, nessuna build, nessuna dipendenza da installare) per il Circoletto FASF di Borgo Trevi e la sua festa annuale Sant'Egidio in Festa.

## Struttura

```
25_Sito_Web_CircolettoFASF/
├── index.html                   Home — Circoletto FASF
├── chi-siamo.html                Storia del circolo + intervista al presidente
├── spazi.html                    Il parco: planimetria e aree
├── sant-egidio-in-festa.html     Programma completo 2026 + mappa
├── galleria.html                 Foto reali per tutte le 10 serate (28/08 → 06/09) + link a ogni gallery Lightroom completa
├── calendario.html               Appuntamenti FASF durante l'anno
├── sponsor.html                  Sponsor della festa (placeholder)
├── contatti.html                 Form di contatto + crediti
└── assets/
    ├── css/style.css
    ├── js/main.js
    └── img/
        ├── galleria/thumbs/      160 miniature (16 per serata × 10 serate, ~640px, per la griglia)
        ├── galleria/full/        160 foto a risoluzione maggiore (~1600px, aperte al click)
        └── ...                   loghi ufficiali, planimetria, foto
```

## Come vederlo

Basta aprire `index.html` in un browser (doppio click). Non serve un server: tutti i link sono relativi e le immagini sono locali.

## Come pubblicarlo online

È un sito statico: si può caricare così com'è su qualsiasi hosting statico gratuito, ad esempio:
- **Netlify** o **Vercel**: trascina la cartella nella dashboard
- **GitHub Pages**: metti questi file in un repository e attiva Pages
- Qualsiasi hosting condiviso classico (basta caricare via FTP)

## Cosa va ancora completato prima di andare online

1. **Sponsor** (`sponsor.html`) — i riquadri "Logo sponsor" sono placeholder da sostituire con i loghi reali (istruzioni in un commento HTML nel file). Non ho inserito nomi specifici perché non avevo conferma di quali sponsor 2026 fossero già confermati.
2. **Email di contatto** (`contatti.html`) — il modulo apre attualmente un'email a `info@circolettofasf.it`, un indirizzo segnaposto. Cercalo nel file (`mailto:info@circolettofasf.it`) e sostituiscilo con l'indirizzo email reale del circolo.
3. **Calendario eventi FASF** (`calendario.html`) — contiene solo Sant'Egidio in Festa 2026, l'unico evento con date confermate. Aggiungi qui gli altri appuntamenti dell'anno quando li pianificate.

La galleria fotografica è completa: tutte le 10 serate sono a posto.

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
