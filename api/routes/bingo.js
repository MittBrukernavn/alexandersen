const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const bingos = [
  {
    freeSpace: 'noen lyver',
    allPrompts: [
      'Moxnes prøver å få en kommentar/et innlegg',
      'Partileder nevner navn på partiet sitt',
      '"Studenter"',
      '"Det grønne skiftet"',
      '"Jeg vil bare ha det sagt"',
      'Svarer ikke på spørsmålet',
      'Siv Jensen drikker vann',
      'AP går over tiden',
      'Venstre nevner noe radikalt',
      'Whataboutism',
      'Jubel fra salen etter et utspill',
      'Fredrik Solvang får noen til å si noe de ikke ville',
      'Kraftuttrykk ("Søren" e.l.)',
      'Kommunesammenslåing',
      'Metrobussen',
      'Skolemat',
      'Sentralisering',
      'Fornavn',
      'Buing fra salen',
      'Verdensnyheter blir nevnt',
      '"MEN..."',
      'Gløshaugen',
      'Pandering',
      'Avsporing',
      'Vi i partiet mener at...',
      'Venstre nevner pelsdyrnæringen',
      'Skattelette til de rikeste',
      'Bestemor på anbud',
      'MDG blander inn klima i noe helt urelatert',
      'AP/FrP sier at de er miljøpartier',
      'Jonas banner',
      'Noen danser med en panda',
      'Velferdsprofitører'
    ]
  },
  {
    freeSpace: false,
    allPrompts: ['1','2','3','4', '5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20',
    '21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40',
    '41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60',
    '61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80',
    '81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99','$$e^{i\\cdot\\pi} + 1$$'
    ]
  },
  {
    freeSpace: '$Buzzwords^{\\infty}$',
    allPrompts: [
      'Nevner søknadsfrist',
      'Onboarding-program',
      '$Utdatert$ stack',
      'Java-backend',
      'Nevner AI',
      'Nevner Blockchain',
      'Nevner Big Data',
      'Nevner upopulær kunde',
      'Nevner irrelevant statistikk',
      'Noen fra HR',
      'Bedrep gir bonger til all',
      'Generic video',
      'Drar til solsiden',
      'Personlig utvikling',
      'Snakker som om vi er 1. klassinger',
      'Bedrep har impostor syndrome',
      'Resten av bongene blir lagt igjen på bordet',
      'Godt sosialt miljø',
      'Nevner alle store frontend-rammeverk',
      'Sier noe som ikke stemmer',
      'Bilde av pilsing på taket',
      'Fritidsklubber',
      'En bedrep gikk på NTH',
      'Bedrep er gammel Onliner/Abakule',
      '$$\\displaystyle\\sum_{selskap} kompetanse = 0$$',
      'Noe som faktisk er kult'
    ]
  }
]


const bingoList = [
  {id: 1, name:'Partileder'},
  {id: 2, name:'Helt Vanlig'},
  {id: 3, name:'Bedpres/kurs'}
];

router.get('/', (req, res) => {
  res.json({bingos: bingoList});
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  if (id > bingos.length) {
    res.status(404);
    return;
  }
  const index = id-1;
  const { allPrompts, freeSpace } = bingos[index];
  // deep copy of the prompts
  const promptsCopy = [...allPrompts];
  for(let i = promptsCopy.length - 1; i >= 0; i--) {
    let j = Math.floor(Math.random()*(i+1));
    let c = promptsCopy[i];
    promptsCopy[i] = promptsCopy[j];
    promptsCopy[j] = c;
  }
  const rows = [];
    for(let i = 0; i < 5; i++) {
      const row = [];
      for(let j = 0; j < 5; j++) {
        row.push({
          text: promptsCopy[5*i + j],
          chosen: false
        });
      }
      rows.push(row);
    }
    if(freeSpace) {
      rows[2][2] = {
        text: `${freeSpace} (free space)`,
        chosen: true
      };
    }
  res.json({
    rows
  });
});

router.post('/', async (req, res) => {
  const { name, freeSpace, allPrompts, token } = req.body;
  try {
    const { JWT_KEY } = process.env;
    jwt.verify(token, JWT_KEY)
  } catch (error) {
    res.status(401).json({error:'Unauthorized'});
    return;
  }
  const newBingo = { freeSpace, allPrompts };
  const id = bingoList.length+1;
  bingos.push(newBingo);
  bingoList.push({id, name});
  res.status(200).end();
});

module.exports = router;
