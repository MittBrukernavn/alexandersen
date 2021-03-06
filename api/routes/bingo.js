const express = require('express');

const router = express.Router();

const { connect, connectPool } = require('../db/connections');

const { adminOnly } = require('../middlewares/index');

router.get('/', async (_req, res) => {
  const connection = await connect();
  const response = await connection.query('SELECT ID as id, Name as name from Bingos');
  res.json({ bingos: response[0] });
  connection.end();
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await connectPool();
    const [bingoRes, promptsRes] = await Promise.all([
      pool.query('SELECT Description as description, FreeSpace as freeSpace FROM Bingos WHERE ID=?', [id]),
      pool.query('SELECT PromptText as text FROM Prompts WHERE BingoID=? ORDER BY RAND() LIMIT 25', [id]),
    ]);
    pool.end();
    if (bingoRes[0].length === 0) {
      res.status(404).json({ error: 'No such bingo' });
      return;
    }
    const { freeSpace, description } = bingoRes[0][0];
    const allPrompts = promptsRes[0];
    let n = 5;
    if (allPrompts.length < 25) {
      n = Math.floor(Math.sqrt(allPrompts.length));
    }
    const rows = [];
    for (let i = 0; i < n * n; i += n) {
      const row = [];
      for (let j = 0; j < n; j++) {
        row.push({
          text: allPrompts[i + j].text,
          chosen: false,
          bingo: false,
        });
      }
      rows.push(row);
    }
    if (freeSpace) {
      rows[Math.floor(n / 2)][Math.floor(n / 2)] = {
        text: `${freeSpace} (free space)`,
        chosen: true,
        bingo: false,
      };
    }
    res.json({
      description,
      rows,
    });
  } catch (err) {
    res.sendStatus(500);
  }
});

router.put('/:id/request', async (req, res) => {
  const { id } = req.params;
  const { prompt } = req.body;
  try {
    const connection = await connect();
    const response = await connection.query('INSERT INTO Request(BingoID, PromptText) VALUES (?,?)', [id, prompt]);
    const { insertId } = response[0];
    connection.end();
    if (insertId) {
      res.json({ status: 'ok' });
    } else {
      res.status(500).json({
        status: 'Failed',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'Failed',
    });
  }
});

// here and down is admin functionality

router.use(adminOnly);

// add a new bingo board, with a name, optional free space, description, and list of prompts

router.put('/', async (req, res) => {
  const {
    name, freeSpace, description, allPrompts,
  } = req.body;
  try {
    const connection = await connectPool();
    const insertRes = await connection.query('INSERT INTO Bingos(Name, FreeSpace, Description) VALUES (?,?,?)', [name, freeSpace, description]);
    const id = insertRes[0].insertId;
    const newEntries = allPrompts.map((_) => `(${id}, ?)`);
    const entryString = newEntries.join(',');
    await connection.query(`INSERT INTO Prompts(BingoID, PromptText) VALUES ${entryString}`, allPrompts);
    connection.end();
    res.status(200).json({ status: 'ok' });
  } catch (err) {
    res.sendStatus(500);
  }
});

router.get('/:id/prompts', async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await connect();
    // no need for rows
    const [allPrompts] = await connection.query('SELECT ID as id, PromptText AS text FROM Prompts WHERE BingoID=?', [id]);
    connection.end();
    res.json({
      allPrompts,
    });
  } catch (_) {
    res.sendStatus(500);
  }
});

router.put('/:id/prompts', async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  try {
    const connection = await connect();
    const response = await connection.query('INSERT INTO Prompts(BingoID, PromptText) VALUES (?,?)', [id, text]);
    connection.end();

    res.json({
      status: 'ok',
      newId: response[0].insertId,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/prompts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await connect();
    connection.query('DELETE FROM Prompts WHERE ID=?', [id]);
    connection.end();
    res.json({ status: 'ok' });
  } catch (err) {
    res.sendStatus(500);
  }
});

router.post('/reviewRequests', async (req, res) => {
  try {
    const connection = await connect();
    const [response] = await connection.query('SELECT Bingos.Name AS bingoName, Request.ID AS id, Request.PromptText AS promptText FROM Bingos INNER JOIN Request ON Bingos.ID=Request.BingoID');
    connection.end();
    res.json({ status: 'ok', requests: response });
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
});

router.post('/approveRequest/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await connect();
    const [prompt] = await connection.query('SELECT PromptText, BingoID FROM Request WHERE ID=?', [id]);
    const { PromptText, BingoID } = prompt[0];
    await Promise.all([
      connection.query('DELETE FROM Request WHERE ID=?', [id]),
      connection.query('INSERT INTO Prompts (BingoID, PromptText) VALUES (?, ?)', [BingoID, PromptText]),
    ]);
    connection.end();
    res.json({ status: 'ok' });
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
    console.log(error);
  }
});


router.post('/deleteRequest/:id', async (req, res) => {
  const connection = await connect();
  connection.query('DELETE FROM Request WHERE ID=?', [id]);
  connection.end();
  res.json({ status: 'ok' });
});

router.get('/backup', async (_req, res) => {
  res.status(500).json({
    error: 'Not implemented',
  });
});

router.put('/backup', async (req, res) => {
  const { data } = req.body;
  res.json(data);
});


module.exports = router;
