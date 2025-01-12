// import timelineData from '/backend/eventsV2.json';

// export const formations = timelineData.formations;

// export const anneesFormations = formations.flatMap(formation => {
//     const debutAnnee = parseInt(formation.debut.split('/')[2]);
//     const finAnnee = parseInt(formation.fin.split('/')[2]);

//     const annees = [];
//     for (let annee = debutAnnee; annee <= finAnnee; annee++) {
//         annees.push(annee);
//     }
//     return annees;
// });

// export const getFormationPosition = (formation, yearWidth, annees) => {
//     const [jourDebut, moisDebut, anneeDebut] = formation.debut.split('/').map(Number);
//     const [jourFin, moisFin, anneeFin] = formation.fin.split('/').map(Number);

//     const debutIndex = annees.indexOf(anneeDebut);
//     const finIndex = annees.indexOf(anneeFin);

//     const x = debutIndex * yearWidth + (moisDebut - 1) / 12 * yearWidth;
//     const width = (finIndex - debutIndex) * yearWidth +
//         ((moisFin - moisDebut + 1) / 12 * yearWidth);

//     return { x, width };
// };
import { ref, computed } from 'vue';
import { useFetchApi } from './useFetchAPI';

export const formations = ref([]);
const { data, error, fetchData } = useFetchApi('formations');

// Initialisation des formations
export const initFormations = async () => {
    await fetchData();
    if (data.value) {
        formations.value = data.value;
    }
};

export const anneesFormations = computed(() => {
    return formations.value.flatMap(formation => {
        const debutAnnee = parseInt(formation.debut.split('/')[2]);
        const finAnnee = parseInt(formation.fin.split('/')[2]);

        const annees = [];
        for (let annee = debutAnnee; annee <= finAnnee; annee++) {
            annees.push(annee);
        }
        return annees;
    });
});

export const getFormationPosition = (formation, yearWidth, annees) => {
    const [jourDebut, moisDebut, anneeDebut] = formation.debut.split('/').map(Number);
    const [jourFin, moisFin, anneeFin] = formation.fin.split('/').map(Number);

    const debutIndex = annees.indexOf(anneeDebut);
    const finIndex = annees.indexOf(anneeFin);

    const x = debutIndex * yearWidth + (moisDebut - 1) / 12 * yearWidth;
    const width = (finIndex - debutIndex) * yearWidth +
        ((moisFin - moisDebut + 1) / 12 * yearWidth);

    return { x, width };
};

// Initialiser les formations au démarrage
initFormations();