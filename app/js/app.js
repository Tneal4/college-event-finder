// app scripting

let allEvents = [];

// Render events into the page
function renderEvents(events) {
    const eventList = document.getElementById("eventList");
    eventList.innerHTML = ""; // Clear old content

    if (events.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No events found.";
        message.style.textAlign = "center";
        message.style.padding = "1rem";
        message.style.color = "#777";
        eventList.appendChild(message);
        return;
    }

    events.forEach(event => {
        const card = document.createElement("div");
        card.classList.add("event-card");

        card.innerHTML = `
            <h2 class="event-title">${event.title}</h2>
            <p class="event-date">${event.date} • ${event.time}</p>
            <p class="event-description">${event.description}</p>
            <p class="event-category">${event.category}</p>
        `;

        eventList.appendChild(card);
    });
}

// Search Bar
function setupSearch() {
    const searchInput = document.getElementById("searchInput");
    if (!searchInput) {
        console.error("Search input not found");
        return;
    }

    searchInput.addEventListener("input", function () {
        const searchText = this.value.toLowerCase();

        const filteredEvents = allEvents.filter(event =>    ///very specifically so that every word can be searchable
            event.title.toLowerCase().includes(searchText) ||
            event.description.toLowerCase().includes(searchText) ||
            event.category.toLowerCase().includes(searchText)
        );

        renderEvents(filteredEvents);
    });
}

// Load events from JSON file
fetch("data/events.json")
    .then(response => response.json())
    .then(events => {

        // Sort events by date automatically
        events.sort((a, b) => new Date(a.date) - new Date(b.date));

        allEvents = events;
        console.log("Events loaded:", allEvents);

        renderEvents(allEvents);
        setupSearch();
    })
    .catch(error => {
        console.error("Error loading events:", error);
    });


console.log("College Event Finder application has loaded sucessfully.");
