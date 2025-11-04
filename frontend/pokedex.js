document.addEventListener('DOMContentLoaded', () => {
    // --- Config ---
    const BACKEND_URL = 'http://localhost:3000';
    const POKEAPI_URL = 'https://pokeapi.co/api/v2/pokemon';

    // --- Element References ---
    const pokemonContainer = document.getElementById('pokemon-container');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const showAllBtn = document.getElementById('show-all-btn');
    const historyBtn = document.getElementById('history-btn'); // New button
    const loader = document.getElementById('loader');

    // --- State ---
    let allPokemonData = []; // Cache for all Pokemon

    // --- Functions ---

    /**
     * Hides the loader element.
     */
    function hideLoader() {
        if (loader) {
            loader.style.display = 'none';
        }
    }

    /**
     * Shows the loader element.
     */
    function showLoader() {
        if (loader) {
            loader.style.display = 'block';
        }
    }

    /**
     * Creates an HTML card for a single Pokemon.
     * @param {object} pokemon - Pokemon data object from PokeAPI.
     * @returns {string} - HTML string for the card.
     */
    function createPokemonCard(pokemon) {
        const name = pokemon.name;
        // Use the official-artwork sprite for better quality
        const imageUrl = pokemon.sprites.other['official-artwork'].front_default;
        const type = pokemon.types.map(t => t.type.name).join(', ');

        return `
            <div class="pokemon-card">
                <img src="${imageUrl}" alt="${name}">
                <h3 class="name">${name}</h3>
                <p class="type">Type: ${type}</p>
            </div>
        `;
    }

    /**
     * Creates an HTML card for a single search history item. (NEW)
     * @param {object} item - History item { term, timestamp }.
     * @returns {string} - HTML string for the card.
     */
    function createHistoryCard(item) {
        const localTime = new Date(item.timestamp).toLocaleString();
        return `
            <div class="history-card">
                <h3 class="term">${item.term}</h3>
                <p class="timestamp">${localTime}</p>
            </div>
        `;
    }

    /**
     * Renders a list of Pokemon data objects to the container.
     * @param {Array<object>} pokemonList - An array of Pokemon data objects.
     */
    function renderPokemonList(pokemonList) {
        pokemonContainer.innerHTML = ''; // Clear previous content
        const cardsHtml = pokemonList.map(createPokemonCard).join('');
        pokemonContainer.innerHTML = cardsHtml;
    }

    /**
     * Renders the search history list to the container. (NEW)
     * @param {Array<object>} historyList - An array of history items.
     */
    function renderSearchHistory(historyList) {
        pokemonContainer.innerHTML = ''; // Clear previous content
        if (historyList.length === 0) {
            pokemonContainer.innerHTML = '<p class="error-message">No search history found.</p>';
            return;
        }
        const cardsHtml = historyList.map(createHistoryCard).join('');
        pokemonContainer.innerHTML = cardsHtml;
    }

    /**
     * Fetches detailed data for a single Pokemon by its URL.
     * @param {string} url - The URL of the Pokemon resource.
     * @returns {Promise<object>} - A promise that resolves to the Pokemon's detailed data.
     */
    async function fetchPokemonDetails(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch details from ${url}`);
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    /**
     * Fetches the initial list of all Pokemon (first 151).
     */
    async function fetchAllPokemon() {
        showLoader();
        try {
            // 1. Fetch the initial list (which only has names and URLs)
            const response = await fetch(`${POKEAPI_URL}?limit=151`);
            if (!response.ok) {
                throw new Error('Failed to fetch initial Pokemon list.');
            }
            const data = await response.json();
            
            // 2. Create an array of promises to fetch details for each Pokemon
            const detailPromises = data.results.map(pokemon => fetchPokemonDetails(pokemon.url));
            
            // 3. Wait for all detail fetches to complete
            const detailedPokemon = await Promise.all(detailPromises);
            
            // 4. Filter out any null results (from failed fetches)
            allPokemonData = detailedPokemon.filter(p => p !== null);
            
            // 5. Render the list
            renderPokemonList(allPokemonData);

        } catch (error) {
            console.error('Error fetching all Pokemon:', error);
            pokemonContainer.innerHTML = '<p class="error-message">Could not load Pokemon. Please try again later.</p>';
        } finally {
            hideLoader();
        }
    }

    /**
     * Fetches the search history from the backend. (NEW)
     */
    async function fetchSearchHistory() {
        showLoader();
        pokemonContainer.innerHTML = ''; // Clear container

        try {
            const response = await fetch(`${BACKEND_URL}/api/history`);
            if (!response.ok) {
                throw new Error('Failed to fetch search history.');
            }
            const data = await response.json();
            
            if (data.success) {
                renderSearchHistory(data.history);
            } else {
                throw new Error(data.message || 'Could not retrieve history.');
            }

        } catch (error) {
            console.error('Error fetching history:', error);
            pokemonContainer.innerHTML = `<p class="error-message">${error.message}</p>`;
        } finally {
            hideLoader();
        }
    }


    /**
     * Logs a search term to the backend database.
     * @param {string} term - The search term to log.
     */
    async function logSearchToBackend(term) {
        try {
            await fetch(`${BACKEND_URL}/api/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ term: term }),
            });
            console.log(`Logged search: ${term}`);
        } catch (error) {
            console.error('Error logging search:', error);
            // Don't block the user's search even if logging fails
        }
    }

    /**
     * Handles the search form submission.
     * @param {Event} e - The form submission event.
     */
    async function handleSearch(e) {
        e.preventDefault();
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        if (!searchTerm) {
            return; // Do nothing if search is empty
        }

        showLoader();
        pokemonContainer.innerHTML = ''; // Clear container for search result

        try {
            // 1. Log the search to our backend (fire and forget)
            logSearchToBackend(searchTerm);

            // 2. Fetch the specific Pokemon from PokeAPI
            const response = await fetch(`${POKEAPI_URL}/${searchTerm}`);
            
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(`Pokemon not found: ${searchTerm}`);
                } else {
                    throw new Error(`API error: ${response.status}`);
                }
            }

            const pokemon = await response.json();
            
            // 3. Render the single Pokemon
            renderPokemonList([pokemon]); // Pass as an array

        } catch (error) {
            console.error('Error during search:', error);
            pokemonContainer.innerHTML = `<p class="error-message">${error.message}</p>`;
        } finally {
            hideLoader();
        }
    }

    /**
     * Handles the "Show All" button click.
     */
    function handleShowAll() {
        if (allPokemonData.length > 0) {
            renderPokemonList(allPokemonData);
        } else {
            // If cache is empty for some reason, re-fetch
            fetchAllPokemon();
        }
    }

// --- Event Listeners ---
    searchForm.addEventListener('submit', handleSearch);
    showAllBtn.addEventListener('click', handleShowAll);
    historyBtn.addEventListener('click', fetchSearchHistory); // New listener

    // --- Initial Load ---
    fetchAllPokemon();
});

