const express = require("express");
const app = express();
const pg = require("pg");
const client = new pg.Client("postgres://localhost/music_db");
app.get('/', async(req,res, next)=>{

        try{
            const response = await client.query('SELECT * FROM "Artists";');
            const artists = response.rows;
            res.send(`
            <html>
                <head>
                </head>
                <body>
                    <h1>Music</h1>
                    <h2>Artists</h2>
                    <ul>
                        ${
                            artists.map(artist => `
                                <li>
                                    <a href='/artists/${artists.id}'>
                                    ${artist.name}
                                    </a>
                                </li>    
                            `).join('')
                        }
            </html>
            `);
        }
        catch(ex){
            next(ex);
        }

});
app.get('/albums/:id', async(req,res, next)=>{


});
// app.get('/albums/:id', (req,res)=>{
//     const album = albums.find(album => album.id === parseInt(req.params.id));
//     const html = `<div><a href='/'>${album.genre}</a></div>`;
//     if (!album) res.status(404).send('The album with the given ID was not found');
//     res.send(html);
// });

// //set environment var
// const port = process.env.PORT || 3000;
// app.listen(port, () => console.log(`Listening on port ${port}...`));
//set environment var
const port = process.env.PORT || 3000;
const syncAndSeed = async () => {
  const SQL = `
    DROP TABLE IF EXISTS "Songs";
    DROP TABLE IF EXISTS "Albums";
    DROP TABLE IF EXISTS "Artists";
    CREATE TABLE "Artists"(
        id INTEGER PRIMARY KEY,
        name VARCHAR(40) NOT NULL
    );
    CREATE TABLE "Albums"(
        id INTEGER PRIMARY KEY,
        name VARCHAR(40) NOT NULL,
        artist INTEGER NOT NULL,
        FOREIGN KEY(artist) REFERENCES "Artists"(id)
    );
    CREATE TABLE "Songs"(
        id INTEGER PRIMARY KEY,
        name VARCHAR(40) NOT NULL,
        album INTEGER NOT NULL,
        FOREIGN KEY(album) REFERENCES "Albums"(id)
    );
    INSERT INTO "Artists" (id, name) VALUES (1, 'Drake');
    INSERT INTO "Artists" (id, name) VALUES (2, 'The Weeknd');
    INSERT INTO "Artists" (id, name) VALUES (3, 'Taylor Swift');
    INSERT INTO "Albums" (id, name, artist) VALUES (1, 'Views', 1);
    INSERT INTO "Albums" (id, name, artist) VALUES (2, 'Dawn FM', 2);
    INSERT INTO "Albums" (id, name, artist) VALUES (3, 'Red', 3);
    `;
  await client.query(SQL);
};
const setUp = async() => {
  try {
    await client.connect();
    await syncAndSeed();
    console.log("connected to database");
    app.listen(port, () => console.log(`Listening on port ${port}...`));

  } catch (ex) {
    console.log(ex);
  }
};
setUp();
// client.connect();

// const albums = [
//     {id: 1, genre: 'hip-hop'},
//     {id: 2, genre: 'pop' },
//     {id: 3, genre: 'r&b'},
// ];



