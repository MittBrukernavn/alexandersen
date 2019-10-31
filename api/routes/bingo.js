const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');

const connect = () => {
  const { DB_HOST, BINGO_DB_NAME, DB_USER, DB_PASS } = process.env;
  return mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: BINGO_DB_NAME
  });
}

const connectPool = () => {
  const { DB_HOST, BINGO_DB_NAME, DB_USER, DB_PASS } = process.env;
  return mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: BINGO_DB_NAME
  });
}


router.get('/', async (_, res) => {
  const connection = await connect();
  const response = await connection.query('SELECT ID as id, Name as name from Bingos');
  res.json({bingos: response[0]});
  connection.end();
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const pool = await connectPool();
  
  const [ bingoRes, promptsRes ] = await Promise.all([
    pool.query('SELECT Description as description, FreeSpace as freeSpace FROM Bingos WHERE ID=?', [id]),
    pool.query('SELECT PromptText as text FROM Prompts WHERE BingoID=? ORDER BY RAND() LIMIT 25', [id])
  ]);
  pool.end();
  if (bingoRes[0].length === 0) {
    res.status(404).json({error:'No such bingo'});
    return;
  }
  const { freeSpace, description } = bingoRes[0][0];
  const allPrompts = promptsRes[0];
  if(allPrompts.length < 25) {

  }
  const rows = [];
    for(let i = 0; i < 25; i+=5) {
      const row = [];
      for(let j = 0; j < 5; j++) {
        row.push({
          text: allPrompts[i + j].text,
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
    description,
    rows
  });
});

router.post('/', async (req, res) => {
  const { name, freeSpace, description, allPrompts, token } = req.body;
  try {
    const { JWT_KEY } = process.env;
    jwt.verify(token, JWT_KEY)
  } catch (error) {
    res.status(401).json({error:'Unauthorized'});
    return;
  }
  const connection = await connectPool();
  const insertRes = await connection.query('INSERT INTO Bingos(Name, FreeSpace, Description) VALUES (?,?,?)', [name,freeSpace,description]);
  console.log('Insert res:')
  console.log(insertRes);
  const id = insertRes[0].insertId;
  const newEntries = allPrompts.map(_=>`(${id}, ?)`);
  const entryString = newEntries.join(',');
  const newRes = await connection.query(`INSERT INTO Prompts(BingoID, PromptText) VALUES ${entryString}`, allPrompts);
  connection.end();
  res.status(200).json({status:'ok'});
});

module.exports = router;
