const express = require('express');
const router = express.Router();

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
  }
]

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ title: 'Express' });
});

router.get('/bingo', (req, res) => {
  res.json({bingos: [
    {id: '1', name:'partiledere'}
  ]});
});

router.get('/bingo/:id', (req, res) => {
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
    rows[2][2] = {
      text: `${freeSpace} (free space)`,
      chosen: true
    };
  res.json({
    rows
  });
});

module.exports = router;
