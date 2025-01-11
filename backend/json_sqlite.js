import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { readFile, unlink } from 'fs/promises';
import { existsSync } from 'fs';

// Lecture du fichier JSON
const jsonData = JSON.parse(
    await readFile(new URL('./eventsV2.json', import.meta.url))
);

async function createDatabase(db) {
    await db.exec(`
        CREATE TABLE IF NOT EXISTS tags (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            color TEXT NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            position TEXT NOT NULL,
            periode TEXT NOT NULL,
            title TEXT NOT NULL, 
            year TEXT NOT NULL,
            tag_id INTEGER,
            url TEXT,
            description TEXT,
            FOREIGN KEY (tag_id) REFERENCES tags (id)
        );
        
        CREATE TABLE IF NOT EXISTS expertises (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            title TEXT NOT NULL UNIQUE
        );
        
        CREATE TABLE IF NOT EXISTS event_expertises (
            event_id INTEGER,
            expertise_id INTEGER,
            PRIMARY KEY (event_id, expertise_id),
            FOREIGN KEY (event_id) REFERENCES events (id),
            FOREIGN KEY (expertise_id) REFERENCES expertises (id) 
        );
        
        CREATE TABLE IF NOT EXISTS event_images (
            event_id INTEGER,
            image_path TEXT NOT NULL,
            FOREIGN KEY (event_id) REFERENCES events (id)
        );
        
        CREATE TABLE IF NOT EXISTS formations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            debut TEXT NOT NULL,
            fin TEXT NOT NULL,
            title TEXT NOT NULL,
            ecole TEXT NOT NULL,
            lieu TEXT NOT NULL,
            description TEXT,
            lien TEXT
        )`
    );
}

async function insertData(db) {
    try {
        // Insert tags
        for (const tag of jsonData.tags) {
            await db.run(
                'INSERT INTO tags (name, color) VALUES (?, ?)',
                [tag.name, tag.color]
            );
        }

        // Insert events
        for (const event of jsonData.events) {
            const result = await db.run(
                'INSERT INTO events (position, periode, title, year, tag_id, description, url) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [event.position, event.periode, event.title, event.year, event.tag, event.description, event.url]
            );
            
            const eventId = result.lastID;

            // Insert expertises and event_expertises
            if (event.expertises) {
                for (const expertise of event.expertises) {
                    // Insérer l'expertise si elle n'existe pas
                    await db.run(
                        'INSERT OR IGNORE INTO expertises (title) VALUES (?)',
                        [expertise]
                    );
                    
                    // Récupérer l'ID de l'expertise
                    const expertiseRow = await db.get(
                        'SELECT id FROM expertises WHERE title = ?',
                        [expertise]
                    );
                    
                    // Créer la relation event_expertise
                    await db.run(
                        'INSERT INTO event_expertises (event_id, expertise_id) VALUES (?, ?)',
                        [eventId, expertiseRow.id]
                    );
                }
            }

            // Insert images
            if (event.images) {
                for (const image of event.images) {
                    await db.run(
                        'INSERT INTO event_images (event_id, image_path) VALUES (?, ?)',
                        [eventId, image]
                    );
                }
            }
        }

        // Insert formations
        for (const formation of jsonData.formations) {
            await db.run(
                'INSERT INTO formations (debut, fin, title, ecole, lieu, description, lien) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [
                    formation.debut,
                    formation.fin, 
                    formation.title,
                    formation.ecole,
                    formation.lieu,
                    formation.description,
                    formation.lien
                ]
            );
        }

        console.log('Données insérées avec succès');

    } catch (error) {
        console.error('Erreur lors de l\'insertion des données:', error);
        throw error;
    }
}

async function deleteDatabase() {
    const dbPath = './portfolio.sqlite';
    try {
        if (existsSync(dbPath)) {
            await unlink(dbPath);
            console.log('Base de données supprimée avec succès');
        }
    } catch (error) {
        console.error('Erreur lors de la suppression de la base:', error);
        throw error;
    }
}

async function main() {
    try {
        await deleteDatabase();
        
        const db = await open({
            filename: 'portfolio.sqlite',
            driver: sqlite3.Database
        });

        await createDatabase(db);
        await insertData(db);
        await db.close();
        
        console.log('Base de données initialisée avec succès');
    } catch (error) {
        console.error('Erreur d\'initialisation:', error);
        throw error;
    }
}

main();