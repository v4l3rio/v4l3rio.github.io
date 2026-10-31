# Modificare sito e curriculum

Devi modificare soltanto questi due file:

- [Italiano: public/content/cv-it.json](public/content/cv-it.json)
- [Inglese: public/content/cv-en.json](public/content/cv-en.json)

Sono già compilati con i contenuti del sito attuale. Le due lingue sono indipendenti: se vuoi aggiornare entrambe, modifica entrambi i file. La traduzione non è automatica.

## Pubblicare una modifica da GitHub

1. Apri il file della lingua interessata nel repository `v4l3rio/v4l3rio.github.io`, sul ramo `master`.
2. Premi la matita **Edit this file**.
3. Cambia i testi tra virgolette o aggiungi/rimuovi gli elementi delle liste.
4. Premi **Commit changes** e salva sul ramo `master`.
5. Attendi che il controllo **Deploy portfolio to GitHub Pages** sia verde nella scheda **Actions**. Normalmente richiede circa un minuto.
6. Ricarica il sito. Puoi verificare il risultato premendo **Scarica il CV**.

La pubblicazione aggiorna sito, JSON pubblici e PDF accessibili tramite link diretto. Non devi caricare un nuovo PDF. Salvare il file soltanto sul computer non modifica il sito pubblico: devi pubblicare la modifica su GitHub.

Se il JSON contiene un errore, il controllo indica il file e il campo da correggere. La versione pubblicata in precedenza resta online finché una nuova pubblicazione non riesce.

## Dove si trovano le informazioni

| Campo | Cosa puoi modificare |
| --- | --- |
| `person` | Nome, ruolo, telefono, email, link GitHub, LinkedIn e sito. Il telefono compare nel PDF. |
| `profile` | Paragrafi della presentazione, condivisi da sito e PDF. Ogni stringa è un paragrafo. |
| `experience` | Esperienze: azienda, ruolo, periodo e lista delle attività. |
| `skills` | Gruppi di competenze: etichetta e contenuto. |
| `projects` | Progetti: nome, tecnologie, categoria, descrizione, nota e collegamenti. |
| `archive` | Progetti precedenti nell'elenco espandibile del sito. |
| `credentials` | Certificazioni e corsi, ente, periodo, collegamento e ID eventuale. |
| `education.date` | Periodo della formazione. |
| `text` | Titoli, pulsanti, località, disponibilità, corso di laurea, università, voto, lingue, interessi e piè di pagina del sito. |
| `metadata` | Titolo della scheda del browser e descrizioni per motori di ricerca e condivisione. |
| `pdf` | Nome del file scaricato, titoli delle sezioni e inclusione di interessi/progetti precedenti. |

Alcune etichette, come `text.home` e `text.footer`, contengono il nome attuale: se cambi identità, aggiorna anche queste frasi e i metadati. Ogni testo è esplicito nel JSON.

## Esempio: cambiare la presentazione

```json
"profile": [
  "Questo è il primo paragrafo della mia presentazione.",
  "Questo è il secondo paragrafo."
]
```

Puoi aggiungere o togliere paragrafi. La modifica compare anche nel PDF.

## Esempio: aggiungere una competenza

Nella lista `skills`, aggiungi un oggetto come questo:

```json
{
  "id": "nuova-categoria",
  "label": "Nuova categoria",
  "value": "Tecnologia A, Tecnologia B.",
  "wide": false
}
```

`id` deve essere diverso da quelli delle altre competenze. `wide: true` occupa l'intera riga sul sito desktop; non cambia il testo del PDF. L'ordine della lista determina l'ordine visualizzato.

Lo stesso principio vale per `experience`, `projects` e `credentials`: copia un oggetto esistente, modifica i campi e mantieni le virgole tra gli elementi. Puoi anche eliminare elementi. Le liste possono essere vuote.

Per una certificazione in preparazione usa `inPreparation: true`. Quando è ottenuta, rimuovi questo campo o imposta `false`, aggiorna `date` e aggiungi l'eventuale `url`. `credentialId` è facoltativo.

## PDF dinamico

Con JavaScript attivo, il pulsante scarica il JSON aggiornato della lingua scelta e compila il PDF al momento, sul computer di chi visita il sito. Il pulsante mostra un breve messaggio durante la preparazione. I dati non vengono inviati a servizi esterni.

Il PDF usa presentazione, formazione, esperienze, competenze, progetti, certificazioni e lingue dello stesso JSON. Per includere anche gli interessi o i progetti precedenti, imposta `pdf.includeInterests` o `pdf.includeArchive` su `true`. Questi campi sono inizialmente `false`, come nel CV precedente.

L'impaginazione di base è su due pagine. Se aggiungi molti contenuti, il documento aggiunge pagine automaticamente. Evita di inserire a capo manuali per far combaciare le righe.

La copia PDF disponibile tramite URL diretto, o senza JavaScript, viene rigenerata ad ogni pubblicazione dagli stessi JSON. Non modificarla a mano.

## Regole del formato JSON

- Usa virgolette doppie per chiavi e testi.
- Se nel testo servono virgolette doppie, scrivile come `\"`.
- Metti una virgola tra gli elementi, mai dopo l'ultimo.
- Non inserire commenti nel JSON.
- Mantieni `language` uguale a `it` o `en`, secondo il file.
- Mantieni il nome del PDF in `pdf.filename` con lettere, numeri, trattini o underscore e l'estensione `.pdf`.
- I collegamenti devono iniziare con `https://` o `http://`; l'email va scritta senza `mailto:`.
- Non eliminare i nomi dei campi obbligatori. Lo schema `resume.schema.json` aiuta gli editor compatibili a individuare gli errori.

## Modifiche dal computer

Nella cartella del sito:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Modifica i due JSON e salva. Per verificare anche i PDF di riserva e la versione senza JavaScript:

```sh
pnpm build
pnpm preview
```

`pnpm test` controlla la pagina, i download e l'aggiornamento dinamico dei contenuti. Dopo la verifica, salva e pubblica le modifiche nel repository GitHub per aggiornare il sito online.
