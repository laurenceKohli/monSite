import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 8000;

// Middleware pour les JSON
app.use(express.json());

async function getDBConnection() {
    return open({
        filename: 'portfolio.sqlite',
        driver: sqlite3.Database
    });
}

// Endpoint pour récupérer les événements
app.get('/api/events', async (req, res) => {
    const db = await getDBConnection();
    try {
        // Récupérer les événements avec leurs expertises
        const events = await db.all(`
            SELECT 
                e.id,
                e.position,
                e.title,
                e.year,
                e.tag_id,
                GROUP_CONCAT(exp.title) as expertises
            FROM events e
            LEFT JOIN event_expertises ee ON e.id = ee.event_id
            LEFT JOIN expertises exp ON ee.expertise_id = exp.id
            GROUP BY e.id
        `);

        // Transformer les expertises en tableau
        events.forEach(event => {
            event.expertises = event.expertises ? event.expertises.split(',') : [];
        });

        res.json(events);
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    } finally {
        await db.close();
    }
});

// Route pour récupérer un événement spécifique avec ses relations
app.get('/api/events/:id', async (req, res) => {
    const db = await getDBConnection();
    try {
        // Récupérer l'événement avec son tag
        const event = await db.get(`
            SELECT e.*, t.color as tag_color
            FROM events e
            LEFT JOIN tags t ON e.tag_id = t.id
            WHERE e.id = ?
        `, [req.params.id]);

        if (!event) {
            return res.status(404).json({ error: 'Événement non trouvé' });
        }

        // Récupérer les expertises
        const expertises = await db.all(`
            SELECT e.title 
            FROM expertises e
            JOIN event_expertises ee ON e.id = ee.expertise_id
            WHERE ee.event_id = ?
        `, [req.params.id]);
        event.expertises = expertises.map(e => e.title);

        // Récupérer les images
        const images = await db.all(`
            SELECT image_path 
            FROM event_images 
            WHERE event_id = ?
        `, [req.params.id]);
        event.images = images.map(i => i.image_path);

        res.json(event);
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    } finally {
        await db.close();
    }
});

// Endpoint pour récupérer les tags
app.get('/api/tags', async (req, res) => {
    const db = await getDBConnection();
    try {
        const tags = await db.all('SELECT * FROM tags');
        res.json(tags);
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    } finally {
        await db.close();
    }
});

// Endpoint pour récupérer les formations
app.get('/api/formations', async (req, res) => {
    const db = await getDBConnection();
    const formations = await db.all('SELECT * FROM formations');
    await db.close();
    res.json(formations);
});

app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
});
