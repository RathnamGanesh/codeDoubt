// path APIs

app.post('/players/', async (request, response) => {
  const playerDetails = request.body

  const {player_id, player_name, jerseyNumber, role} = playerDetails

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
