const express = require('express')
const path = require('path')

const {open} = require('sqlite')

const sqlite3 = require('sqlite3')

const app = express()
app.use(express.json())

const dbpath = path.join(__dirname, 'cricketTeam.db')

let db = null

const intializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })

    app.listen(3001, () => {
      console.log('Server is running at http://localhost:3001')
    })
  } catch (e) {
    console.log(`DB Error :${e.message}`)
    process.exit(1)
  }
}

intializeDBAndServer()

app.get('/players/', async (request, response) => {
  const getPlayerQuary = `
  SELECT * FROM 
  cricket_team 
  ORDER BY
   player_id; `

  const playerList = await db.all(getPlayerQuary)

  const ans = playerList.map(player => {
    return {
      playerId: player.player_id,
      playerName: player.player_name,
      jerseyNumber: player.jersey_number,
      role: player.role,
    }
  })

  response.send(ans)
})
// path APIs

app.post('/players/', async (request, response) => {
  const playerDetails = request.body

  const {player_name, jerseyNumber, role} = playerDetails

  const addPlayer = `INSERT INTO cricket_team (player_id , player_name , jerseyNumber, role)
  
  VALUES (
    ${player_name},
    ${jerseyNumber},
    ${role}
  );`

  await db.run(addPlayer)
  response.send('Player Added to Team')
})

// Get Palyet API

app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const player = `SELECT * FROM cricket_team WHERE playerId = ${playerId}`
  const playerRequired = await db.get(player)

  response.send(playerRequired)
})

app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerDetails = request.body

  const {player_name, jerseyNumber, role} = playerDetails

  const playerQuary = `UPDATE cricket_team 
  SET 
  playerId = ${playerId},
  player_name = ${player_name},
  jerseyNumber = ${jerseyNumber},
  role = ${role};`

  await db.run(playerQuary)
  response.send('Player Details Updated')
})

app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params

  const playerQuary = `DELETE FROM cricket_team 
  WHERE playerId = ${playerId}`

  await db.run(playerQuary)

  response.send('Player Removed')
})

module.exports = app
