document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsContainer = document.getElementById('resultsContainer');
  
    const performSearch = () => {
      const query = searchInput.value.trim();
      if (query !== '') {
        searchWeb(query)
          .then(searchResults => {
            if (searchResults.length > 0) {
              displaySearchResults(searchResults);
            } else {
              resultsContainer.innerHTML = '<p>No results found.</p>';
            }
          })
          .catch(error => {
            console.error('Error:', error);
            resultsContainer.innerHTML = '<p>An error occurred. Please try again later.</p>';
          });
      }
    };
  
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        performSearch();
      }
    });
  });
  
  
  async function searchWeb(query) {
    try {
      const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(query)}&callback=handleSearchResults`;
  
      return new Promise((resolve, reject) => {
        // Create a global callback function to handle the JSONP response
        window.handleSearchResults = (response) => {
          if (response.query && response.query.search) {
            const searchResults = response.query.search;
            resolve(searchResults);
          } else {
            resolve([]);
          }
        };
  
        const script = document.createElement('script');
        script.src = apiUrl;
  
        // Cleanup the callback function and script tag after the response is received
        script.onload = () => {
          delete window.handleSearchResults;
          document.body.removeChild(script);
        };
  
        script.onerror = () => {
          reject(new Error('An error occurred while fetching search results.'));
        };
  
        document.body.appendChild(script);
      });
    } catch (error) {
      console.error('Error searching Wikipedia:', error);
      return [];
    }
  }
  
  
  function displaySearchResults(searchResults) {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '';
  
    searchResults.forEach(result => {
      const resultItem = document.createElement('div');
      resultItem.classList.add('resultItem');
  
      const title = document.createElement('h3');
      title.classList.add('resultTitle');
      const titleLink = document.createElement('a');
      titleLink.href = `https://en.wikipedia.org/wiki/${encodeURIComponent(result.title)}`;
      titleLink.target = '_blank'; // Open link in a new tab
      titleLink.textContent = result.title;
      title.appendChild(titleLink);
  
      const snippet = document.createElement('p');
      snippet.classList.add('resultSnippet');
      snippet.innerHTML = result.snippet;
  
      resultItem.appendChild(title);
      resultItem.appendChild(snippet);
  
      resultsContainer.appendChild(resultItem);
    });
  }
  
  