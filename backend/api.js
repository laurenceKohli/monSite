import express from 'express';
import mysql from 'mysql2/promise';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 8000;

// Middleware pour les JSON
app.use(express.json());

// Créer une fonction pour se connecter à la base de données
async function getDBConnection() {
    try {
        return await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
    } catch (error) {
        console.error('Erreur de connexion à la base de données:', error);
        throw new Error('Impossible de se connecter à la base de données');
    }
}

// Endpoint pour récupérer les événements
app.get('/api/events', async (req, res) => {
    const db = await getDBConnection();
    try {
        const [events] = await db.execute(`
            SELECT 
                e.id,
                e.position,
                e.title,
                e.year,
                e.tag_id,
                GROUP_CONCAT(exp.title) AS expertises
            FROM events e
            LEFT JOIN event_expertises ee ON e.id = ee.event_id
            LEFT JOIN expertises exp ON ee.expertise_id = exp.id
            GROUP BY e.id, e.position, e.title, e.year, e.tag_id
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
        db.end();
    }
});

// Route pour récupérer un événement spécifique avec ses relations
app.get('/api/events/:id', async (req, res) => {
    const db = await getDBConnection();
    try {
        const [[event]] = await db.execute(`
            SELECT e.*, t.color AS tag_color
            FROM events e
            LEFT JOIN tags t ON e.tag_id = t.id
            WHERE e.id = ?
        `, [req.params.id]);

        if (!event) {
            return res.status(404).json({ error: 'Événement non trouvé' });
        }

        const [expertises] = await db.execute(`
            SELECT e.title 
            FROM expertises e
            JOIN event_expertises ee ON e.id = ee.expertise_id
            WHERE ee.event_id = ?
        `, [req.params.id]);
        event.expertises = expertises.map(e => e.title);

        const [technologies] = await db.execute(`
            SELECT t.name
            FROM technologies t
            JOIN event_technologies et ON t.id = et.technologie_id
            WHERE et.event_id = ?
        `, [req.params.id]);
        event.technologies = technologies.map(t => t.name);

        const [images] = await db.execute(`
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
        db.end();
    }
});

// Endpoint pour récupérer les tags
app.get('/api/tags', async (req, res) => {
    const db = await getDBConnection();
    try {
        const [tags] = await db.execute('SELECT * FROM tags');
        res.json(tags);
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    } finally {
        db.end();
    }
});

// Endpoint pour récupérer les formations
app.get('/api/formations', async (req, res) => {
    const db = await getDBConnection();
    try {
        const [formations] = await db.execute('SELECT * FROM formations');
        res.json(formations);
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    } finally {
        db.end();
    }
});

app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
});
