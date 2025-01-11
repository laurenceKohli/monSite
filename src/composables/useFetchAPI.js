// Composable Vue.js 3 pour consommer une API avec fetch

import { ref } from 'vue';

/**
 * Hook pour récupérer des données d'une API avec `fetch`.
 * @param {string} url - L'URL de l'API.
 * @returns {{ data: Ref<any>, error: Ref<string | null>, isLoading: Ref<boolean>, fetchData: Function }}
 */
export function useFetchApi(url) {
    const baseUrl = import.meta.env.VITE_API_URL;
    const data = ref(null);
    const error = ref(null);
    const isLoading = ref(false);

    // Fonction pour effectuer la requête
    const fetchData = async () => {
        isLoading.value = true;
        error.value = null;

        try {
            const response = await fetch(baseUrl + url);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            data.value = await response.json();
        } catch (err) {
            error.value = err.message;
        } finally {
            isLoading.value = false;
        }
    };

    return { data, error, isLoading, fetchData };
}
